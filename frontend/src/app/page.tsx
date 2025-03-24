import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-[#A4D7E1] to-[#F4E3C4]">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-[#224057] mb-4 animate-bounce">Welcome to the Building Plan Approval App</h1>
        <p className="text-lg text-gray-600 mb-6">
          Streamlining the construction process in Zimbabwe. Apply for approvals, schedule inspections, and manage your documents with ease.
        </p>
        <div className="flex justify-center space-x-4">
          <a href="/applicant" className="bg-[#224057] text-white px-6 py-3 rounded-lg shadow-lg transform transition hover:scale-105">
            Login
          </a>
          <a href="/register" className="bg-[#C6B93A] text-white px-6 py-3 rounded-lg shadow-lg transform transition hover:scale-105">
            Register
          </a>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 mb-8">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Building Plan Approval App. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Home;