'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function InspectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredPermissions="access_inspector_dashboard">
      {children}
    </ProtectedRoute>
  );
}
