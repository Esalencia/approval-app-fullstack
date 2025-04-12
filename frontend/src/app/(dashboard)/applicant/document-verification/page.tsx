// app/documentVerification/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/Dashboardlayout';

interface ComplianceResult {
  compliant: boolean;
  issues: string[];
  textExtracted: string;
}

export default function DocumentVerification() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [complianceResult, setComplianceResult] = useState<ComplianceResult | null>(null);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setComplianceResult(null); // Clear previous results
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setProgress(0);
    const formData = new FormData();
    formData.append('document', file);

    try {
      // Upload and check compliance
      setProgress(30);
      const uploadResponse = await fetch('http://localhost:5001/api/uploads', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(await uploadResponse.text());
      }

      setProgress(60);
      const { document } = await uploadResponse.json();

      // Get compliance results
      const complianceResponse = await fetch(`http://localhost:5001/api/documents/${document.id}/compliance`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!complianceResponse.ok) {
        throw new Error('Failed to check compliance');
      }

      setProgress(90);
      const result = await complianceResponse.json();
      setComplianceResult(result);
      toast.success('Document verified successfully!');
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error instanceof Error ? error.message : 'Verification failed');
    } finally {
      setProgress(100);
      setIsLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <DashboardLayout userRole="applicant">
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Architectural Plan Verification</h1>
          <p className="text-gray-600">
            Upload your architectural documents to check compliance with building standards
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Architectural Document
              </label>
              <div className="mt-1 flex items-center">
                <input
                  id="document-upload"
                  name="document"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  required
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                PDF, JPG, or PNG (Max. 10MB)
              </p>
            </div>

            {isLoading && (
              <div className="pt-1">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Processing...</span>
                  <span>{progress}%</span>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                  <div
                    style={{ width: `${progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
                  ></div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={!file || isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  (!file || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Verifying...' : 'Verify Compliance'}
              </button>
            </div>
          </form>
        </div>

        {complianceResult && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className={`p-4 ${complianceResult.compliant ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                {complianceResult.compliant ? (
                  <span className="text-green-600">✓ Compliant with Standards</span>
                ) : (
                  <span className="text-yellow-600">⚠ Requires Attention</span>
                )}
              </h2>
              
              {complianceResult.issues.length > 0 ? (
                <div className="mt-4 space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">Identified Issues:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {complianceResult.issues.map((issue, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-600">No compliance issues found.</p>
              )}
            </div>

            <div className="p-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Extracted Text Preview</h3>
              <div className="bg-gray-50 p-3 rounded-md max-h-40 overflow-y-auto">
                <p className="text-xs text-gray-600 whitespace-pre-wrap">
                  {complianceResult.textExtracted || 'No text extracted'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Need help? Contact our support team for assistance with document verification.</p>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}