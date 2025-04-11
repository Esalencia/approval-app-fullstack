'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredPermissions="access_admin_dashboard">
      {children}
    </ProtectedRoute>
  );
}
