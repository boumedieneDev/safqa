# Safqa Account Model

## Core Principle

Supabase `auth.users` is authentication only. The business identity lives in `profiles`.

Every person who signs in has one `profiles` row. That row decides:

- which side they belong to,
- which portal they enter,
- which data scope RLS allows them to see.

## Account Sides

### Platform

Used for global administration.

- Role: `super_admin`
- May have no `organization_id` and no `operator_id`.
- Enters the institution portal for now because there is no separate platform console yet.

### Public Institution

Represents the public-sector owner or manager of deals.

- Entity table: `organizations`
- Person table: `profiles`
- Required link: `profiles.organization_id`
- Forbidden link: `profiles.operator_id`

Institution roles:

- `institution_admin`
- `procurement_officer`
- `evaluation_committee`
- `auditor`
- `decision_maker`

### Economic Operator

Represents the party applying to deals.

- Entity table: `operators`
- Person table: `profiles`
- Required link: `profiles.operator_id`
- Forbidden link: `profiles.organization_id`

The operator itself can be:

- `company`
- `individual`
- `consortium`

Current operator role:

- `operator_user`

## Routing

Routing is centralized in `src/lib/auth/roles.ts`.

- Institution/platform roles go to `/institution/...`
- Operator roles go to `/operator/...`
- Suspended/inactive or malformed profiles are rejected before portal access.

## Database Enforcement

`supabase/account-model.sql` hardens existing databases with:

- role checks,
- account status checks,
- organization/operator assignment checks,
- `entity_type` for operators,
- `organization_kind` for public institutions,
- active-user RLS helper functions,
- `account_directory` view with RLS-respecting `security_invoker` behavior.

## Registration Workflow

The registration layer is now request-based, not open account creation.

- Public visitors submit registration requests from `/register/institution`, `/register/operator`, or `/register/individual`.
- `super_admin` reviews requests from `/admin/registrations`.
- Approval creates an `organizations` or `operators` row and a pending invitation.
- The invited person opens `/register/invite?token=...` and creates their Auth account.
- The database trigger creates the matching `profiles` row from the invitation.
- `institution_admin` can invite internal users from `/institution/users`.

Run `supabase/registration-workflows.sql` after `supabase/account-model.sql` to enable this flow.

## Remaining Product Hardening

- email delivery integration for invitation links,
- audit log writes for approve/reject/revoke actions,
- suspended/inactive account handling UI,
- optional stronger operator roles such as `operator_admin` and `operator_member` if needed.
