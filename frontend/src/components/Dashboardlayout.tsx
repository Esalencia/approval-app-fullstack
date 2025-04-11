// layout.tsx
'use client';

import { ReactNode } from "react";
import Navbar from "@/components/NavBar";
import SideMenu from "@/components/SideMenu";
import Image from "next/image";
import Link from "next/link";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: "admin" | "applicant" | "inspector" | "superadmin";
  showSidebar?: boolean; // New prop to control sidebar visibility
  showNavbar?: boolean; // New prop to control navbar visibility
}

export default function DashboardLayout({
  children,
  userRole,
  showSidebar = true, // Default to true if not specified
  showNavbar = true, // Default to true if not specified
}: DashboardLayoutProps) {
  return (
    <div className="h-screen flex">
      {/* LEFT - Side Menu */}
      {showSidebar && (
        <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
          <Link href="/" className="flex items-center justify-center lg:justify-start gap-2">
            <Image src="/logo.png" alt="logo" width={32} height={32} />
            <span className="hidden lg:block font-bold">ZimBuilds</span>
          </Link>
          <SideMenu role={userRole === "superadmin" ? "admin" : userRole} />
        </div>
      )}
      {/* RIGHT - Main Content */}
      <div className={`flex-1 bg-[#F7F8FA] overflow-scroll flex flex-col ${showSidebar ? 'w-[86%]' : 'w-full'}`}>
        {showNavbar && <Navbar />}
        {children}
      </div>
    </div>
  );
}

