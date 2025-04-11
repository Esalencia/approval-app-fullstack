'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '@/components/Dashboardlayout';

interface Application {
  id: number;
  standnumber: string;
  postaladdress: string;
  estimatedcost: number;
  constructiontype: string;
  projectDescription: string;
  startdate: string;
  completiondate: string;

  buildingcontractor: string;
  architect: string;
  ownername: string;
  email: string;
  contact: string;
  purposeOfBuilding: string;
  created_at: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
}

export default function ApplicationsTable() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/applications');
        
        if (response.data?.data) {
          const data = Array.isArray(response.data.data) 
            ? response.data.data 
            : [response.data.data];
          
          // Ensure all fields have proper default values if they're null/undefined
          setApplications(data.map((app: any) => ({
            id: app.id,
            standnumber: app.standnumber,
            postaladdress: app.postaladdress,
            estimatedcost: Number(app.estimatedcost),
            constructiontype: app.constructiontype,
            projectDescription: app.projectDescription,
            startdate: app.startdate,
            completiondate: app.completiondate,
            buildingcontractor: app.buildingcontractor,
            architect: app.architect,
            ownername: app.ownername,
            email: app.email,
            contact: app.contact,
            purposeOfBuilding: app.purposeOfBuilding || '',
            created_at: app.created_at,
            status: app.status || 'Pending'
          })));
        } else {
          throw new Error('Invalid data structure from API');
        }
      } catch (err) {
        setError(axios.isAxiosError(err) 
          ? err.response?.data?.message || err.message 
          : 'Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = applications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(applications.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getStatusColor = (status: string = 'Pending') => {
    switch (status) {
      case 'Approved': return 'bg-green-500/20 text-green-900';
      case 'Rejected': return 'bg-red-500/20 text-red-900';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  if (loading) return (
  <DashboardLayout userRole="admin">
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#224057]"></div>
    </div>
    </DashboardLayout>
  );

  if (error) return (
    <DashboardLayout userRole='admin'>
    <div className="bg-red-50 border-l-4 border-red-500 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout userRole="admin">
    <div className="bg-[#edf2f7] min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#224057]">Building Plan Applications</h2>
                <p className="text-slate-500 mt-1">Review and manage submitted applications</p>
              </div>
              <button className="flex items-center gap-2 bg-[#224057] hover:bg-[#1a344d] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Application
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Stand Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Postal Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Estimated Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Construction Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Completion Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Contractor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Architect</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {currentItems.map((app) => (
                  <tr key={app.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#224057]">{app.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#224057]">{app.standnumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#224057]">{app.postaladdress}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#224057]">
                      {app.estimatedcost ? `$${app.estimatedcost.toLocaleString()}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#224057]">{app.constructiontype}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#224057]">
                      {formatDate(app.startdate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#224057]">
                      {formatDate(app.completiondate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#224057]">{app.buildingcontractor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#224057]">{app.architect}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#224057]">{app.ownername}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#224057]">{app.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#224057]">{app.contact}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(app.status)}`}>
                        {app.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#224057]">
                      {formatDate(app.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-[#224057] hover:text-[#1a344d] mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(indexOfLastItem, applications.length)}
              </span> of{' '}
              <span className="font-medium">{applications.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm ${currentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#224057] text-white hover:bg-[#1a344d]'}`}
              >
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-3 py-1 rounded-md text-sm ${currentPage === totalPages || totalPages === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#224057] text-white hover:bg-[#1a344d]'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}