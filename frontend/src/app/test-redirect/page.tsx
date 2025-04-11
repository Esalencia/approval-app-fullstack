'use client';

import React from 'react';
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from '@/components/ProtectedRoute';

export default function TestRedirectPage() {
  const { user } = useAuth();
  
  return (
    <ProtectedRoute>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-[#224057] mb-4">Redirection Test Page</h1>
          <p className="mb-4">
            If you're seeing this page, the login redirection is working correctly!
          </p>
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-2">User Information:</h2>
            <pre className="bg-gray-100 p-3 rounded overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
