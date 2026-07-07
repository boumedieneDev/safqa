# منصة الشفافية وتحليل المخاطر في الصفقات

## Codex Project Specification — Next.js + Supabase

هذا الملف موجّه لـ Codex لبناء منصة كاملة لإدارة الصفقات وتحليل المخاطر، باستعمال:

* Next.js App Router
* TypeScript
* Supabase Auth
* Supabase PostgreSQL
* Supabase Storage
* Row Level Security
* Tailwind CSS
* shadcn/ui
* Recharts
* TanStack Table
* React Hook Form + Zod

الواجهة الأساسية باللغة العربية وبتخطيط RTL.

---

# 1. فكرة المشروع

المنصة ليست SaaS تجارية.

هي منصة رقمية لإدارة الصفقات والشفافية وتحليل المخاطر، فيها واجهتان رئيسيتان:

## 1. واجهة الشركة / المؤسسة العمومية

هذه الواجهة تستعملها الجهة العمومية أو المؤسسة المالكة للصفقات.

وظيفتها:

* إنشاء الصفقات.
* نشر الصفقات.
* تحديد الوثائق المطلوبة.
* استقبال ملفات المتعاملين.
* تقييم العروض.
* تحليل المخاطر.
* حساب مؤشر الشفافية.
* تتبع مراحل الصفقة.
* إصدار التقارير.
* مراقبة المتعاملين.
* تتبع التنفيذ والملاحق Avenants.
* حفظ سجل تدقيق Audit Log.

## 2. واجهة المتعاملين الاقتصاديين

هذه الواجهة يستعملها المتعامل أو الشركة التي تريد التقديم على الصفقات.

وظيفتها:

* رؤية الصفقات المتاحة.
* تحميل دفتر الشروط والوثائق العمومية.
* معرفة الوثائق المطلوبة.
* رفع ملف المشاركة.
* رفع العرض التقني.
* رفع العرض المالي.
* تتبع حالة المشاركة.
* إدارة وثائقه الدائمة.
* استقبال الإشعارات.

---

# 2. ملاحظة مهمة حول AI

الأدوات المتقدمة مثل:

* AI Risk Engine
* Smart Matching
* AI Recommendations
* تحليل الوثائق بالذكاء الاصطناعي

يجب أن تظهر في الواجهة كـ modules واضحة، لكن لا تعمل فعلياً في البداية.

يتم إظهارها كـ placeholders مع رسالة مثل:

```text
هذه الخاصية غير مفعّلة حالياً.
سيتم تفعيل التحليل الذكي لاحقاً.
```

في البداية نعتمد على Rule-Based Risk Engine فقط.

---

# 3. الهيكلة العامة

```text
Platform
├── Public Institution Portal
│   ├── Dashboard
│   ├── Deals Management
│   ├── Deal Details
│   ├── Operators Management
│   ├── Risk Analysis
│   ├── Transparency Index
│   ├── Smart Matching Placeholder
│   ├── Reports
│   ├── Documents
│   ├── Audit Log
│   └── Settings
│
└── Operator Portal
    ├── Dashboard
    ├── Available Deals
    ├── Deal Details
    ├── Apply / Submit File
    ├── My Applications
    ├── Application Details
    ├── My Documents
    ├── Notifications
    └── Profile
```

---

# 4. Tech Stack

## Frontend

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide Icons
* Recharts
* TanStack Table
* React Hook Form
* Zod

## Backend

* Supabase Auth
* Supabase PostgreSQL
* Supabase Storage
* Supabase RLS
* Supabase Realtime لاحقاً للإشعارات

## Storage Buckets

```text
deal-documents
operator-documents
offer-documents
reports
```

---

