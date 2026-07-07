export type UserRole =
  | "super_admin"
  | "institution_admin"
  | "procurement_officer"
  | "evaluation_committee"
  | "auditor"
  | "decision_maker"
  | "operator_user";

export type AccountStatus = "active" | "invited" | "suspended" | "inactive";
export type OrganizationKind = "public_institution" | "public_company" | "oversight_body" | "platform_admin";
export type OperatorEntityType = "company" | "individual" | "consortium";
export type RegistrationRequestType = "public_institution" | "economic_operator" | "individual_operator";
export type RegistrationRequestStatus = "pending" | "approved" | "rejected";
export type InvitationStatus = "pending" | "accepted" | "revoked" | "expired";

export type DealStatus =
  | "draft"
  | "published"
  | "receiving_offers"
  | "opening"
  | "technical_evaluation"
  | "financial_evaluation"
  | "temporary_award"
  | "appeals"
  | "final_award"
  | "execution"
  | "delayed"
  | "completed"
  | "closed"
  | "cancelled";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_opening"
  | "under_evaluation"
  | "missing_documents"
  | "needs_clarification"
  | "technically_qualified"
  | "technically_rejected"
  | "financially_qualified"
  | "financially_rejected"
  | "winner"
  | "not_winner"
  | "withdrawn"
  | "rejected";

export type RiskSeverity = "low" | "medium" | "high" | "critical";
export type RequirementType = "administrative" | "technical" | "financial";
export type DocumentVisibility = "internal" | "public" | "operators_after_submit";
export type StageStatus = "not_started" | "in_progress" | "completed" | "delayed";
export type OperatorDocumentStatus =
  | "valid"
  | "expiring"
  | "expired"
  | "needs_update"
  | "under_review"
  | "rejected";

export interface Organization {
  id: string;
  name: string;
  type: string;
  organizationKind?: OrganizationKind;
  sector: string;
  address: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
}

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  organizationId?: string;
  operatorId?: string;
  status: AccountStatus;
}

export interface Operator {
  id: string;
  name: string;
  entityType: OperatorEntityType;
  registrationNumber: string;
  taxNumber: string;
  sector: string;
  specialization: string;
  address: string;
  region: string;
  phone: string;
  email: string;
  status: "active" | "suspended" | "under_review";
  foundedAt: string;
  capital: number;
  employeeCount: number;
  companySize: "small" | "medium" | "large";
  classification: string;
  performanceScore: number;
  riskScore: number;
  winRate: number;
  previousParticipations: number;
  previousWins: number;
  validDocumentsPercent: number;
}

export interface RegistrationRequest {
  id: string;
  requestType: RegistrationRequestType;
  entityName: string;
  organizationKind?: OrganizationKind;
  operatorEntityType?: OperatorEntityType;
  sector?: string;
  specialization?: string;
  address?: string;
  region?: string;
  phone?: string;
  email: string;
  contactName: string;
  registrationNumber?: string;
  taxNumber?: string;
  nationalId?: string;
  status: RegistrationRequestStatus;
  reviewNotes?: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface Invitation {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  organizationId?: string;
  operatorId?: string;
  token: string;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
  acceptedAt?: string;
}

export interface DealRequirement {
  id: string;
  dealId: string;
  title: string;
  description: string;
  requirementType: RequirementType;
  isRequired: boolean;
  allowedFileTypes: string[];
  maxFileSizeMb: number;
  orderIndex: number;
}

export interface DealDocument {
  id: string;
  dealId: string;
  title: string;
  documentType: string;
  filePath: string;
  fileName: string;
  visibility: DocumentVisibility;
  status: "active" | "archived";
  createdAt: string;
}

export interface DealStage {
  id: string;
  dealId: string;
  name: string;
  status: StageStatus;
  startedAt?: string;
  endedAt?: string;
  dueAt: string;
  responsibleName: string;
  notes: string;
  orderIndex: number;
}

export interface EvaluationCriterion {
  id: string;
  dealId: string;
  title: string;
  criteriaType: "technical" | "financial" | "compliance";
  weight: number;
  maxScore: number;
}

export interface Deal {
  id: string;
  organizationId: string;
  reference: string;
  title: string;
  description: string;
  type: string;
  sector: string;
  region: string;
  estimatedValue: number;
  currency: "DZD";
  status: DealStatus;
  publishedAt?: string;
  submissionDeadline: string;
  openingDate?: string;
  evaluationStartDate?: string;
  awardDate?: string;
  executionStartDate?: string;
  executionEndDate?: string;
  isPublic: boolean;
  aiEnabled: boolean;
  smartMatchingEnabled: boolean;
  minimumRequiredOffers: number;
  abnormalLowOfferRatio: number;
  acceptableRiskThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  dealId: string;
  operatorId: string;
  status: ApplicationStatus;
  technicalScore?: number;
  financialScore?: number;
  totalScore?: number;
  proposedAmount?: number;
  proposedDurationDays?: number;
  notes?: string;
  submittedAt?: string;
  isWinner: boolean;
  missingDocuments: number;
}

export interface ApplicationDocument {
  id: string;
  applicationId: string;
  requirementId?: string;
  title: string;
  fileName: string;
  status: "uploaded" | "missing" | "needs_correction" | "accepted";
  reviewNotes?: string;
}

export interface OperatorDocument {
  id: string;
  operatorId: string;
  title: string;
  documentType: string;
  fileName: string;
  issueDate: string;
  expiryDate: string;
  status: OperatorDocumentStatus;
}

export interface RiskAlert {
  id: string;
  dealId?: string;
  operatorId?: string;
  applicationId?: string;
  riskType: string;
  severity: RiskSeverity;
  score: number;
  reason: string;
  evidence: Record<string, string | number | boolean>;
  recommendation: string;
  status: "open" | "reviewing" | "resolved";
  generatedBy: "rules" | "ai";
  createdAt: string;
}

export interface TransparencyScore {
  dealId: string;
  documentsScore: number;
  deadlinesScore: number;
  competitionScore: number;
  evaluationScore: number;
  justificationScore: number;
  publicationScore: number;
  totalScore: number;
  calculatedAt: string;
}

export interface Avenant {
  id: string;
  dealId: string;
  title: string;
  type: string;
  oldAmount: number;
  newAmount: number;
  increasePercentage: number;
  oldDeadline?: string;
  newDeadline?: string;
  reason: string;
  riskImpact: RiskSeverity;
}

export interface ExecutionTracking {
  id: string;
  dealId: string;
  title: string;
  description: string;
  progressPercentage: number;
  status: "not_started" | "in_progress" | "delayed" | "completed";
  plannedStart: string;
  plannedEnd: string;
  delayDays: number;
  notes: string;
}

export interface AuditLog {
  id: string;
  userName: string;
  organizationId: string;
  entityType: string;
  entityId: string;
  action: string;
  summary: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  recipientType: "institution" | "operator";
  title: string;
  body: string;
  type: "info" | "warning" | "success" | "danger";
  entityType?: string;
  entityId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Report {
  id: string;
  title: string;
  reportType: string;
  status: "generated" | "draft";
  createdAt: string;
}

export interface OperatorMatch {
  operator: Operator;
  score: number;
  reasons: string[];
  decision: "recommended" | "review" | "avoid";
}
