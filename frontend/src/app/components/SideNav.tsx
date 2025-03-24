import Link from 'next/link';
import {
  FaFileAlt, // Application Form
  FaFileUpload, // Document Approval
  FaTasks, // Stage Forms
  FaClipboardCheck, // Inspections
  FaCreditCard, // Payments
  FaUsers, // Contractors
  FaCalendarAlt, // Schedule
  FaCheckCircle, // Approvals
  FaBuilding, // Permits
  FaFileContract, // Applications
  FaUserTie, // Inspectors
  FaCog, // Settings
  FaUser, // Profile
  FaSignOutAlt, // Logout
} from 'react-icons/fa';

interface SideNavProps {
  role: 'admin' | 'applicant' | 'inspector';
  className?: string; // Add className prop
}

export default function SideNav({ role, className }: SideNavProps) {
  // Admin Links
  const adminLinks = [
    { name: 'Permits', href: '/dashboard/admin/permits', icon: <FaBuilding className="w-5 h-5" /> },
    { name: 'Applications', href: '/dashboard/admin/applications', icon: <FaFileContract className="w-5 h-5" /> },
    { name: 'Inspections', href: '/dashboard/admin/inspections', icon: <FaClipboardCheck className="w-5 h-5" /> },
    { name: 'Inspectors', href: '/dashboard/admin/inspectors', icon: <FaUserTie className="w-5 h-5" /> },
    { name: 'Contractors', href: '/dashboard/admin/contractors', icon: <FaUsers className="w-5 h-5" /> },
    { name: 'Approvals', href: '/dashboard/admin/approvals', icon: <FaCheckCircle className="w-5 h-5" /> },
    { name: 'Payments', href: '/dashboard/admin/payments', icon: <FaCreditCard className="w-5 h-5" /> },
  ];

  // Applicant Links
  const applicantLinks = [
    { name: 'Application', href: '/applicant/application', icon: <FaFileAlt className="w-5 h-5" /> },
    { name: 'Document Approval', href: '/applicant/document-approval', icon: <FaFileUpload className="w-5 h-5" /> },
    { name: 'Stage Forms', href: '/applicant/stage-forms', icon: <FaTasks className="w-5 h-5" /> },
    { name: 'Inspections', href: '/applicant/inspections', icon: <FaClipboardCheck className="w-5 h-5" /> },
    { name: 'Payments', href: '/applicant/payments', icon: <FaCreditCard className="w-5 h-5" /> },
  ];

  // Inspector Links
  const inspectorLinks = [
    { name: 'Contractors', href: '/dashboard/inspector/contractors', icon: <FaUsers className="w-5 h-5" /> },
    { name: 'Inspections', href: '/dashboard/inspector/inspections', icon: <FaClipboardCheck className="w-5 h-5" /> },
    { name: 'Schedule', href: '/dashboard/inspector/schedule', icon: <FaCalendarAlt className="w-5 h-5" /> },
    { name: 'Approvals', href: '/dashboard/inspector/approvals', icon: <FaCheckCircle className="w-5 h-5" /> },
  ];

  // Common Links (Shared across all roles)
  const commonLinks = [
    { name: 'Settings', href: '/settings', icon: <FaCog className="w-5 h-5" /> },
    { name: 'Profile', href: '/profile', icon: <FaUser className="w-5 h-5" /> },
    { name: 'Logout', href: '/logout', icon: <FaSignOutAlt className="w-5 h-5" /> },
  ];

  // Determine which links to display based on the role
  const links = role === 'admin' ? adminLinks : role === 'applicant' ? applicantLinks : inspectorLinks;

  return (
    <aside className={`w-64 bg-white text-[#224057] border-r border-gray-200 p-6 flex flex-col h-screen ${className}`}>
      {/* Role-specific Links */}
      <nav className="flex-1">
        <ul className="space-y-4">
          {links.map((link) => (
            <li key={link.name}>
              <Link href={link.href} className="flex items-center space-x-4 hover:text-gray-500">
                {link.icon}
                <span>{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Common Links (Pushed to the bottom) */}
      <nav>
        <ul className="space-y-4">
          {commonLinks.map((link) => (
            <li key={link.name}>
              <Link href={link.href} className="flex items-center space-x-4 hover:text-gray-500">
                {link.icon}
                <span>{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}