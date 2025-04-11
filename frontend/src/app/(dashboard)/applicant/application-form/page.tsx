'use client';

import { useState } from 'react';
import axios from 'axios';
import DashboardLayout from '@/components/Dashboardlayout';

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
      const response = await axios.post('http://localhost:5001/api/applications', formData);

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
    <DashboardLayout userRole="applicant">
    <div className="min-h-screen bg-blueGray-50">

        {/* Form Container */}
        <div className="w-full p-6">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
            <div className="rounded-t bg-white mb-0 px-6 py-6">
              <div className="text-center flex justify-between">
                <h6 className="text-[#224057] text-xl font-bold">
                  Plan Approval Form
                </h6>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#224057] text-white active:bg-[#224057] font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  onClick={handleSubmit}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-wrap">
                  {/* Stand Number */}
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-[#224057] text-xs font-bold mb-2">
                        Stand Number
                      </label>
                      <input
                        type="text"
                        name="standNumber"
                        value={formData.standNumber}
                        onChange={handleChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-[#224057] bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        required
                      />
                    </div>
                  </div>

                  {/* Postal Address */}
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-[#224057] text-xs font-bold mb-2">
                        Postal Address
                      </label>
                      <input
                        type="text"
                        name="postalAddress"
                        value={formData.postalAddress}
                        onChange={handleChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-[#224057] bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        required
                      />
                    </div>
                  </div>

                  {/* Estimated Cost */}
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-[#224057] text-xs font-bold mb-2">
                        Estimated Cost
                      </label>
                      <input
                        type="text"
                        name="estimatedCost"
                        value={formData.estimatedCost}
                        onChange={handleChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-[#224057] bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        required
                      />
                    </div>
                  </div>

                  {/* Construction Type */}
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-[#224057] text-xs font-bold mb-2">
                        Construction Type
                      </label>
                      <select
                        name="constructionType"
                        value={formData.constructionType}
                        onChange={handleChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-[#224057] bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        required
                      >
                        <option value="">Select Construction Type</option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Project Description */}
                  <div className="w-full px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-[#224057] text-xs font-bold mb-2">
                        Project Description
                      </label>
                      <textarea
                        name="projectDescription"
                        value={formData.projectDescription}
                        onChange={handleChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-[#224057] bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        rows={4}
                        required
                      />
                    </div>
                  </div>

                  {/* Start Date */}
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-[#224057] text-xs font-bold mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-[#224057] bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        required
                      />
                    </div>
                  </div>

                  {/* Completion Date */}
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-[#224057] text-xs font-bold mb-2">
                        Completion Date
                      </label>
                      <input
                        type="date"
                        name="completionDate"
                        value={formData.completionDate}
                        onChange={handleChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-[#224057] bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        required
                      />
                    </div>
                  </div>

                  {/* Building Contractor */}
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-[#224057] text-xs font-bold mb-2">
                        Building Contractor
                      </label>
                      <input
                        type="text"
                        name="buildingContractor"
                        value={formData.buildingContractor}
                        onChange={handleChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-[#224057] bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        required
                      />
                    </div>
                  </div>

                  {/* Architect */}
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-[#224057] text-xs font-bold mb-2">
                        Architect
                      </label>
                      <input
                        type="text"
                        name="architect"
                        value={formData.architect}
                        onChange={handleChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-[#224057] bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        required
                      />
                    </div>
                  </div>

                  {/* Owner Name */}
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-[#224057] text-xs font-bold mb-2">
                        Owner Name
                      </label>
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-[#224057] bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-[#224057] text-xs font-bold mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-[#224057] bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-[#224057] text-xs font-bold mb-2">
                        Contact
                      </label>
                      <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-[#224057] bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        required
                      />
                    </div>
                  </div>

                  {/* Purpose of Building */}
                  <div className="w-full px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-[#224057] text-xs font-bold mb-2">
                        Purpose of Building
                      </label>
                      <textarea
                        name="purposeOfBuilding"
                        value={formData.purposeOfBuilding}
                        onChange={handleChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-[#224057] bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        rows={4}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Success Message */}
                {success && (
                  <div className="mt-6 text-center">
                    <p className="text-green-600 font-semibold">Form submitted successfully!</p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mt-6 text-center">
                    <p className="text-red-600 font-semibold">{error}</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
      </DashboardLayout>
  );
};

export default PlanApprovalForm;