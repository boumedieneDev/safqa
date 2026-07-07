import type { UserRole } from "@/types/domain";
import { isInstitutionRole as isInstitutionAccountRole } from "@/lib/auth/roles";

export function isInstitutionRole(role: UserRole) {
  return isInstitutionAccountRole(role);
}

export function canManageDeals(role: UserRole) {
  return ["super_admin", "institution_admin", "procurement_officer"].includes(role);
}

export function canEvaluateOffers(role: UserRole) {
  return ["super_admin", "institution_admin", "evaluation_committee"].includes(role);
}

export function canViewAuditLog(role: UserRole) {
  return ["super_admin", "institution_admin", "auditor"].includes(role);
}

export function canSubmitApplication(role: UserRole) {
  return role === "operator_user";
}
