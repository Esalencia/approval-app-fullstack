'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

interface WorkflowProtectedRouteProps {
  children: ReactNode;
  applicationId: string | number;
  requiredStage: number;
  fallbackPath?: string;
}

/**
 * A component that protects routes based on workflow stage
 * 
 * @param children - The content to render if the user has access to this workflow stage
 * @param applicationId - The ID of the application
 * @param requiredStage - The minimum stage required to access this route
 * @param fallbackPath - The path to redirect to if the user doesn't have access
 */
export default function WorkflowProtectedRoute({
  children,
  applicationId,
  requiredStage,
  fallbackPath = '/applicant'
}: WorkflowProtectedRouteProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkStageAccess = async () => {
      if (!applicationId) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `http://localhost:5001/api/workflow/applications/${applicationId}/stage/${requiredStage}/accessible`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to check stage access');
        }

        const data = await response.json();
        setHasAccess(data.accessible);
      } catch (error) {
        console.error('Error checking stage access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkStageAccess();
  }, [applicationId, requiredStage]);

  useEffect(() => {
    if (!loading && !hasAccess) {
      router.replace(fallbackPath);
    }
  }, [loading, hasAccess, router, fallbackPath]);

  // First ensure the user is authenticated
  return (
    <ProtectedRoute requiredPermissions="access_applicant_dashboard">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#224057]"></div>
        </div>
      ) : hasAccess ? (
        children
      ) : null}
    </ProtectedRoute>
  );
}
