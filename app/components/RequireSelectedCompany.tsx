'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { hasValidSelectedCompanyInSession } from '../utils/selectedCompanySession';

type RequireSelectedCompanyProps = {
  children: ReactNode;
};

export default function RequireSelectedCompany({ children }: RequireSelectedCompanyProps) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!hasValidSelectedCompanyInSession()) {
      router.replace('/');
      return;
    }
    setAllowed(true);
  }, [router]);

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}
