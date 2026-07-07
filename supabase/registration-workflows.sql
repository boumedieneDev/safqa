-- Safqa registration and invitation workflows.
-- Run after schema.sql and account-model.sql.

create table if not exists registration_requests (
  id uuid primary key default gen_random_uuid(),
  request_type text not null check (request_type in ('public_institution', 'economic_operator', 'individual_operator')),
  entity_name text not null,
  organization_kind text check (organization_kind in ('public_institution', 'public_company', 'oversight_body', 'platform_admin')),
  operator_entity_type text check (operator_entity_type in ('company', 'individual', 'consortium')),
  sector text,
  specialization text,
  address text,
  region text,
  phone text,
  email text not null,
  contact_name text not null,
  registration_number text,
  tax_number text,
  national_id text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  review_notes text,
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text not null,
  phone text,
  role text not null check (role in (
    'super_admin',
    'institution_admin',
    'procurement_officer',
    'evaluation_committee',
    'auditor',
    'decision_maker',
    'operator_user'
  )),
  organization_id uuid references organizations(id),
  operator_id uuid references operators(id),
  token uuid not null default gen_random_uuid(),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked', 'expired')),
  invited_by uuid references profiles(id),
  expires_at timestamptz not null default (now() + interval '14 days'),
  accepted_by uuid references profiles(id),
  accepted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (token),
  constraint invitations_role_assignment_check check (
    role = 'super_admin'
    or (
      role in ('institution_admin', 'procurement_officer', 'evaluation_committee', 'auditor', 'decision_maker')
      and organization_id is not null
      and operator_id is null
    )
    or (
      role = 'operator_user'
      and operator_id is not null
      and organization_id is null
    )
  )
);

create unique index if not exists invitations_pending_email_key
on invitations (lower(email))
where status = 'pending';

create index if not exists registration_requests_status_created_at_idx
on registration_requests (status, created_at desc);

create index if not exists invitations_status_expires_at_idx
on invitations (status, expires_at);

alter table registration_requests enable row level security;
alter table invitations enable row level security;

grant select, insert on registration_requests to anon, authenticated;
grant update on registration_requests to authenticated;
grant select, insert, update on invitations to authenticated;

drop policy if exists "public creates registration requests" on registration_requests;
create policy "public creates registration requests"
on registration_requests for insert
with check (status = 'pending');

drop policy if exists "super admins manage registration requests" on registration_requests;
create policy "super admins manage registration requests"
on registration_requests for all
using (current_user_role() = 'super_admin')
with check (current_user_role() = 'super_admin');

drop policy if exists "super admins manage invitations" on invitations;
create policy "super admins manage invitations"
on invitations for all
using (current_user_role() = 'super_admin')
with check (current_user_role() = 'super_admin');

drop policy if exists "institution admins read own invitations" on invitations;
create policy "institution admins read own invitations"
on invitations for select
using (
  current_user_role() = 'institution_admin'
  and organization_id = current_user_organization_id()
);

drop policy if exists "institution admins create own user invitations" on invitations;
create policy "institution admins create own user invitations"
on invitations for insert
with check (
  current_user_role() = 'institution_admin'
  and organization_id = current_user_organization_id()
  and operator_id is null
  and invited_by = auth.uid()
  and role in ('institution_admin', 'procurement_officer', 'evaluation_committee', 'auditor', 'decision_maker')
);

drop policy if exists "institution admins update own pending invitations" on invitations;
create policy "institution admins update own pending invitations"
on invitations for update
using (
  current_user_role() = 'institution_admin'
  and organization_id = current_user_organization_id()
  and status = 'pending'
)
with check (
  current_user_role() = 'institution_admin'
  and organization_id = current_user_organization_id()
  and operator_id is null
  and invited_by = auth.uid()
  and role in ('institution_admin', 'procurement_officer', 'evaluation_committee', 'auditor', 'decision_maker')
);

drop policy if exists "super admins manage organizations" on organizations;
create policy "super admins manage organizations"
on organizations for all
using (current_user_role() = 'super_admin')
with check (current_user_role() = 'super_admin');

drop policy if exists "super admins manage operators" on operators;
create policy "super admins manage operators"
on operators for all
using (current_user_role() = 'super_admin')
with check (current_user_role() = 'super_admin');

drop policy if exists "super admins manage profiles" on profiles;
create policy "super admins manage profiles"
on profiles for all
using (current_user_role() = 'super_admin')
with check (current_user_role() = 'super_admin');

create or replace function get_invitation_by_token(invite_token uuid)
returns table (
  email text,
  full_name text,
  phone text,
  role text,
  organization_name text,
  operator_name text,
  status text,
  expires_at timestamptz
) as $$
  select
    invitations.email,
    invitations.full_name,
    invitations.phone,
    invitations.role,
    organizations.name as organization_name,
    operators.name as operator_name,
    case
      when invitations.status = 'pending' and invitations.expires_at <= now() then 'expired'
      else invitations.status
    end as status,
    invitations.expires_at
  from invitations
  left join organizations on organizations.id = invitations.organization_id
  left join operators on operators.id = invitations.operator_id
  where invitations.token = invite_token;
