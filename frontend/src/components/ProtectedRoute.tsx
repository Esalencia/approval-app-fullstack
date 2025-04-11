'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: string | string[];
  fallbackPath?: string;
}

/**
 * A component that protects routes based on user authentication and permissions
 *
 * @param children - The content to render if the user is authenticated and has the required permissions
 * @param requiredPermissions - The permission(s) required to access this route
 * @param fallbackPath - The path to redirect to if the user doesn't have the required permissions
 */
export default function ProtectedRoute({
  children,
  requiredPermissions,
  fallbackPath = '/unauthorized'
}: ProtectedRouteProps) {
  const { user, loading, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until auth state is loaded
    if (!loading) {
      // If no user is logged in, redirect to login
      if (!user) {
        // Store the full current URL to redirect back after login
        const currentUrl = window.location.href;
        console.log('Redirecting to login with callback URL:', currentUrl); // Debug log
        router.push(`/auth/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
        return;
      }

      // If permissions are required, check if the user has them
      if (requiredPermissions && !hasPermission(requiredPermissions)) {
        router.push(fallbackPath);
        return;
      }
    }
  }, [user, loading, requiredPermissions, hasPermission, router, fallbackPath]);

  // Show nothing while loading or redirecting
  if (loading || !user || (requiredPermissions && !hasPermission(requiredPermissions))) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#224057]"></div>
      </div>
    );
  }

  // If authenticated and authorized, render the children
  return <>{children}</>;
}
