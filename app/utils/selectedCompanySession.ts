export type SelectedCompanySession = {
  companyName?: string;
  companyUid?: string;
};

export function readSelectedCompanyFromSession(): SelectedCompanySession {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(sessionStorage.getItem('selectedCompany') || '{}') as SelectedCompanySession;
  } catch {
    return {};
  }
}

export function hasValidSelectedCompanyInSession(): boolean {
  const { companyName, companyUid } = readSelectedCompanyFromSession();
  return Boolean(
    typeof companyName === 'string' &&
      companyName.trim() !== '' &&
      typeof companyUid === 'string' &&
      companyUid.trim() !== ''
  );
}

export function clearSelectedCompanyFromSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('selectedCompany');
}
