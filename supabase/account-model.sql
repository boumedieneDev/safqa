-- Safqa account and role model hardening.
-- Run this after schema.sql/seed.sql on an existing Supabase project.
--
-- Model:
-- 1. auth.users stores authentication only.
-- 2. profiles stores the individual person using the system.
-- 3. organizations stores public-sector institutions and oversight bodies.
-- 4. operators stores economic operators, which can be companies, individuals, or consortiums.
-- 5. A profile belongs to exactly one side:
--    - institution/platform roles: organization_id is set, operator_id is null.
--    - operator_user: operator_id is set, organization_id is null.
--    - super_admin may be platform-level without an organization/operator.

alter table organizations
  add column if not exists organization_kind text not null default 'public_institution';

alter table organizations
  drop constraint if exists organizations_organization_kind_check;

alter table organizations
  add constraint organizations_organization_kind_check
  check (organization_kind in ('public_institution', 'public_company', 'oversight_body', 'platform_admin'));

alter table operators
  add column if not exists entity_type text not null default 'company';

alter table operators
  add column if not exists legal_representative_name text;

alter table operators
  add column if not exists national_id text;

alter table operators
  drop constraint if exists operators_entity_type_check;

alter table operators
  add constraint operators_entity_type_check
  check (entity_type in ('company', 'individual', 'consortium'));

alter table profiles
  drop constraint if exists profiles_role_check;

alter table profiles
  add constraint profiles_role_check
  check (role in (
    'super_admin',
    'institution_admin',
    'procurement_officer',
    'evaluation_committee',
    'auditor',
    'decision_maker',
    'operator_user'
  ));

alter table profiles
  drop constraint if exists profiles_status_check;

alter table profiles
  add constraint profiles_status_check
  check (status in ('active', 'invited', 'suspended', 'inactive'));

alter table profiles
  drop constraint if exists profiles_role_assignment_check;

alter table profiles
  add constraint profiles_role_assignment_check
  check (
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
  );

create or replace view account_directory
with (security_invoker = true) as
select
  profiles.id,
  profiles.full_name,
  profiles.email,
  profiles.phone,
  profiles.role,
  profiles.status,
  case
    when profiles.role = 'super_admin' then 'platform'
    when profiles.role = 'operator_user' then 'operator'
    else 'institution'
  end as account_kind,
  profiles.organization_id,
  organizations.name as organization_name,
  organizations.organization_kind,
  profiles.operator_id,
  operators.name as operator_name,
  operators.entity_type as operator_entity_type,
  profiles.created_at,
  profiles.updated_at
from profiles
left join organizations on organizations.id = profiles.organization_id
left join operators on operators.id = profiles.operator_id;

create or replace function current_user_role()
returns text as $$
  select role from profiles where id = auth.uid() and status = 'active';
$$ language sql security definer stable;

create or replace function current_user_organization_id()
returns uuid as $$
  select organization_id from profiles where id = auth.uid() and status = 'active';
$$ language sql security definer stable;

create or replace function current_user_operator_id()
returns uuid as $$
  select operator_id from profiles where id = auth.uid() and status = 'active';
$$ language sql security definer stable;

create or replace function current_account_kind()
returns text as $$
  select case
    when role = 'super_admin' then 'platform'
    when role = 'operator_user' then 'operator'
    when role is not null then 'institution'
    else null
  end
  from profiles
  where id = auth.uid()
  and status = 'active';
$$ language sql security definer stable;

create or replace function is_institution_user()
returns boolean as $$
  select current_user_role() in (
    'super_admin',
    'institution_admin',
    'procurement_officer',
    'evaluation_committee',
    'auditor',
    'decision_maker'
  );
$$ language sql security definer stable;
