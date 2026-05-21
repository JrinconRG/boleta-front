'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { LoginPage } from '@/src/features/auth/presentation/components/LoginPage';

import { useAuthStore } from '@/src/features/auth/infrastructure/store/useAuthStore';

export default function LoginRoute() {
  const router = useRouter();

  const {
    isAuthenticated,
    hasHydrated,
    user
  } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;

    if (isAuthenticated) {
      if (user?.role === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/tickets');
      }
    }
  }, [
    hasHydrated,
    isAuthenticated,
    user,
    router
  ]);

  // Mientras hidrata
  if (!hasHydrated) {
    return null;
  }

  // Mientras redirige
  if (isAuthenticated) {
    return null;
  }

  return <LoginPage />;
}