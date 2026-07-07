create extension if not exists pgcrypto;

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text,
  organization_kind text not null default 'public_institution'
    check (organization_kind in ('public_institution', 'public_company', 'oversight_body', 'platform_admin')),
  sector text,
  address text,
  phone text,
  email text,
  status text not null default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table operators (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  entity_type text not null default 'company'
    check (entity_type in ('company', 'individual', 'consortium')),
  registration_number text,
  tax_number text,
  legal_representative_name text,
  national_id text,
  sector text,
  specialization text,
  address text,
  region text,
  phone text,
  email text,
  website text,
  status text not null default 'active',
  founded_at date,
  capital numeric,
  employee_count int,
  company_size text,
  classification text,
  performance_score numeric default 0,
  risk_score numeric default 0,
  win_rate numeric default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
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
  status text not null default 'active' check (status in ('active', 'invited', 'suspended', 'inactive')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint profiles_role_assignment_check check (
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

create table deals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  created_by uuid references profiles(id),
  reference text not null,
  title text not null,
  description text,
  type text,
  sector text,
  region text,
  estimated_value numeric,
  currency text default 'DZD',
  status text not null default 'draft',
  risk_score numeric default 0,
  transparency_score numeric default 0,
  published_at timestamptz,
  submission_deadline timestamptz,
  opening_date timestamptz,
  evaluation_start_date timestamptz,
  award_date timestamptz,
  execution_start_date timestamptz,
  execution_end_date timestamptz,
  is_public boolean default false,
  ai_enabled boolean default false,
  smart_matching_enabled boolean default false,
  minimum_required_offers int not null default 3,
  abnormal_low_offer_ratio numeric not null default 0.7,
  acceptable_risk_threshold numeric not null default 60,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (organization_id, reference)
);

create table deal_stages (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references deals(id) on delete cascade,
  name text not null,
  status text not null default 'not_started',
  started_at timestamptz,
  ended_at timestamptz,
  due_at timestamptz,
  responsible_user_id uuid references profiles(id),
  notes text,
  order_index int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table deal_requirements (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references deals(id) on delete cascade,
  title text not null,
  description text,
  requirement_type text not null,
  is_required boolean default true,
  allowed_file_types text[] default array['pdf'],
  max_file_size_mb int default 20,
  order_index int default 0,
  created_at timestamptz default now()
);

create table deal_documents (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references deals(id) on delete cascade,
  stage_id uuid references deal_stages(id),
  uploaded_by uuid references profiles(id),
  title text not null,
  document_type text,
  file_path text not null,
  file_name text,
  file_size bigint,
  mime_type text,
  visibility text not null default 'internal',
  status text not null default 'active',
  created_at timestamptz default now()
);

create table operator_documents (
  id uuid primary key default gen_random_uuid(),
  operator_id uuid not null references operators(id) on delete cascade,
  uploaded_by uuid references profiles(id),
  title text not null,
  document_type text not null,
  file_path text not null,
  file_name text,
  file_size bigint,
  mime_type text,
  issue_date date,
  expiry_date date,
  status text not null default 'valid',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table applications (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references deals(id) on delete cascade,
  operator_id uuid not null references operators(id) on delete cascade,
  submitted_by uuid references profiles(id),
  status text not null default 'draft',
  technical_score numeric,
  financial_score numeric,
  total_score numeric,
  proposed_amount numeric,
  proposed_duration_days int,
  notes text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references profiles(id),
  is_winner boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(deal_id, operator_id)
);

create table application_documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  requirement_id uuid references deal_requirements(id),
  operator_document_id uuid references operator_documents(id),
  uploaded_by uuid references profiles(id),
  title text not null,
  file_path text not null,
  file_name text,
  file_size bigint,
  mime_type text,
  status text not null default 'uploaded',
  review_notes text,
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

create table evaluation_criteria (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references deals(id) on delete cascade,
  title text not null,
  description text,
  criteria_type text not null,
  weight numeric not null default 0,
  max_score numeric default 100,
  order_index int default 0,
  created_at timestamptz default now()
);

create table evaluation_scores (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  criteria_id uuid not null references evaluation_criteria(id) on delete cascade,
  evaluator_id uuid references profiles(id),
  score numeric not null,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(application_id, criteria_id, evaluator_id)
);

create table transparency_scores (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references deals(id) on delete cascade,
  documents_score numeric default 0,
  deadlines_score numeric default 0,
  competition_score numeric default 0,
  evaluation_score numeric default 0,
  justification_score numeric default 0,
  publication_score numeric default 0,
  total_score numeric default 0,
  details jsonb default '{}'::jsonb,
  calculated_at timestamptz default now()
);

create table risk_alerts (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid references deals(id) on delete cascade,
  operator_id uuid references operators(id),
  application_id uuid references applications(id),
  risk_type text not null,
  severity text not null,
  score numeric default 0,
  reason text,
  evidence jsonb default '{}'::jsonb,
  recommendation text,
  status text not null default 'open',
  generated_by text not null default 'rules',
  created_at timestamptz default now(),
  resolved_at timestamptz,
  resolved_by uuid references profiles(id)
);

create table risk_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  risk_type text not null,
  description text,
  severity text not null default 'medium',
  threshold jsonb default '{}'::jsonb,
  weight numeric default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table avenants (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references deals(id) on delete cascade,
  title text not null,
  type text,
  old_amount numeric,
  new_amount numeric,
  increase_percentage numeric,
  old_deadline date,
  new_deadline date,
  reason text,
  approved_by uuid references profiles(id),
  approved_at timestamptz,
  file_path text,
  risk_impact text,
  created_at timestamptz default now()
);

create table execution_tracking (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references deals(id) on delete cascade,
  title text not null,
  description text,
  progress_percentage numeric default 0,
  status text not null default 'not_started',
  planned_start date,
  planned_end date,
  actual_start date,
  actual_end date,
  delay_days int default 0,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table operator_evaluations (
  id uuid primary key default gen_random_uuid(),
  operator_id uuid not null references operators(id) on delete cascade,
  deal_id uuid references deals(id),
  quality_score numeric default 0,
  delay_score numeric default 0,
  compliance_score numeric default 0,
  communication_score numeric default 0,
  final_score numeric default 0,
  notes text,
  evaluated_by uuid references profiles(id),
  created_at timestamptz default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_user_id uuid references profiles(id),
  organization_id uuid references organizations(id),
  operator_id uuid references operators(id),
  title text not null,
  body text,
  type text not null default 'info',
  entity_type text,
  entity_id uuid,
  is_read boolean default false,
  created_at timestamptz default now()
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  deal_id uuid references deals(id),
  operator_id uuid references operators(id),
  created_by uuid references profiles(id),
  title text not null,
  report_type text not null,
  file_path text,
  status text default 'generated',
  filters jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  organization_id uuid references organizations(id),
  entity_type text not null,
  entity_id uuid,
  action text not null,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz default now()
);

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

alter table organizations enable row level security;
alter table profiles enable row level security;
alter table operators enable row level security;
alter table deals enable row level security;
alter table deal_stages enable row level security;
alter table deal_requirements enable row level security;
alter table deal_documents enable row level security;
alter table operator_documents enable row level security;
alter table applications enable row level security;
alter table application_documents enable row level security;
alter table evaluation_criteria enable row level security;
alter table evaluation_scores enable row level security;
alter table transparency_scores enable row level security;
alter table risk_alerts enable row level security;
alter table risk_rules enable row level security;
alter table avenants enable row level security;
alter table execution_tracking enable row level security;
alter table operator_evaluations enable row level security;
alter table notifications enable row level security;
alter table reports enable row level security;
alter table audit_logs enable row level security;

create policy "institution users read own organization"
on organizations for select
using (id = current_user_organization_id() or current_user_role() = 'super_admin');

create policy "users read own profile"
on profiles for select
using (id = auth.uid() or organization_id = current_user_organization_id());

create policy "institution users read operators"
on operators for select
using (is_institution_user());

create policy "operator users read own operator"
on operators for select
using (id = current_user_operator_id());

create policy "institution users manage own deals"
on deals for all
using (organization_id = current_user_organization_id() or current_user_role() = 'super_admin')
with check (organization_id = current_user_organization_id() or current_user_role() = 'super_admin');

create policy "operators read public published deals"
on deals for select
using (is_public = true and status <> 'draft');

create policy "institution users read deal children"
on deal_stages for select
using (exists (
  select 1 from deals
  where deals.id = deal_stages.deal_id
  and (deals.organization_id = current_user_organization_id() or current_user_role() = 'super_admin')
));

create policy "institution users manage requirements"
on deal_requirements for all
using (exists (
  select 1 from deals
  where deals.id = deal_requirements.deal_id
  and (deals.organization_id = current_user_organization_id() or current_user_role() = 'super_admin')
))
with check (exists (
  select 1 from deals
  where deals.id = deal_requirements.deal_id
  and (deals.organization_id = current_user_organization_id() or current_user_role() = 'super_admin')
));

create policy "operators read requirements for public deals"
on deal_requirements for select
using (exists (
  select 1 from deals
  where deals.id = deal_requirements.deal_id
  and deals.is_public = true
  and deals.status <> 'draft'
));

create policy "institution users manage deal documents"
on deal_documents for all
using (exists (
  select 1 from deals
  where deals.id = deal_documents.deal_id
  and (deals.organization_id = current_user_organization_id() or current_user_role() = 'super_admin')
))
with check (exists (
  select 1 from deals
  where deals.id = deal_documents.deal_id
  and (deals.organization_id = current_user_organization_id() or current_user_role() = 'super_admin')
));

create policy "operators read public deal documents"
on deal_documents for select
using (
  visibility = 'public'
  and exists (
    select 1 from deals
    where deals.id = deal_documents.deal_id
    and deals.is_public = true
    and deals.status <> 'draft'
  )
);

create policy "operator users manage own reusable documents"
on operator_documents for all
using (operator_id = current_user_operator_id())
with check (operator_id = current_user_operator_id());

create policy "institution users read submitted applications for own deals"
on applications for select
using (exists (
  select 1 from deals
  where deals.id = applications.deal_id
  and (deals.organization_id = current_user_organization_id() or current_user_role() = 'super_admin')
));

create policy "operator users manage own applications"
on applications for all
using (operator_id = current_user_operator_id())
with check (operator_id = current_user_operator_id());

create policy "institution users read application documents"
on application_documents for select
using (exists (
  select 1 from applications
  join deals on deals.id = applications.deal_id
  where applications.id = application_documents.application_id
  and (deals.organization_id = current_user_organization_id() or current_user_role() = 'super_admin')
));

create policy "operator users manage own application documents"
on application_documents for all
using (exists (
  select 1 from applications
  where applications.id = application_documents.application_id
  and applications.operator_id = current_user_operator_id()
))
with check (exists (
  select 1 from applications
  where applications.id = application_documents.application_id
  and applications.operator_id = current_user_operator_id()
));

create policy "institution users read internal evaluation"
on evaluation_criteria for select
using (exists (
  select 1 from deals
  where deals.id = evaluation_criteria.deal_id
  and (deals.organization_id = current_user_organization_id() or current_user_role() = 'super_admin')
));

create policy "institution users manage scores"
on evaluation_scores for all
using (is_institution_user())
with check (is_institution_user());

create policy "institution users read transparency"
on transparency_scores for select
using (exists (
  select 1 from deals
  where deals.id = transparency_scores.deal_id
  and (deals.organization_id = current_user_organization_id() or current_user_role() = 'super_admin')
));

create policy "institution users read risk alerts"
on risk_alerts for select
using (is_institution_user());

create policy "institution users manage risk rules"
on risk_rules for all
using (is_institution_user())
with check (is_institution_user());

create policy "institution users read contract execution"
on avenants for select
using (exists (
  select 1 from deals
  where deals.id = avenants.deal_id
  and (deals.organization_id = current_user_organization_id() or current_user_role() = 'super_admin')
));

create policy "institution users read execution tracking"
on execution_tracking for select
using (exists (
  select 1 from deals
  where deals.id = execution_tracking.deal_id
  and (deals.organization_id = current_user_organization_id() or current_user_role() = 'super_admin')
));

create policy "institution users read operator evaluations"
on operator_evaluations for select
using (is_institution_user());

create policy "users read own notifications"
on notifications for select
using (
  recipient_user_id = auth.uid()
  or organization_id = current_user_organization_id()
  or operator_id = current_user_operator_id()
);

create policy "institution users read reports"
on reports for select
using (
  organization_id = current_user_organization_id()
  or current_user_role() = 'super_admin'
);

create policy "institution users read audit logs"
on audit_logs for select
using (
  organization_id = current_user_organization_id()
  and current_user_role() in ('super_admin', 'institution_admin', 'auditor')
);

insert into storage.buckets (id, name, public)
values
  ('deal-documents', 'deal-documents', false),
  ('operator-documents', 'operator-documents', false),
  ('offer-documents', 'offer-documents', false),
  ('reports', 'reports', false)
on conflict (id) do nothing;

create policy "institution users manage deal storage"
on storage.objects for all
using (bucket_id in ('deal-documents', 'reports') and is_institution_user())
with check (bucket_id in ('deal-documents', 'reports') and is_institution_user());

create policy "operator users manage own operator and offer storage"
on storage.objects for all
using (
  bucket_id in ('operator-documents', 'offer-documents')
  and owner = auth.uid()
)
with check (
  bucket_id in ('operator-documents', 'offer-documents')
  and owner = auth.uid()
);
