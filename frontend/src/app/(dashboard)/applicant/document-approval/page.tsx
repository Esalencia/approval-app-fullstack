import Header from '@/app/components/Header'; // Import the Header component

export default function DocumentApproval() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#224057] mb-6">Document Approval</h1>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-[#224057] mb-4">Upload Documents</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Document Type</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#224057] focus:ring-[#224057]">
                <option>Building Plans</option>
                <option>Structural Engineer's Report</option>
                <option>Fire Safety Certificate</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload File</label>
              <input
                type="file"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#224057] focus:ring-[#224057]"
              />
            </div>
            <button className="bg-[#224057] text-white px-4 py-2 rounded-lg hover:bg-[#3A6B8A]">
              Upload
            </button>
          </div>
        </div>

        {/* Document Status Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-[#224057] mb-4">Document Status</h2>
          <div className="space-y-4">
            {/* Document Status Card */}
            <div className="border-l-4 border-[#224057] pl-4">
              <h3 className="text-lg font-semibold text-gray-700">Building Plans</h3>
              <p className="text-gray-600">Status: <span className="text-green-600">Approved</span></p>
              <p className="text-gray-500">Uploaded on: 2024-03-15</p>
            </div>

            {/* Document Status Card */}
            <div className="border-l-4 border-[#224057] pl-4">
              <h3 className="text-lg font-semibold text-gray-700">Structural Engineer's Report</h3>
              <p className="text-gray-600">Status: <span className="text-yellow-600">Pending Review</span></p>
              <p className="text-gray-500">Uploaded on: 2024-03-18</p>
            </div>

            {/* Document Status Card */}
            <div className="border-l-4 border-[#224057] pl-4">
              <h3 className="text-lg font-semibold text-gray-700">Fire Safety Certificate</h3>
              <p className="text-gray-600">Status: <span className="text-red-600">Rejected</span></p>
              <p className="text-gray-500">Uploaded on: 2024-03-20</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}