# 5. Project Structure

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── forgot-password/
│   │
│   ├── (institution)/
│   │   ├── dashboard/
│   │   ├── deals/
│   │   │   ├── page.tsx
│   │   │   ├── create/
│   │   │   └── [id]/
│   │   ├── operators/
│   │   ├── risk-analysis/
│   │   ├── transparency/
│   │   ├── smart-matching/
│   │   ├── reports/
│   │   ├── documents/
│   │   ├── audit-log/
│   │   └── settings/
│   │
│   ├── (operator)/
│   │   ├── dashboard/
│   │   ├── available-deals/
│   │   ├── available-deals/[id]/
│   │   ├── apply/[dealId]/
│   │   ├── my-applications/
│   │   ├── my-applications/[id]/
│   │   ├── my-documents/
│   │   ├── notifications/
│   │   └── profile/
│   │
│   └── layout.tsx
│
├── components/
│   ├── layout/
│   ├── ui/
│   ├── charts/
│   ├── tables/
│   ├── deals/
│   ├── operators/
│   ├── applications/
│   ├── risk/
│   ├── transparency/
│   └── documents/
│
├── lib/
│   ├── supabase/
│   ├── auth/
│   ├── permissions/
│   ├── risk/
│   ├── transparency/
│   ├── matching/
│   ├── storage/
│   └── utils.ts
│
└── types/
```

---

# 6. UI Direction

## General Design

* واجهة بيضاء Light.
* Sidebar أزرق داكن على اليمين.
* RTL.
* Cards بيضاء بظلال خفيفة.
* ألوان واضحة للحالات.
* جداول نظيفة.
* Tabs داخل صفحات التفاصيل.
* Stepper في إنشاء الصفقة والتقديم.
* Charts واضحة.
* واجهة الشركة العمومية تحليلية.
* واجهة المتعامل بسيطة وعملية.

## Colors

```text
Blue: primary actions
Teal: transparency / security
Green: success / low risk / valid
Orange: medium risk / warning
Red: high risk / rejected / expired
Gray: inactive / neutral
```

---

# 7. Roles

```text
super_admin
institution_admin
procurement_officer
evaluation_committee
auditor
decision_maker
operator_user
```

## Permissions

### Institution users

* Create deals.
* Edit deals.
* Publish deals.
* Upload deal documents.
* Define required documents.
* Review submitted applications.
* Score offers.
* View risk alerts.
* View transparency index.
* Generate reports.
* View audit logs.

### Operator users

* View public deals.
* Download public documents.
* Submit applications.
* Upload required documents.
* Save drafts.
* Track application status.
* Manage reusable documents.

---

# 8. Routes

## Auth

```text
/login
/forgot-password
```

## Institution Portal

```text
/institution/dashboard
/institution/deals
/institution/deals/create
/institution/deals/[id]
/institution/operators
/institution/operators/[id]
/institution/risk-analysis
/institution/transparency
/institution/smart-matching
/institution/reports
/institution/documents
/institution/audit-log
/institution/settings
```

## Operator Portal

```text
/operator/dashboard
/operator/available-deals
/operator/available-deals/[id]
/operator/apply/[dealId]
/operator/my-applications
/operator/my-applications/[id]
/operator/my-documents
/operator/notifications
/operator/profile
```

---

# 9. Institution Portal Pages

## 9.1 Dashboard

تعرض:

* عدد الصفقات المفتوحة.
* صفقات عالية المخاطر.
* متوسط مؤشر الشفافية.
* عدد المتعاملين.
* صفقات قيد التقييم.
* صفقات متأخرة.
* التنبيهات الذكية.
* أكثر المتعاملين تكراراً.
* الصفقات ذات المخاطر العالية.

Charts:

* Gauge لمؤشر الشفافية.
* Donut لمستوى المخاطر.
* Radar لجودة الإجراءات.
* Line chart لاتجاه المخاطر.
* Bar chart لعدد الصفقات حسب الحالة.

---

## 9.2 Deals List

Route:

```text
/institution/deals
```

تحتوي على:

* زر إنشاء صفقة جديدة.
* بحث.
* Filters.
* جدول الصفقات.
* Pagination.

Columns:

```text
رقم الصفقة
عنوان الصفقة
الجهة
النوع
المجال
القيمة التقديرية
الحالة
مؤشر الشفافية
مستوى الخطر
آخر تحديث
إجراءات
```

Filters:

```text
السنة
الحالة
المجال
الجهة
مستوى الخطر
المتعامل الفائز
الصفقات المتأخرة
الصفقات التي فيها Avenants
```

---

## 9.3 Create Deal

Route:

```text
/institution/deals/create
```

Stepper:

### Step 1: معلومات عامة

* عنوان الصفقة.
* رقم الصفقة.
* نوع الصفقة.
* المجال.
* الجهة المالكة.
* المسؤول الداخلي.
* الوصف.
* القيمة التقديرية.
* العملة.
* المنطقة.
* تاريخ الإعلان.
* آخر أجل للتقديم.

### Step 2: الشروط والمعايير

* شروط المشاركة.
* معايير التقييم.
* الوثائق المطلوبة.
* مدة الإنجاز.
* هل توجد حصص Lots؟

### Step 3: الوثائق

* دفتر الشروط.
* الإعلان.
* محضر الفتح.
* محضر التقييم.
* وثائق تقنية.
* وثائق مالية.
* وثائق أخرى.

Visibility لكل وثيقة:

```text
internal
public
operators_after_submit
```

### Step 4: إعدادات التحليل

* تفعيل حساب مؤشر الشفافية.
* إظهار AI Risk Engine كـ placeholder.
* إظهار Smart Matching كـ placeholder.
* الحد الأدنى لعدد العروض.
* نسبة السعر المنخفض غير الطبيعي.
* حد الخطر المقبول.

### Step 5: مراجعة ونشر

* Summary.
* Missing fields warnings.
* Save draft.
* Publish.

---

## 9.4 Deal Details

Route:

```text
/institution/deals/[id]
```

Tabs:

```text
نظرة عامة
المراحل
العروض
الوثائق
تحليل المخاطر
مؤشر الشفافية
الملاحق
التنفيذ
سجل التدقيق
```

### Overview

* رقم الصفقة.
* عنوان الصفقة.
* الحالة.
* الجهة.
* تاريخ الإعلان.
* آخر أجل.
* القيمة التقديرية.
* عدد العروض.
* مؤشر الشفافية.
* مستوى الخطر.
* Timeline.
* التنبيهات.
* الوثائق الرئيسية.
* المتعاملون المشاركون.
* المتعامل المرشح للمنح.

### Stages

Stages:

```text
الإعلان
استقبال العروض
الفتح
التقييم التقني
التقييم المالي
المنح المؤقت
الطعون
المنح النهائي
التنفيذ
الاستلام
الإغلاق
```

كل مرحلة تحتوي على:

* status.
* started_at.
* ended_at.
* due_at.
* responsible user.
* documents.
* notes.
* delay indicator.

### Offers

جدول التطبيقات / العروض:

```text
المتعامل
السعر المقترح
المدة المقترحة
التقييم التقني
التقييم المالي
المجموع
حالة الملف
مستوى الخطر
إجراءات
```

Actions:

* View application.
* Review documents.
* Add score.
* Mark qualified.
* Reject.
* Select candidate winner.

### Documents

* Public docs.
* Internal docs.
* Stage-linked docs.
* Upload.
* Preview.
* Download.
* Change visibility.

### Risk Analysis

* نوع الخطر.
* الدرجة.
* السبب.
* الدليل.
* التوصية.
* الحالة.

AI panel:

```text
AI Risk Engine
الحالة: غير مفعّل حالياً
سيتم لاحقاً تحليل الأنماط والوثائق وربط البيانات آلياً.
```

### Transparency

Dimensions:

```text
اكتمال الوثائق
احترام الآجال
المنافسة
شفافية التقييم
التبريرات
إتاحة المعلومات
المجموع
```

### Avenants

* title.
* type.
* old amount.
* new amount.
* increase percentage.
* reason.
* risk impact.

### Execution

* progress.
* milestones.
* delay days.
* notes.
* completion status.

### Audit

* user.
* action.
* entity.
* old values.
* new values.
* date.

---

# 10. Operator Portal Pages

## 10.1 Operator Dashboard

Route:

```text
/operator/dashboard
```

Cards:

* الصفقات المتاحة.
* مشاركاتي.
* ملفات تحتاج إكمال.
* صفقات بانتظار التقييم.
* آخر أجل قريب.

Panels:

* صفقات مقترحة حسب المجال.
* آخر الإشعارات.
* حالة الوثائق.
* مشاركاتي الأخيرة.

واجهة المتعامل لازم تجاوب بسرعة على:

```text
أين أجد الصفقة؟
ما هي الوثائق المطلوبة؟
كيف أقدم؟
هل ملفي ناقص؟
ما حالة مشاركتي؟
```

---

## 10.2 Available Deals

Route:

```text
/operator/available-deals
```

تعرض الصفقات المفتوحة للتقديم.

Columns / Cards:

```text
رقم الصفقة
عنوان الصفقة
الجهة الناشرة
المجال
المنطقة
القيمة التقديرية إذا كانت ظاهرة
آخر أجل للتقديم
حالة الصفقة
عرض التفاصيل
تقديم ملف
```

Filters:

```text
المجال
الجهة
الولاية / المنطقة
آخر أجل
نوع الصفقة
الحالة
بحث بالعنوان أو الرقم
```

Statuses:

```text
مفتوحة
آخر أجل قريب
مغلقة
تم التقديم
```

---

## 10.3 Operator Deal Details

Route:

```text
/operator/available-deals/[id]
```

Tabs:

```text
نظرة عامة
الوثائق المطلوبة
دفتر الشروط
الأسئلة والتوضيحات
تقديم الملف
```

Show:

* عنوان الصفقة.
* الجهة الناشرة.
* الوصف.
* الشروط.
* الآجال.
* الوثائق المطلوبة.
* دفتر الشروط للتحميل.
* معايير التقييم إذا كانت علنية.
* CTA تقديم ملف المشاركة.

Do not show:

* internal risk score.
* internal transparency analysis.
* internal evaluations.
* other operators.
* internal notes.

---

## 10.4 Apply / Submit File

Route:

```text
/operator/apply/[dealId]
```

Stepper:

```text
Step 1: معلومات المتعامل
Step 2: الوثائق الإدارية
Step 3: العرض التقني
Step 4: العرض المالي
Step 5: مراجعة وإرسال
```

### Step 1

Auto-fill:

* company name.
* registration number.
* sector.
* address.
* contact.

### Step 2

For each required document:

* title.
* required badge.
* upload file.
* choose from My Documents.
* status.

Document statuses:

```text
مرفوعة
ناقصة
تحتاج تصحيح
مقبولة مبدئياً
```

### Step 3

* Upload technical offer PDF.
* Add notes.
* Supporting files.

### Step 4

* Proposed amount.
* Proposed duration.
* Upload financial offer PDF.
* Optional breakdown.

### Step 5

* Review all data.
* Show missing documents.
* Save draft.
* Submit.

Rules:

* Submission only before deadline.
* Draft editable.
* Submitted application locked after deadline.
* Updates after submission require institution permission.

---

## 10.5 My Applications

Route:

```text
/operator/my-applications
```

Columns:

```text
رقم الصفقة
عنوان الصفقة
الجهة
تاريخ التقديم
حالة الملف
مرحلة الصفقة
النتيجة
آخر تحديث
```

Statuses:

```text
مسودة
تم الإرسال
قيد الفتح
قيد التقييم
مؤهل تقنياً
غير مؤهل
فائز
غير فائز
ملف ناقص
طلب توضيح
```

---

## 10.6 Application Details

Route:

```text
/operator/my-applications/[id]
```

Show:

* Application status.
* Deal summary.
* Submitted documents.
* Missing documents.
* Institution notes.
* Clarification requests.
* Timeline.
* Result when published.
* Receipt / وصل الإيداع.

Actions:

* Continue draft.
* Upload missing document if allowed.
* Download receipt.
* Withdraw before deadline if allowed.

---

## 10.7 My Documents

Route:

```text
/operator/my-documents
```

Reusable documents:

* السجل التجاري.
* شهادة الضرائب.
* شهادة CNAS / CASNOS.
* شهادة التأهيل.
* المراجع المهنية.
* الميزانيات المالية.
* شهادات حسن التنفيذ.
* وثائق أخرى.

Fields:

* title.
* type.
* issue date.
* expiry date.
* file.
* status.

Statuses:

```text
صالحة
قاربت على الانتهاء
منتهية
تحتاج تحديث
قيد المراجعة
مرفوضة
```

Actions:

* Upload.
* Replace.
* Download.
* Delete if unused.
* Use in application.

---

# 11. Database Schema

Use Supabase PostgreSQL.

## organizations

```sql
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text,
  sector text,
  address text,
  phone text,
  email text,
  status text not null default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

