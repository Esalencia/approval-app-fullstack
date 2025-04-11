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
        const storedRole = localStorage.getItem('userRole');

        console.log('Loading user with token:', token ? 'exists' : 'none');
        console.log('Stored role:', storedRole);

        if (token) {
          // Verify token and fetch user data
          const response = await fetch('http://localhost:5001/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log('Auth check response status:', response.status);

          if (response.ok) {
            const userData = await response.json();
            console.log('User data loaded:', userData);
            setUser(userData);
          } else {
            console.warn('Token validation failed, clearing auth data');
            // If token is invalid, clear auth data
            clearAuthData();
          }
        } else if (storedRole) {
          // If we have a role but no valid user data, create a minimal user object
          // This helps with role-based access control when the /me endpoint fails
          console.log('Creating minimal user object from stored role');
          setUser({
            id: 'temp-id',
            email: localStorage.getItem('userEmail') || 'user@example.com',
            role: storedRole as any,
            firstName: '',
            lastName: ''
          });
        }
      } catch (error) {
        console.error('Failed to load user', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    const clearAuthData = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      setUser(null);
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

      // Extract user role from response
      const userRole = data.role || data.user?.role;
      console.log('Login successful, user role:', userRole);

      // Store token and role in both localStorage and cookies
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userEmail', email);

      // Set cookies for middleware to access with expiration
      document.cookie = `token=${data.token}; path=/; max-age=86400;`; // 24 hours
      document.cookie = `userRole=${userRole}; path=/; max-age=86400;`;
      document.cookie = `userEmail=${email}; path=/; max-age=86400;`;

      setUser(data.user);

      // Check if there's a callback URL in the query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const callbackUrl = urlParams.get('callbackUrl');

      // Redirect based on callback URL or role
      if (callbackUrl) {
        // Decode the callback URL and redirect
        router.push(decodeURI(callbackUrl));
      } else {
        // Default role-based redirection
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
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('Logging out user');

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');

    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    setUser(null);
    router.push('/auth/login');
  };

  // Role check helper functions with case-insensitive comparison
  const isAdmin = () => {
    const role = user?.role?.toLowerCase();
    return role === 'admin' || role === 'superadmin';
  };

  const isInspector = () => {
    return user?.role?.toLowerCase() === 'inspector';
  };

  const isApplicant = () => {
    return user?.role?.toLowerCase() === 'applicant';
  };

  // Permission check based on role
  const hasPermission = (permission: string | string[]) => {
    if (!user) return false;

    // Define role permissions with a hierarchical structure
    const rolePermissions = {
      superadmin: [
        // Navigation permissions
        'access_admin_dashboard', 'access_inspector_dashboard', 'access_applicant_dashboard',
        // Admin permissions
        'manage_users', 'manage_all', 'view_all', 'add_inspector', 'view_inspectors',
        'view_applicants', 'view_applications', 'manage_payments', 'view_reports',
        // Inspector permissions
        'manage_inspections', 'view_assigned', 'schedule_inspections',
        // Applicant permissions
        'submit_application', 'view_own', 'upload_documents', 'make_payments',
        'schedule_inspection', 'view_certificate'
      ],
      admin: [
        // Navigation permissions
        'access_admin_dashboard',
        // Admin permissions
        'manage_users', 'manage_all', 'view_all', 'add_inspector', 'view_inspectors',
        'view_applicants', 'view_applications', 'manage_payments', 'view_reports'
      ],
      inspector: [
        // Navigation permissions
        'access_inspector_dashboard',
        // Inspector permissions
        'manage_inspections', 'view_assigned', 'schedule_inspections'
      ],
      applicant: [
        // Navigation permissions
        'access_applicant_dashboard',
        // Applicant permissions
        'submit_application', 'view_own', 'upload_documents', 'make_payments',
        'schedule_inspection', 'view_certificate'
      ]
    };

    // If checking for multiple permissions, all must be present
    if (Array.isArray(permission)) {
      return permission.every(perm => rolePermissions[user.role]?.includes(perm) || false);
    }

    // Single permission check
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
