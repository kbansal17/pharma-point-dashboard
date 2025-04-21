
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Package, PackageX, CalendarX, Users } from "lucide-react";

export default function Dashboard() {
  // Dashboard summary stats (would come from API in real app)
  const stats = [
    {
      title: "Total Products",
      value: "1,248",
      change: "+12% from last month",
      icon: Package,
      color: "text-pharmacy-600",
    },
    {
      title: "Out of Stock",
      value: "14",
      change: "-2 from last week",
      icon: PackageX,
      color: "text-orange-500",
    },
    {
      title: "Near Expiry",
      value: "28",
      change: "Expiring in 30 days",
      icon: CalendarX,
      color: "text-yellow-500",
    },
    {
      title: "Total Staff",
      value: "12",
      change: "2 on leave",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Today's Sales",
      value: "$2,450",
      change: "+18% from yesterday",
      icon: FileText,
      color: "text-green-500",
    },
  ];

  // Recent transactions (would come from API in real app)
  const recentTransactions = [
    { id: "INV-001", customer: "John Doe", amount: "$124.00", status: "Completed", date: "Today, 2:30 PM" },
    { id: "INV-002", customer: "Jane Smith", amount: "$82.50", status: "Completed", date: "Today, 12:10 PM" },
    { id: "INV-003", customer: "Mike Johnson", amount: "$215.75", status: "Completed", date: "Yesterday, 5:20 PM" },
    { id: "INV-004", customer: "Sara Williams", amount: "$45.00", status: "Completed", date: "Yesterday, 11:30 AM" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to your pharmacy dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Latest 4 transactions processed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{transaction.customer}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500 mr-2">{transaction.id}</span>
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{transaction.amount}</p>
                      <p className="text-xs text-gray-500 mt-1">{transaction.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Inventory Summary</CardTitle>
              <CardDescription>
                Status of your current inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Categories</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Low Stock Items</span>
                  <span className="font-medium text-yellow-600">32</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Out of Stock</span>
                  <span className="font-medium text-red-600">14</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Expiring in 30 days</span>
                  <span className="font-medium text-orange-600">28</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Expiring in 60 days</span>
                  <span className="font-medium text-blue-600">54</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
