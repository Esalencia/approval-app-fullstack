'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import DashboardLayout from '@/components/Dashboardlayout'

interface Inspector {
  id: number
  first_name: string
  last_name: string
  email: string
  password: string
  contact: string
  work_id: string
  license_number: string
  specialization: string
  available: boolean
  assigned_district: string
  inspection_type: string
  created_at: string
  updated_at: string
}

export default function InspectorsTable() {
  const [inspectors, setInspectors] = useState<Inspector[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [editInspector, setEditInspector] = useState<Inspector | null>(null)

  // Fetch inspectors
  useEffect(() => {
  const fetchInspectors = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/inspectors')
      setInspectors(response.data.data.inspectors || [])
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : 'Failed to fetch inspectors'
      )
    } finally {
      setLoading(false)
    }
  }
  fetchInspectors()
}, [])


  // Delete inspector
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5001/api/inspectors/${id}`)
      setInspectors(inspectors.filter(inspector => inspector.id !== id))
      setDeleteConfirm(null)
    } catch (err) {
      setError(axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : 'Failed to delete inspector')
    }
  }

  // Update inspector
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editInspector) return

    try {
      const response = await axios.put(
        `http://localhost:5001/api/inspectors/${editInspector.id}`,
        editInspector
      )
      setInspectors(inspectors.map(i => 
        i.id === editInspector.id ? response.data.data : i
      ))
      setEditInspector(null)
    } catch (err) {
      setError(axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : 'Failed to update inspector')
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return 'Invalid date'
    }
  }

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = inspectors.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(inspectors.length / itemsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (loading) return (
    <DashboardLayout userRole="admin">
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#224057]"></div>
      </div>
    </DashboardLayout>
  )

  if (error) return (
    <DashboardLayout userRole="admin">
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
  )

  return (
    <DashboardLayout userRole="admin">
      <div className="bg-[#edf2f7] min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#224057]">Building Inspectors</h2>
                  <p className="text-slate-500 mt-1">Manage inspector accounts and assignments</p>
                </div>
                <button 
                  className="flex items-center gap-2 bg-[#224057] hover:bg-[#1a344d] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => setEditInspector({
                    id: 0,
                    first_name: '',
                    last_name: '',
                    email: '',
                    password: '',
                    contact: '',
                    work_id: '',
                    license_number: '',
                    specialization: '',
                    available: true,
                    assigned_district: '',
                    inspection_type: '',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  })}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Inspector
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Password</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Work ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Specialization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">District</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Inspection Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Available</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#224057] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {currentItems.map((inspector) => (
                    <tr key={inspector.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#224057]">{inspector.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#224057]">
                        {inspector.first_name} {inspector.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#224057]">{inspector.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#224057]">{inspector.password}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#224057]">{inspector.contact}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#224057]">{inspector.work_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#224057]">{inspector.specialization}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#224057]">{inspector.assigned_district}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#224057]">{inspector.inspection_type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          inspector.available 
                            ? 'bg-green-500/20 text-green-900' 
                            : 'bg-red-500/20 text-red-900'
                        }`}>
                          {inspector.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#224057]">
                        {formatDate(inspector.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-[#224057] hover:text-[#1a344d] mr-3"
                          onClick={() => setEditInspector(inspector)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => setDeleteConfirm(inspector.id)}
                        >
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
                  {Math.min(indexOfLastItem, inspectors.length)}
                </span> of{' '}
                <span className="font-medium">{inspectors.length}</span> inspectors
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

        {/* Edit Modal */}
        {editInspector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-medium text-[#224057] mb-4">
                  {editInspector.id ? 'Edit Inspector' : 'Add New Inspector'}
                </h3>
                <form onSubmit={handleUpdate}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#224057] focus:border-[#224057]"
                          value={editInspector.first_name}
                          onChange={(e) => setEditInspector({...editInspector, first_name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#224057] focus:border-[#224057]"
                          value={editInspector.last_name}
                          onChange={(e) => setEditInspector({...editInspector, last_name: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#224057] focus:border-[#224057]"
                        value={editInspector.email}
                        onChange={(e) => setEditInspector({...editInspector, email: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <input
                        type="password"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#224057] focus:border-[#224057]"
                        value={editInspector.password}
                        onChange={(e) => setEditInspector({...editInspector, contact: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#224057] focus:border-[#224057]"
                        value={editInspector.contact}
                        onChange={(e) => setEditInspector({...editInspector, contact: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Work ID</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#224057] focus:border-[#224057]"
                        value={editInspector.work_id}
                        onChange={(e) => setEditInspector({...editInspector, work_id: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Specialization</label>
                      <select
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#224057] focus:border-[#224057]"
                        value={editInspector.specialization}
                        onChange={(e) => setEditInspector({...editInspector, specialization: e.target.value})}
                      >
                        <option value="">Select Specialization</option>
                        <option value="Structural">Structural</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Assigned District</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#224057] focus:border-[#224057]"
                        value={editInspector.assigned_district}
                        onChange={(e) => setEditInspector({...editInspector, assigned_district: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Inspection Type</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#224057] focus:border-[#224057]"
                        value={editInspector.inspection_type}
                        onChange={(e) => setEditInspector({...editInspector, inspection_type: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="available"
                        className="h-4 w-4 text-[#224057] focus:ring-[#224057] border-gray-300 rounded"
                        checked={editInspector.available}
                        onChange={(e) => setEditInspector({...editInspector, available: e.target.checked})}
                      />
                      <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
                        Currently Available
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#224057]"
                      onClick={() => setEditInspector(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#224057] hover:bg-[#1a344d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#224057]"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-medium text-[#224057] mb-4">Confirm Delete</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this inspector? This action cannot be undone.</p>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#224057]"
                    onClick={() => setDeleteConfirm(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={() => handleDelete(deleteConfirm)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}