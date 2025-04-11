'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Helper function to redirect based on user role
  const redirectBasedOnRole = (userRole: string) => {
    console.log('Redirecting based on role:', userRole);

    // Special case for admin@zimbuilds.com
    if (email.toLowerCase() === 'admin@zimbuilds.com') {
      console.log('Admin email detected, redirecting to admin dashboard');
      router.replace('/admin');
      return;
    }

    // Normalize the role to lowercase for case-insensitive comparison
    const normalizedRole = userRole?.toLowerCase() || '';

    // Admin and superadmin go to admin dashboard
    if (normalizedRole === 'admin' || normalizedRole === 'superadmin') {
      console.log('Redirecting to admin dashboard');
      router.replace('/admin');
    }
    // Inspectors go to inspector dashboard
    else if (normalizedRole === 'inspector') {
      console.log('Redirecting to inspector dashboard');
      router.replace('/inspector');
    }
    // All others (applicants) go to applicant dashboard
    else {
      console.log('Redirecting to applicant dashboard');
      router.replace('/applicant');
    }
  };

  // Get the callback URL from the query parameters if it exists
  const getCallbackUrl = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const callbackUrl = urlParams.get('callbackUrl');
      console.log('Callback URL from query params:', callbackUrl); // Debug log
      return callbackUrl;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', { email, password: '***' });

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

      // Set cookies for middleware to access
      document.cookie = `token=${data.token}; path=/; max-age=86400;`; // 24 hours
      document.cookie = `userRole=${userRole}; path=/; max-age=86400;`;

      // Check if there's a callback URL to redirect to
      const callbackUrl = getCallbackUrl();

      if (callbackUrl) {
        // Redirect to the original URL the user was trying to access
        console.log('Redirecting to callback URL:', callbackUrl); // Debug log

        try {
          // Decode the URL and ensure it's a valid URL
          const decodedUrl = decodeURIComponent(callbackUrl);
          console.log('Decoded URL:', decodedUrl); // Debug log

          // Use replace instead of push for a cleaner navigation experience
          router.replace(decodedUrl);
        } catch (error) {
          console.error('Error redirecting to callback URL:', error);
          // Fall back to role-based redirection if there's an error with the callback URL
          redirectBasedOnRole(data.role || data.user?.role);
        }
      } else {
        // Default role-based redirection if no callback URL
        const userRole = data.role || data.user?.role;
        redirectBasedOnRole(userRole);
      }

    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-[#edf2f7]">
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?
            <Link href="/auth/register" className="text-indigo-600 hover:text-indigo-500 font-medium ml-1">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}