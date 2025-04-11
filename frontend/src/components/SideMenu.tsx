// components/SideMenu.tsx
'use client'
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface MenuItem {
  icon: string;
  label: string;
  href: string;
  visible?: ("admin" | "applicant" | "inspector")[];
  requiredPermission?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuData: Record<string, MenuSection[]> = {
  admin: [
    {
      title: "MENU",
      items: [
        {
          icon: "/home.png",
          label: "Home",
          href: "/admin",
          requiredPermission: "access_admin_dashboard",
        },
        {
          icon: "/teacher.png",
          label: "Add Inspector",
          href: "/admin/add-inspector",
          requiredPermission: "add_inspector",
        },
        {
          icon: "/teacher.png",
          label: "Inspectors",
          href: "/admin/inspectors",
          requiredPermission: "view_inspectors",
        },
        {
          icon: "/applicants.png",
          label: "Applicants",
          href: "/admin/applicants",
          requiredPermission: "view_applicants",
        },
        {
          icon: "/application.png",
          label: "Applications",
          href: "/admin/applications",
          requiredPermission: "view_applications",
        },
        {
          icon: "/exam.png",
          label: "Payments",
          href: "/admin/payments",
          requiredPermission: "manage_payments",
        },
        {
          icon: "/message.png",
          label: "Reports",
          href: "/admin/reports",
          requiredPermission: "view_reports",
        },
      ],
    },
    {
      title: "OTHER",
      items: [
        {
          icon: "/profile.png",
          label: "Profile",
          href: "/profile",
        },
        {
          icon: "/setting.png",
          label: "Settings",
          href: "/settings",
        },
        {
          icon: "/logout.png",
          label: "Logout",
          href: "/logout",
        },
      ],
    },
  ],
  applicant: [
    {
      title: "MENU",
      items: [
        {
          icon: "/home.png",
          label: "Home",
          href: "/applicant",
          requiredPermission: "access_applicant_dashboard",
        },
        {
          icon: "/class.png",
          label: "Application Form",
          href: "/applicant/application-form",
          requiredPermission: "submit_application",
        },
        {
          icon: "/lesson.png",
          label: "Document Verification",
          href: "/applicant/document-verification",
          requiredPermission: "upload_documents",
        },
        {
          icon: "/exam.png",
          label: "Payments",
          href: "/applicant/payments",
          requiredPermission: "make_payments",
        },
        {
          icon: "/assignment.png",
          label: "Inspections",
          href: "/applicant/inspections",
          requiredPermission: "view_own",
        },
        {
          icon: "/result.png",
          label: "Stages",
          href: "/applicant/stages",
        },
        {
          icon: "/calendar.png",
          label: "Schedule Inspection",
          href: "/applicant/inspection-scheduling",
          requiredPermission: "schedule_inspection",
        },
        {
          icon: "/attendance.png",
          label: "Certificate Of Occupation",
          href: "/applicant/certificate",
          requiredPermission: "view_certificate",
        },

      ],
    },
    {
      title: "OTHER",
      items: [
        {
          icon: "/profile.png",
          label: "Profile",
          href: "/profile",
        },
        {
          icon: "/setting.png",
          label: "Settings",
          href: "/settings",
        },
        {
          icon: "/logout.png",
          label: "Logout",
          href: "/logout",
        },
      ],
    },
  ],
  inspector: [
    {
      title: "MENU",
      items: [
        {
          icon: "/home.png",
          label: "Home",
          href: "/inspector",
          requiredPermission: "access_inspector_dashboard",
        },
        {
          icon: "/applicants.png",
          label: "Applicants",
          href: "/inspector/applicants",
          requiredPermission: "view_assigned",
        },
        {
          icon: "/assignment.png",
          label: "Inspections",
          href: "/list/assignments",
          requiredPermission: "manage_inspections",
        },
        {
          icon: "/calendar.png",
          label: "Schedules",
          href: "/list/events",
          requiredPermission: "schedule_inspections",
        },
      ],
    },
    {
      title: "OTHER",
      items: [
        {
          icon: "/profile.png",
          label: "Profile",
          href: "/profile",
        },
        {
          icon: "/setting.png",
          label: "Settings",
          href: "/settings",
        },
        {
          icon: "/logout.png",
          label: "Logout",
          href: "/logout",
        },
      ],
    },
  ],
};

interface SideMenuProps {
  role: "admin" | "applicant" | "inspector";
}

const SideMenu = ({ role }: SideMenuProps) => {
  const menuItems = menuData[role] || [];
  const { logout, hasPermission } = useAuth();
  const router = useRouter();

  const handleItemClick = (item: MenuItem, e: React.MouseEvent) => {
    // Handle logout specially
    if (item.label === 'Logout') {
      e.preventDefault();
      logout();
    }
  };

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => {
        // Filter items based on permissions
        const visibleItems = section.items.filter(item => {
          // Check if item should be visible based on role
          if (item.visible && !item.visible.includes(role)) {
            return false;
          }

          // Check if user has required permission
          if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
            return false;
          }

          return true;
        });

        // If no items are visible in this section, don't render the section
        if (visibleItems.length === 0) {
          return null;
        }

        return (
          <div className="flex flex-col gap-2" key={section.title}>
            <span className="hidden lg:block text-gray-400 font-light my-4">
              {section.title}
            </span>
            {visibleItems.map((item) => (
              <Link
                href={item.href}
                key={item.label}
                onClick={(e) => handleItemClick(item, e)}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
              >
                <Image src={item.icon} alt="" width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default SideMenu;