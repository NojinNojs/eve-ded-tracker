'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

export default function UrlToaster() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const errorMsg = searchParams.get('error');
    if (errorMsg) {
      toast.error('Authentication Error', {
        description: errorMsg,
      });

      // Clear the query param without reloading the page
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('error');
      const newUrl = newParams.toString() ? `${pathname}?${newParams.toString()}` : pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  return null;
}
