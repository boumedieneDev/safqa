import type { UserRole } from "@/types/domain";

export type AccountKind = "platform" | "institution" | "operator";
export type PortalKind = "admin" | "institution" | "operator";

export interface RoleDefinition {
  role: UserRole;
  label: string;
  accountKind: AccountKind;
  homePath: string;
  description: string;
}

export interface AccountProfile {
  id?: string;
  role: UserRole;
  status?: string | null;
  organization_id?: string | null;
  operator_id?: string | null;
}

export const roleDefinitions: Record<UserRole, RoleDefinition> = {
  super_admin: {
    role: "super_admin",
    label: "مشرف المنصة",
    accountKind: "platform",
    homePath: "/admin/dashboard",
    description: "يدير إعدادات المنصة العامة ويملك صلاحيات عابرة للجهات.",
  },
  institution_admin: {
    role: "institution_admin",
    label: "مدير المؤسسة",
    accountKind: "institution",
    homePath: "/institution/dashboard",
    description: "يدير مستخدمي المؤسسة، الصفقات، الإعدادات، والتقارير.",
  },
  procurement_officer: {
    role: "procurement_officer",
    label: "مسؤول الصفقات",
    accountKind: "institution",
    homePath: "/institution/deals",
    description: "ينشئ الصفقات، يضبط الوثائق، وينشر الإعلانات.",
  },
  evaluation_committee: {
    role: "evaluation_committee",
    label: "عضو لجنة التقييم",
    accountKind: "institution",
    homePath: "/institution/deals",
    description: "يراجع العروض ويضيف نقاط التقييم الفني والمالي.",
  },
  auditor: {
    role: "auditor",
    label: "مدقق داخلي",
    accountKind: "institution",
    homePath: "/institution/audit-log",
    description: "يراجع سجل التدقيق والتنبيهات ومؤشرات المخاطر.",
  },
  decision_maker: {
    role: "decision_maker",
    label: "صاحب القرار",
    accountKind: "institution",
    homePath: "/institution/dashboard",
    description: "يتابع المؤشرات والنتائج لاتخاذ قرارات المنح والاعتماد.",
  },
  operator_user: {
    role: "operator_user",
    label: "مستخدم متعامل اقتصادي",
    accountKind: "operator",
    homePath: "/operator/dashboard",
    description: "يمثل شركة أو فرداً اقتصادياً لتقديم الملفات وتتبع المشاركات.",
  },
};

export const institutionRoles = Object.values(roleDefinitions)
  .filter((definition) => definition.accountKind === "institution" || definition.accountKind === "platform")
  .map((definition) => definition.role);

export const operatorRoles = Object.values(roleDefinitions)
  .filter((definition) => definition.accountKind === "operator")
  .map((definition) => definition.role);

export function getRoleDefinition(role: string | null | undefined) {
  if (!role || !(role in roleDefinitions)) {
    return null;
  }

  return roleDefinitions[role as UserRole];
}

export function getAccountKind(role: string | null | undefined): AccountKind | null {
  return getRoleDefinition(role)?.accountKind ?? null;
}

export function getPortalKind(role: string | null | undefined): PortalKind | null {
  const accountKind = getAccountKind(role);

  if (accountKind === "operator") {
    return "operator";
  }

  if (accountKind === "platform") {
    return "admin";
  }

  if (accountKind === "institution") {
    return "institution";
  }

  return null;
}

export function getHomePathForProfile(profile: AccountProfile) {
  return getRoleDefinition(profile.role)?.homePath ?? "/login";
}

export function isActiveProfile(profile: AccountProfile | null | undefined) {
  return !!profile && (profile.status == null || profile.status === "active");
}

export function isInstitutionRole(role: string | null | undefined) {
  const accountKind = getAccountKind(role);
  return accountKind === "institution" || accountKind === "platform";
}

export function isOperatorRole(role: string | null | undefined) {
  return getAccountKind(role) === "operator";
}

export function getProfileAssignmentIssue(profile: AccountProfile | null | undefined) {
  if (!profile) {
    return "missing_profile";
  }

  if (!getRoleDefinition(profile.role)) {
    return "unknown_role";
  }

  if (!isActiveProfile(profile)) {
    return "inactive_profile";
  }

  const accountKind = getAccountKind(profile.role);

  if (accountKind === "platform") {
    return null;
  }

  if (accountKind === "institution" && !profile.organization_id) {
    return "missing_organization";
  }

  if (accountKind === "institution" && profile.operator_id) {
    return "institution_has_operator";
  }

  if (accountKind === "operator" && !profile.operator_id) {
    return "missing_operator";
  }

  if (accountKind === "operator" && profile.organization_id) {
    return "operator_has_organization";
  }

  return null;
}
