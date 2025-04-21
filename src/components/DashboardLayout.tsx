
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  // Check if user is logged in based on localStorage
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // If not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}
