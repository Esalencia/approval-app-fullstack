//aplicant page.tsx
'use client';

import React from 'react';
import { useAuth } from "@/context/AuthContext";
import UserCard from '@/components/UserCard';
import DashboardLayout from '@/components/Dashboardlayout';

const ApplicantDashboard: React.FC = () => {
  const { user } = useAuth();
  return (
    <DashboardLayout userRole="applicant">
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#224057]">Applicant Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your application overview</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <UserCard type="application" />
        <UserCard type="inspection" />
        <UserCard type="payment" />
        <UserCard type="document-verification" />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#224057] mb-4">Recent Applications</h2>
            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900">Commercial Building</h3>
                  <span className="px-2 py-1 bg-yellow-50 text-yellow-600 text-xs font-medium rounded-full">
                    Pending Review
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <p>ID: APP001 | Submitted: 15 Mar 2024</p>
                  <p className="mt-1">Stand No: 1456, Harare</p>
                </div>
              </div>

              <div className="pb-4 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900">Residential Complex</h3>
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                    Document Approval
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <p>ID: APP002 | Submitted: 10 Mar 2024</p>
                  <p className="mt-1">Stand No: 789, Bulawayo</p>
                </div>
              </div>
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
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900">Foundation Inspection</h3>
                  <span className="px-2 py-1 bg-white text-blue-600 text-xs font-medium rounded-full border border-blue-200">
                    Scheduled
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>20 Mar 2024 - 10:00 AM</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>123 Construction Site, Harare</span>
                  </div>
                </div>
                <button className="mt-4 w-full py-2 px-4 bg-[#224057] text-white font-medium rounded-lg hover:bg-[#1a344a] transition-colors">
                  View Inspection Details
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900">Structural Inspection</h3>
                <p className="text-sm text-gray-600 mt-1">To be scheduled after foundation approval</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-[#224057] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-[#224057] transition-colors">
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-[#224057]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="mt-2 text-sm font-medium">New Application</span>
            </div>
          </button>
          <button className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-[#224057] transition-colors">
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-[#224057]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="mt-2 text-sm font-medium">Upload Documents</span>
            </div>
          </button>
          <button className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-[#224057] transition-colors">
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-[#224057]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="mt-2 text-sm font-medium">Make Payment</span>
            </div>
          </button>
          <button className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-[#224057] transition-colors">
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-[#224057]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="mt-2 text-sm font-medium">Schedule Inspection</span>
            </div>
          </button>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default ApplicantDashboard;