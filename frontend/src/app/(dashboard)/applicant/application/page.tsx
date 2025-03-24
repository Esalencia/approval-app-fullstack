'use client'; // Ensure this component runs on the client side

import { useState } from 'react';
import axios from 'axios';
import Header from '@/app/components/Header';
import SideNav from '@/app/components/SideNav';

const PlanApprovalForm = () => {
  const [formData, setFormData] = useState({
    standNumber: '',
    postalAddress: '',
    estimatedCost: '',
    constructionType: '',
    projectDescription: '',
    startDate: '',
    completionDate: '',
    buildingContractor: '',
    architect: '',
    ownerName: '',
    email: '',
    contact: '',
    purposeOfBuilding: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Replace with your backend API URL
      const response = await axios.post('http://localhost:5001/api/application', formData);

      console.log('Form submitted successfully:', response.data);
      setSuccess(true);
      // Optionally reset the form after successful submission
      setFormData({
        standNumber: '',
        postalAddress: '',
        estimatedCost: '',
        constructionType: '',
        projectDescription: '',
        startDate: '',
        completionDate: '',
        buildingContractor: '',
        architect: '',
        ownerName: '',
        email: '',
        contact: '',
        purposeOfBuilding: '',
      });
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('An error occurred while submitting the form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main Layout */}
      <div className="flex">
        {/* Side Navigation */}
        <SideNav role="applicant" />

        {/* Form Container */}
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 w-full ">
          <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Plan Approval Form</h1>

            {/* Grid Layout for Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stand Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Stand Number</label>
                <input
                  type="text"
                  name="standNumber"
                  value={formData.standNumber}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Postal Address */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Postal Address</label>
                <input
                  type="text"
                  name="postalAddress"
                  value={formData.postalAddress}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Estimated Cost */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Estimated Cost</label>
                <input
                  type="text"
                  name="estimatedCost"
                  value={formData.estimatedCost}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Construction Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Construction Type</label>
                <select
                  name="constructionType"
                  value={formData.constructionType}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Construction Type</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Project Description */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Project Description</label>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  required
                />
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Completion Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Completion Date</label>
                <input
                  type="date"
                  name="completionDate"
                  value={formData.completionDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Building Contractor */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Building Contractor</label>
                <input
                  type="text"
                  name="buildingContractor"
                  value={formData.buildingContractor}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Architect */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Architect</label>
                <input
                  type="text"
                  name="architect"
                  value={formData.architect}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Owner Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Owner Name</label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Purpose of Building */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Purpose of Building</label>
                <textarea
                  name="purposeOfBuilding"
                  value={formData.purposeOfBuilding}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#224057] text-white p-4 rounded-lg font-semibold hover:bg-[#224057]-700 transition duration-300 disabled:bg-blue-400"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>

            {/* Success Message */}
            {success && (
              <p className="mt-6 text-green-600 text-center font-semibold">Form submitted successfully!</p>
            )}

            {/* Error Message */}
            {error && (
              <p className="mt-6 text-red-600 text-center font-semibold">{error}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlanApprovalForm;