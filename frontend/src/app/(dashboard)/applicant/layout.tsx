'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredPermissions="access_applicant_dashboard">
      {children}
    </ProtectedRoute>
  );
}
