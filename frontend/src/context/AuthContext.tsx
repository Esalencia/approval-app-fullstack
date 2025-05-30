'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  email: string;
  role: 'admin' | 'applicant' | 'inspector' | 'superadmin';
  firstName: string;
  lastName: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAdmin: () => boolean;
  isInspector: () => boolean;
  isApplicant: () => boolean;
  hasPermission: (permission: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token and fetch user data
          const response = await fetch('http://localhost:5001/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // If token is invalid, clear auth data
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          }
        }
      } catch (error) {
        console.error('Failed to load user', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and role in both localStorage and cookies
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role || data.user?.role);
      localStorage.setItem('userEmail', email);

      // Set cookies for middleware to access
      document.cookie = `token=${data.token}; path=/;`;
      document.cookie = `userRole=${data.role || data.user?.role}; path=/;`;
      document.cookie = `userEmail=${email}; path=/;`;

      setUser(data.user);

      // Redirect based on role
      const userRole = data.role || data.user?.role;

      // Admin and superadmin go to admin dashboard
      if (userRole === 'admin' || userRole === 'superadmin' || email === 'admin@zimbuilds.com') {
        router.push('/admin');
      }
      // Inspectors go to inspector dashboard
      else if (userRole === 'inspector') {
        router.push('/inspector');
      }
      // All others (applicants) go to applicant dashboard
      else {
        router.push('/applicant');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');

    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    setUser(null);
    router.push('/auth/login');
  };

  // Role check helper functions
  const isAdmin = () => user?.role === 'admin';
  const isInspector = () => user?.role === 'inspector';
  const isApplicant = () => user?.role === 'applicant';

  // Permission check based on role
  const hasPermission = (permission: string) => {
    if (!user) return false;

    const rolePermissions = {
      admin: ['manage_users', 'manage_all', 'view_all', 'manage_inspections', 'view_assigned', 'submit_application', 'view_own'],
      inspector: ['manage_inspections', 'view_assigned'],
      applicant: ['submit_application', 'view_own']
    };

    return rolePermissions[user.role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      isAdmin,
      isInspector,
      isApplicant,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
