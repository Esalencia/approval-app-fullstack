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
          href: "/",
        },
        {
          icon: "/teacher.png",
          label: "Add Inspector",
          href: "/admin/add-inspector",
        },
        {
          icon: "/teacher.png",
          label: "Inspectors",
          href: "/admin/inspectors",
        },
        {
          icon: "/applicants.png",
          label: "Applicants",
          href: "/admin/applicants",
        },
        {
          icon: "/application.png",
          label: "Applications",
          href: "/admin/applications",
        },
        {
          icon: "/exam.png",
          label: "Payments",
          href: "/admin/payments",
        },
        {
          icon: "/message.png",
          label: "Reports",
          href: "/admin/reports",
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
        },
        {
          icon: "/class.png",
          label: "Application Form",
          href: "/applicant/application-form",
          visible: ["applicant"],
        },
        {
          icon: "/lesson.png",
          label: "Document Verification",
          href: "/applicant/document-verification",
        },
        {
          icon: "/exam.png",
          label: "Payments",
          href: "/applicant/payments",
        },
        {
          icon: "/assignment.png",
          label: "Inspections",
          href: "/applicant/inspections",
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
        },
        {
          icon: "/attendance.png",
          label: "Certificate Of Occupation",
          href: "/applicant/certificate",
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
          href: "/",
        },
        {
          icon: "/applicants.png",
          label: "Applicants",
          href: "/inspector/applicants",
        },
        {
          icon: "/assignment.png",
          label: "Inspections",
          href: "/list/assignments",
        },
        {
          icon: "/calendar.png",
          label: "Schedules",
          href: "/list/events",
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
  const { logout } = useAuth();
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
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {section.title}
          </span>
          {section.items.map((item) => {
            if (item.visible && !item.visible.includes(role)) {
              return null;
            }
            return (
              <Link
                href={item.href}
                key={item.label}
                onClick={(e) => handleItemClick(item, e)}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
              >
                <Image src={item.icon} alt="" width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default SideMenu;