## profiles

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  role text not null,
  organization_id uuid references organizations(id),
  operator_id uuid,
  status text not null default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

## operators

```sql
create table operators (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  registration_number text,
  tax_number text,
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
```

## deals

```sql
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
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

Deal statuses:

```text
draft
published
receiving_offers
opening
technical_evaluation
financial_evaluation
temporary_award
appeals
final_award
execution
delayed
completed
closed
cancelled
```

## deal_stages

```sql
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
```

## deal_requirements

```sql
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
```

## deal_documents

```sql
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
```

## operator_documents

```sql
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
```

## applications

```sql
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
```

Application statuses:

```text
draft
submitted
under_opening
under_evaluation
missing_documents
needs_clarification
technically_qualified
technically_rejected
financially_qualified
financially_rejected
winner
not_winner
withdrawn
rejected
```

## application_documents

```sql
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
```

## evaluation_criteria

```sql
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
```

## evaluation_scores

```sql
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
```

## transparency_scores

```sql
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
```

## risk_alerts

```sql
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
```

## risk_rules

```sql
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
```

## avenants

```sql
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
```

## execution_tracking

```sql
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
```

## operator_evaluations

```sql
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
```

## notifications

```sql
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
```

## reports

```sql
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
```

## audit_logs

```sql
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
```

---

# 12. RLS Rules

Create helper functions:

```sql
create or replace function current_user_role()
returns text as $$
  select role from profiles where id = auth.uid();
