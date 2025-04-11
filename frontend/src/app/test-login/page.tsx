'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TestLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<any>({});
  const router = useRouter();

  // Check current auth status
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');
    
    // Check cookies
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };
    
    const tokenCookie = getCookie('token');
    const roleCookie = getCookie('userRole');
    
    setAuthStatus({
      localStorage: {
        token: token ? 'exists' : 'none',
        userRole,
        userEmail
      },
      cookies: {
        token: tokenCookie ? 'exists' : 'none',
        userRole: roleCookie
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Test login attempt with:', { email, password: '***' });
      
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Extract user role from response
      const userRole = data.role || data.user?.role;
      console.log('User role from response:', userRole);
      
      if (!data.token) {
        throw new Error('No token received from server');
      }
      
      // Store token and user role in both localStorage and cookies
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userEmail', email);

      // Set cookies for middleware to access
      document.cookie = `token=${data.token}; path=/; max-age=86400;`; // 24 hours
      document.cookie = `userRole=${userRole}; path=/; max-age=86400;`;
      document.cookie = `userEmail=${email}; path=/; max-age=86400;`;
      
      // Update auth status
      setAuthStatus(prev => ({
        ...prev,
        loginResponse: data,
        localStorage: {
          token: 'exists',
          userRole,
          userEmail: email
        },
        cookies: {
          token: 'exists',
          userRole
        }
      }));
      
      // Show success message
      setError('Login successful! Check the auth status below.');
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAuth = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');

    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Update auth status
    setAuthStatus({
      localStorage: {
        token: 'none',
        userRole: null,
        userEmail: null
      },
      cookies: {
        token: 'none',
        userRole: null
      }
    });
    
    setError('Auth data cleared!');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#224057]">Test Login</h1>
        
        {error && (
          <div className={`p-3 rounded mb-4 ${error.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#224057] focus:border-[#224057]"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#224057] focus:border-[#224057]"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#224057] text-white py-2 px-4 rounded-md hover:bg-[#1a344a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#224057] disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Test Login'}
          </button>
        </form>
        
        <div className="mt-4">
          <button
            onClick={handleClearAuth}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Clear Auth Data
          </button>
        </div>
        
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Current Auth Status:</h2>
          <div className="bg-gray-100 p-3 rounded-md overflow-auto max-h-60">
            <pre className="text-xs">{JSON.stringify(authStatus, null, 2)}</pre>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between">
          <Link href="/auth/login" className="text-[#224057] hover:underline">
            Regular Login
          </Link>
          <Link href="/test-redirect" className="text-[#224057] hover:underline">
            Test Protected Route
          </Link>
        </div>
      </div>
    </div>
  );
}
