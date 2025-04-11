// pages/admin/dashboard.tsx
'use client';

import React from 'react';
import { useAuth } from "@/context/AuthContext";
import UserCard from '@/components/UserCard';
import DashboardLayout from '@/components/Dashboardlayout';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  return (
    <DashboardLayout userRole="admin">
      <div className="p-6 bg-gray-100 min-h-screen">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#224057]">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.firstName || 'Admin'}! Here's your application overview</p>
          </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <UserCard type="Todays Inspection" />
          <UserCard type="Pending review" />
          <UserCard type="Completed this Week" />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Applications Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[#224057] mb-4">Recent Inspections</h2>
              <div className="space-y-4">
                {/* ... existing content ... */}
              </div>

              <button className="mt-6 w-full py-2 px-4 border border-[#224057] text-[#224057] font-medium rounded-lg hover:bg-[#224057] hover:text-white transition-colors">
                View All Applications
              </button>
            </div>
          </div>

          {/* Upcoming Inspections Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[#224057] mb-4">Upcoming Inspections</h2>
              <div className="space-y-4">
                {/* ... existing content ... */}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-[#224057] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* ... existing quick action buttons ... */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;