export function getDealDocumentPath(organizationId: string, dealId: string, fileName: string) {
  return `deal-documents/${organizationId}/${dealId}/${fileName}`;
}

export function getOperatorDocumentPath(operatorId: string, fileName: string) {
  return `operator-documents/${operatorId}/${fileName}`;
}

export function getOfferDocumentPath(dealId: string, operatorId: string, applicationId: string, fileName: string) {
  return `offer-documents/${dealId}/${operatorId}/${applicationId}/${fileName}`;
}

export function getReportPath(organizationId: string, reportId: string) {
  return `reports/${organizationId}/${reportId}.pdf`;
}
