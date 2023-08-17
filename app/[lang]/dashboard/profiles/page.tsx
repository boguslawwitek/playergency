'use client'
import { useRouter } from 'next/navigation';
import { Locale } from '../../../../i18n-config';
import { useEffect } from 'react';

export default function DashboardProfileRedirect({
    params: { lang },
  }: {
    params: { lang: Locale }
}) {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  }, [router])

  return (<></>)
}