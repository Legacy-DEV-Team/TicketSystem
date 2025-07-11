'use client';

import React from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // TODO: Implement proper authentication provider
  // For now, just render children without authentication
  return <>{children}</>;
} 