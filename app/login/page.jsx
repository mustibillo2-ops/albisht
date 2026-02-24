'use client';
export const dynamic = "force-dynamic";

import { Suspense } from 'react';
import LoginContent from './LoginContent';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

