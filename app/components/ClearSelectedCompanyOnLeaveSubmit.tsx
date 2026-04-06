'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { clearSelectedCompanyFromSession } from '../utils/selectedCompanySession';

/**
 * Clears selectedCompany when the user navigates away from /submit.
 * Implemented via pathname transitions (not submit-tree unmount cleanup) so React
 * Strict Mode remounts in dev do not wipe storage before the guard runs.
 */
export default function ClearSelectedCompanyOnLeaveSubmit() {
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    const prev = prevPathRef.current;
    if (prev === '/submit' && pathname !== '/submit' && pathname !== '/submit/thank-you') {
      clearSelectedCompanyFromSession();
    }
    prevPathRef.current = pathname;
  }, [pathname]);

  return null;
}
