import type { OperatorEntityType, OrganizationKind, RegistrationRequestType, UserRole } from "@/types/domain";

export const organizationKindLabels: Record<OrganizationKind, string> = {
  public_institution: "مؤسسة عمومية",
  public_company: "شركة عمومية",
  oversight_body: "هيئة رقابة",
  platform_admin: "إدارة المنصة",
};

export const operatorEntityTypeLabels: Record<OperatorEntityType, string> = {
  company: "شركة",
  individual: "فرد",
  consortium: "تجمع/تحالف",
};

export const registrationRequestTypeLabels: Record<RegistrationRequestType, string> = {
  public_institution: "طلب جهة عمومية",
  economic_operator: "طلب متعامل اقتصادي",
  individual_operator: "طلب فرد كمتعامل",
};

export const institutionInviteRoles: UserRole[] = [
  "institution_admin",
  "procurement_officer",
  "evaluation_committee",
  "auditor",
  "decision_maker",
];

export const roleLabels: Record<UserRole, string> = {
  super_admin: "مشرف المنصة",
  institution_admin: "مدير المؤسسة",
  procurement_officer: "مسؤول الصفقات",
  evaluation_committee: "لجنة التقييم",
  auditor: "مدقق داخلي",
  decision_maker: "صاحب القرار",
  operator_user: "مستخدم متعامل اقتصادي",
};
