'use client';

import RequireSelectedCompany from '../components/RequireSelectedCompany';
import SubmitLeadForm from '../components/SubmitLeadForm';

export default function SubmitPage() {
  return (
    <RequireSelectedCompany>
      <SubmitLeadForm />
    </RequireSelectedCompany>
  );
}
