-- Safqa demo Auth accounts
-- Run this file AFTER creating the users in Supabase Dashboard:
-- Authentication > Users > Add user
--
-- Use these credentials for testing:
-- superadmin@safqa.test   / SafqaDemo2026!
-- admin@safqa.test        / SafqaDemo2026!
-- procurement@safqa.test  / SafqaDemo2026!
-- evaluator@safqa.test    / SafqaDemo2026!
-- auditor@safqa.test      / SafqaDemo2026!
-- decision@safqa.test     / SafqaDemo2026!
-- operator@safqa.test     / SafqaDemo2026!
--
-- Make sure "Auto Confirm User" is enabled in the Add user dialog.

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
select
  auth_users.id,
  account.full_name,
  account.email,
  account.phone,
  account.role,
  nullif(account.organization_id, '')::uuid,
  nullif(account.operator_id, '')::uuid,
  'active'
from (
  values
    (
      'superadmin@safqa.test',
      'سليم منصور',
      '+213 560 00 00 00',
      'super_admin',
      '',
      ''
    ),
    (
      'admin@safqa.test',
      'أمينة بن سالم',
      '+213 560 10 00 01',
      'institution_admin',
      '22222222-2222-4222-8222-222222222222',
      ''
    ),
    (
      'procurement@safqa.test',
      'كمال عابد',
      '+213 560 10 00 02',
      'procurement_officer',
      '22222222-2222-4222-8222-222222222222',
      ''
    ),
    (
      'evaluator@safqa.test',
      'نادية مرابط',
      '+213 560 10 00 03',
      'evaluation_committee',
      '22222222-2222-4222-8222-222222222222',
      ''
    ),
    (
      'auditor@safqa.test',
      'مراد قاسمي',
      '+213 560 10 00 04',
      'auditor',
      '22222222-2222-4222-8222-222222222222',
      ''
    ),
    (
      'decision@safqa.test',
      'سعاد خليفة',
      '+213 560 10 00 05',
      'decision_maker',
      '22222222-2222-4222-8222-222222222222',
      ''
    ),
    (
      'operator@safqa.test',
      'يوسف منصوري',
      '+213 560 20 00 01',
      'operator_user',
      '',
      '33333333-3333-4333-8333-333333333333'
    )
) as account(email, full_name, phone, role, organization_id, operator_id)
join auth.users auth_users on lower(auth_users.email) = lower(account.email)
on conflict (id) do update
set
  full_name = excluded.full_name,
  email = excluded.email,
  phone = excluded.phone,
  role = excluded.role,
  organization_id = excluded.organization_id,
  operator_id = excluded.operator_id,
  status = 'active',
  updated_at = now();

select
  auth_users.email,
  profiles.full_name,
  profiles.role,
  profiles.organization_id,
  profiles.operator_id,
  auth_users.email_confirmed_at is not null as email_confirmed
from profiles
join auth.users auth_users on auth_users.id = profiles.id
where auth_users.email in (
  'superadmin@safqa.test',
  'admin@safqa.test',
  'procurement@safqa.test',
  'evaluator@safqa.test',
  'auditor@safqa.test',
  'decision@safqa.test',
  'operator@safqa.test'
)
order by profiles.role;