$$ language sql security definer stable;

grant execute on function get_invitation_by_token(uuid) to anon, authenticated;

create or replace function approve_registration_request(
  request_id uuid,
  review_decision text,
  notes text default null
)
returns table (
  created_entity_id uuid,
  created_invitation_id uuid,
  invitation_token uuid,
  resulting_status text
) as $$
declare
  request_row registration_requests%rowtype;
  new_org_id uuid;
  new_operator_id uuid;
  new_invitation_id uuid;
  new_invitation_token uuid;
begin
  if current_user_role() <> 'super_admin' then
    raise exception 'Only super_admin can review registration requests.';
  end if;

  select * into request_row
  from registration_requests
  where id = request_id
  for update;

  if not found then
    raise exception 'Registration request was not found.';
  end if;

  if request_row.status <> 'pending' then
    raise exception 'Registration request is already reviewed.';
  end if;

  if review_decision = 'rejected' then
    update registration_requests
    set
      status = 'rejected',
      review_notes = notes,
      reviewed_by = auth.uid(),
      reviewed_at = now(),
      updated_at = now()
    where id = request_id;

    return query select null::uuid, null::uuid, null::uuid, 'rejected'::text;
    return;
  end if;

  if review_decision <> 'approved' then
    raise exception 'Unsupported review decision.';
  end if;

  if request_row.request_type = 'public_institution' then
    insert into organizations (
      name,
      type,
      organization_kind,
      sector,
      address,
      phone,
      email,
      status
    )
    values (
      request_row.entity_name,
      'institution',
      coalesce(request_row.organization_kind, 'public_institution'),
      request_row.sector,
      request_row.address,
      request_row.phone,
      request_row.email,
      'active'
    )
    returning id into new_org_id;

    insert into invitations (
      email,
      full_name,
      phone,
      role,
      organization_id,
      invited_by
    )
    values (
      lower(request_row.email),
      request_row.contact_name,
      request_row.phone,
      'institution_admin',
      new_org_id,
      auth.uid()
    )
    returning id, token into new_invitation_id, new_invitation_token;
  else
    insert into operators (
      name,
      entity_type,
      registration_number,
      tax_number,
      legal_representative_name,
      national_id,
      sector,
      specialization,
      address,
      region,
      phone,
      email,
      status
    )
    values (
      request_row.entity_name,
      case
        when request_row.request_type = 'individual_operator' then 'individual'
        else coalesce(request_row.operator_entity_type, 'company')
      end,
      request_row.registration_number,
      request_row.tax_number,
      request_row.contact_name,
      request_row.national_id,
      request_row.sector,
      request_row.specialization,
      request_row.address,
      request_row.region,
      request_row.phone,
      request_row.email,
      'active'
    )
    returning id into new_operator_id;

    insert into invitations (
      email,
      full_name,
      phone,
      role,
      operator_id,
      invited_by
    )
    values (
      lower(request_row.email),
      request_row.contact_name,
      request_row.phone,
      'operator_user',
      new_operator_id,
      auth.uid()
    )
    returning id, token into new_invitation_id, new_invitation_token;
  end if;

  update registration_requests
  set
    status = 'approved',
    review_notes = notes,
    reviewed_by = auth.uid(),
    reviewed_at = now(),
    updated_at = now()
  where id = request_id;

  return query select
    coalesce(new_org_id, new_operator_id),
    new_invitation_id,
    new_invitation_token,
    'approved'::text;
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function approve_registration_request(uuid, text, text) to authenticated;

create or replace function handle_new_user_invitation()
returns trigger as $$
declare
  invite_token_text text;
  invite_row invitations%rowtype;
begin
  invite_token_text := new.raw_user_meta_data ->> 'invitation_token';

  if invite_token_text is null or invite_token_text = '' then
    return new;
  end if;

  select * into invite_row
  from invitations
  where token = invite_token_text::uuid
  for update;

  if not found then
    raise exception 'Invitation was not found.';
  end if;

  if invite_row.status <> 'pending' or invite_row.expires_at <= now() then
    raise exception 'Invitation is no longer valid.';
  end if;

  if lower(invite_row.email) <> lower(new.email) then
    raise exception 'Invitation email does not match the new user email.';
  end if;

  insert into profiles (
    id,
    full_name,
    email,
    phone,
    role,
    organization_id,
    operator_id,
    status
  )
  values (
    new.id,
    coalesce(nullif(invite_row.full_name, ''), new.email),
    lower(new.email),
    invite_row.phone,
    invite_row.role,
    invite_row.organization_id,
    invite_row.operator_id,
    'active'
  );

  update invitations
  set
    status = 'accepted',
    accepted_by = new.id,
    accepted_at = now(),
    updated_at = now()
  where id = invite_row.id;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created_invitation on auth.users;
create trigger on_auth_user_created_invitation
after insert on auth.users
for each row execute function handle_new_user_invitation();
