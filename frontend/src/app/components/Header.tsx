import Link from 'next/link';
import { FaUser, FaBell, FaEnvelope, FaArrowLeft } from 'react-icons/fa';

export default function Header() {
  return (
    <header className="bg-white text-[#224057] border-1 border-blue-500 p-4 flex justify-between items-center">
      {/* Back to Dashboard Button */}
      <Link href="/applicant" className="flex items-center space-x-2 hover:text-gray-300">
        <FaArrowLeft className="w-5 h-5" />
        <span>Back to Dashboard</span>
      </Link>

      {/* App Title */}
      <h1 className="text-xl font-bold">ZimBuilds</h1>

      {/* Icons (Profile, Notifications, Messages) */}
      <div className="flex space-x-4">
        <FaUser className="w-6 h-6 cursor-pointer" />
        <FaBell className="w-6 h-6 cursor-pointer" />
        <FaEnvelope className="w-6 h-6 cursor-pointer" />
      </div>
    </header>
  );
}
 