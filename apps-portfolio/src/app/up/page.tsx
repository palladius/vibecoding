// src/app/up/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UpPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/config');
  }, [router]);

  return <div className="min-h-screen p-8">Redirecting...</div>;
}
