
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LogIn, 
  LayoutDashboard, 
  FileText, 
  Users, 
  Package, 
  PackageX, 
  CalendarX,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: FileText,
  },
  {
    title: "Bill History",
    href: "/bill-history",
    icon: FileText,
  },
  {
    title: "Staff",
    href: "/staff",
    icon: Users,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    title: "Out of Stock",
    href: "/out-of-stock",
    icon: PackageX,
  },
  {
    title: "Near Expiry",
    href: "/near-expiry",
    icon: CalendarX,
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    // Clear the login state
    localStorage.removeItem("isLoggedIn");
    
    // Show success toast
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      duration: 3000,
    });
    
    // Navigate to login page
    navigate("/");
  };

  return (
    <div className={`bg-white border-r border-gray-200 h-screen transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-xl font-bold text-pharmacy-600">MediTrack</h2>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto" 
            onClick={toggleSidebar}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.href}>
                  <Link 
                    to={item.href} 
                    className={`flex items-center p-2 rounded-md transition-colors ${
                      isActive 
                        ? "bg-pharmacy-100 text-pharmacy-600" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {!collapsed && <span className="ml-3">{item.title}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t">
          <Button 
            variant="ghost"
            className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md w-full justify-start"
            onClick={handleLogout}
          >
            <LogIn className="h-5 w-5" />
            {!collapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
