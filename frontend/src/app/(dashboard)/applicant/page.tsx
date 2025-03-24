import Header from '../../components/Header';
import SideNav from '../../components/SideNav';

export default function ApplicantDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main Layout */}
      <div className="flex">
        {/* Side Navigation */}
        <SideNav role="applicant" />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-[#224057] mb-6">Applicant Dashboard</h1>

          {/* Add applicant-specific content here */}
          <div className="bg-white border-1 border-blue-500 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-[#224057] mb-4">Your Applications</h2>
            <p className="text-gray-600">No applications submitted yet.</p>
          </div>
          <div className="bg-white border-1 border-blue-500 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-[#224057] mb-4">Your Applications</h2>
            <p className="text-gray-600">No applications submitted yet.</p>
          </div>
          <div className="bg-white border-1 border-blue-500 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-[#224057] mb-4">Your Applications</h2>
            <p className="text-gray-600">No applications submitted yet.</p>
          </div>
          <div className="bg-white border-1 border-blue-500 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-[#224057] mb-4">Your Applications</h2>
            <p className="text-gray-600">No applications submitted yet.</p>
          </div>
        </main>
      </div>
    </div>
  );
}