$$ language sql security definer;

create or replace function current_user_organization_id()
returns uuid as $$
  select organization_id from profiles where id = auth.uid();
$$ language sql security definer;

create or replace function current_user_operator_id()
returns uuid as $$
  select operator_id from profiles where id = auth.uid();
$$ language sql security definer;
```

Rules:

* Institution users see only their organization data.
* Operator users see public deals only.
* Operator users see only their own applications.
* Operator users see only their own documents.
* Internal risk analysis is hidden from operators.
* Internal evaluation is hidden from operators until result is published.
* Audit logs are internal only.

---

# 13. Risk Engine

Start with Rule-Based Risk Engine.

Risk formula:

```text
Risk Score =
ضعف المنافسة 25%
+ السعر غير الطبيعي 25%
+ تاريخ المتعامل 20%
+ Avenants 15%
+ التأخرات 15%
```

Rules:

```text
weak_competition:
if applications_count < minimum_required_offers

abnormally_low_offer:
if proposed_amount < average_amount * 0.7

repeated_operator:
if operator wins many times in same sector or institution

too_many_avenants:
if avenants_count > 3 or total increase > 20%

unjustified_delay:
if delay_days > configured threshold
```

AI remains placeholder only.

---

# 14. Transparency Engine

Score dimensions:

```text
documents_score: 20%
deadlines_score: 20%
competition_score: 20%
evaluation_score: 15%
justification_score: 15%
publication_score: 10%
```

Labels:

```text
مرتفع: 75 - 100
متوسط: 50 - 74
منخفض: 0 - 49
```

Show:

* total score.
* gauge chart.
* radar chart.
* score breakdown.
* trend over time.

---

# 15. Smart Matching

Route:

```text
/institution/smart-matching
```

For now use rule-based matching:

Inputs:

```text
مجال الصفقة
القيمة التقديرية
المنطقة
الخبرة المطلوبة
مدة الإنجاز
```

Output:

```text
المتعامل
نسبة الملاءمة
تقييم الأداء
مستوى الخطر
الخبرة
مبررات الاقتراح
القرار
```

Ranking factors:

```text
sector match
region match
performance_score
risk_score
previous participation
win history
document validity
```

AI advanced matching remains visible but disabled.

---

# 16. Components

## Layout

```text
InstitutionLayout
OperatorLayout
Topbar
InstitutionSidebar
OperatorSidebar
PageHeader
Breadcrumbs
```

## Shared UI

```text
MetricCard
StatusBadge
RiskBadge
TransparencyBadge
DataTable
FilterBar
SearchInput
EmptyState
LoadingState
UploadBox
DocumentCard
Timeline
Stepper
ConfirmDialog
```

## Charts

```text
GaugeChart
RiskDonut
RadarChart
LineTrendChart
StatusBarChart
ComparisonBarChart
```

## Deals

```text
DealFormStepper
DealSummaryCard
DealTimeline
DealDocumentsPanel
DealOffersTable
DealRiskPanel
DealTransparencyPanel
AvenantsTable
ExecutionProgress
```

## Operators

```text
OperatorProfileHeader
OperatorScoreCards
OperatorHistoryTable
OperatorRiskProfile
OperatorDocumentsTable
```

## Applications

```text
ApplicationStepper
RequiredDocumentUpload
ApplicationStatusTimeline
ApplicationReviewSummary
SubmissionReceipt
```

---

# 17. Demo Data

Create seed data.

Organizations:

```text
وزارة الصحة
مديرية المشاريع الصحية
```

Deals:

```text
2025/178 — إنجاز مركز صحي
2025/177 — توريد أجهزة طبية للمستشفيات
2025/176 — إنشاء جسر على طريق رئيسي
2025/175 — خدمات صيانة وتشغيل محطات المياه
2025/174 — توريد أثاث وتجهيزات للمدارس
```

Operators:

```text
شركة المستقبل للإنشاءات والمقاولات
مؤسسة البناء المتطور
شركة الإنماء للمشاريع
مؤسسة الرواد المتحدة
مؤسسة العهد للمقاولات
شركة الإنشاءات الحديثة
```

Risk examples:

```text
ضعف المنافسة — عدد المتنافسين أقل من 3
عرض منخفض بشكل غير طبيعي — أقل من 40% من الأسعار المرجعية
كثرة الملاحق — أكثر من 3 ملاحق على العقد
تأخرات غير مبررة — تأخر في الاعتمادات لأكثر من 30 يوم
```

---

# 18. File Upload Paths

```text
deal-documents/{organization_id}/{deal_id}/{file}
operator-documents/{operator_id}/{file}
offer-documents/{deal_id}/{operator_id}/{application_id}/{file}
reports/{organization_id}/{report_id}.pdf
```

---

# 19. Helpers

Create:

```ts
getDealStatusLabel(status)
getApplicationStatusLabel(status)
getRiskSeverityLabel(severity)
getDocumentStatusLabel(status)
getStatusColor(status)

calculateTransparencyScore(deal)
calculateRiskScore(deal, applications, operatorHistory)
rankOperatorsForDeal(deal, operators)
```

---

# 20. Product Rules

## Deal Visibility

* Operators see only public / published deals.
* Draft deals are internal.
* Closed deals are hidden unless configured otherwise.

## Application Rules

* One application per operator per deal.
* Draft can be edited.
* Submitted application is locked after deadline.
* Missing documents can be updated only if allowed.
* Operator cannot see other operators’ files.

## Evaluation Rules

* Evaluation committee scores internally.
* Operator sees result only when published.
* Internal scores remain hidden.

## Risk Rules

* Risk alerts are internal.
* Operators never see internal risk score.
* Operator may see generic notes like:

  * ملف ناقص
  * طلب توضيح
  * تم قبول الملف
  * تم رفض الملف

## Transparency Rules

* Institution sees detailed transparency score.
* Operator sees only public milestones/status unless transparency is explicitly published.

---

# 21. Final Goal

Build a complete Arabic-first procurement platform with:

```text
Institution Portal
+ Operator Portal
+ Deal Lifecycle
+ Digital Submissions
+ Document Management
+ Evaluation
+ Rule-Based Risk Engine
+ Transparency Index
+ Smart Matching Placeholder
+ AI Risk Engine Placeholder
+ Reports
+ Audit Log
+ Supabase Auth
+ Supabase Database
+ Supabase Storage
```

The product must feel like a serious government/procurement system, not a generic CRM.
