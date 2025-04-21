
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CalendarX, 
  Search, 
  FileDown,
  RefreshCcw,
  AlertTriangle,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  stock: number;
  price: number;
  expiryDate: string;
  batchNumber: string;
};

export default function NearExpiryPage() {
  const [nearExpiryItems, setNearExpiryItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Calculate the current date and 30/60 days from now for expiry checks
  const currentDate = new Date();
  const thirtyDaysFromNow = new Date();
  const sixtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(currentDate.getDate() + 30);
  sixtyDaysFromNow.setDate(currentDate.getDate() + 60);
  
  // Sample near expiry items
  const generateNearExpiryDate = (daysFromNow: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
  };
  
  const sampleNearExpiryItems: InventoryItem[] = [
    {
      id: "MED101",
      name: "Diclofenac Sodium 50mg",
      category: "Pain Relief",
      manufacturer: "Zydus",
      stock: 15,
      price: 75.25,
      expiryDate: generateNearExpiryDate(15), // 15 days from now
      batchNumber: "DS5015"
    },
    {
      id: "MED102",
      name: "Pantoprazole 40mg",
      category: "Gastrointestinal",
      manufacturer: "Intas",
      stock: 8,
      price: 110.50,
      expiryDate: generateNearExpiryDate(25), // 25 days from now
      batchNumber: "PP4025"
    },
    {
      id: "MED103",
      name: "Cefixime 200mg",
      category: "Antibiotics",
      manufacturer: "Mankind",
      stock: 12,
      price: 135.75,
      expiryDate: generateNearExpiryDate(30), // 30 days from now
      batchNumber: "CF2030"
    },
    {
      id: "MED104",
      name: "Amlodipine 5mg",
      category: "Cardiac",
      manufacturer: "Torrent",
      stock: 20,
      price: 55.00,
      expiryDate: generateNearExpiryDate(45), // 45 days from now
      batchNumber: "AM0545"
    },
    {
      id: "MED105",
      name: "Rabeprazole 20mg",
      category: "Gastrointestinal",
      manufacturer: "Glenmark",
      stock: 10,
      price: 95.40,
      expiryDate: generateNearExpiryDate(55), // 55 days from now
      batchNumber: "RP2055"
    }
  ];
  
  useEffect(() => {
    // Load inventory data from localStorage
    const loadData = () => {
      setIsLoading(true);
      const inventoryData = localStorage.getItem("inventoryData");
      
      if (inventoryData) {
        const parsedData: InventoryItem[] = JSON.parse(inventoryData);
        
        // Filter for near expiry items only (within 60 days)
        const nearExpiry = parsedData.filter(item => {
          const expiry = new Date(item.expiryDate);
          return expiry > currentDate && expiry < sixtyDaysFromNow;
        });
        
        // If there are no near expiry items, add our sample data
        if (nearExpiry.length === 0) {
          // Save sample data to localStorage
          const updatedInventory = [...parsedData, ...sampleNearExpiryItems];
          localStorage.setItem("inventoryData", JSON.stringify(updatedInventory));
          setNearExpiryItems(sampleNearExpiryItems);
        } else {
          setNearExpiryItems(nearExpiry);
        }
      } else {
        // If no data in localStorage, use sample near expiry items
        localStorage.setItem("inventoryData", JSON.stringify(sampleNearExpiryItems));
        setNearExpiryItems(sampleNearExpiryItems);
      }
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);
  
  // Refresh data
  const handleRefresh = () => {
    const inventoryData = localStorage.getItem("inventoryData");
    
    if (inventoryData) {
      const parsedData: InventoryItem[] = JSON.parse(inventoryData);
      const nearExpiry = parsedData.filter(item => {
        const expiry = new Date(item.expiryDate);
        return expiry > currentDate && expiry < sixtyDaysFromNow;
      });
      setNearExpiryItems(nearExpiry);
    }
  };
  
  // Filter the near expiry items based on search term
  const filteredItems = nearExpiryItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort by expiry date (closest first)
  const sortedItems = [...filteredItems].sort((a, b) => 
    new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
  );
  
  // Format the date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    
    // Reset time part for accurate day calculation
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  // Get expiry badge
  const getExpiryBadge = (expiryDate: string) => {
    const daysUntil = getDaysUntilExpiry(expiryDate);
    
    if (daysUntil <= 0) {
      return <Badge variant="destructive" className="bg-red-500">Expired</Badge>;
    } else if (daysUntil <= 30) {
      return <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
        <Clock className="h-3 w-3 mr-1" /> {daysUntil} days
      </Badge>;
    } else {
      return <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
        <Clock className="h-3 w-3 mr-1" /> {daysUntil} days
      </Badge>;
    }
  };

  // Count items expiring within 30 days
  const expiringVery30Days = nearExpiryItems.filter(item => {
    const expiry = new Date(item.expiryDate);
    return expiry < thirtyDaysFromNow;
  }).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Near Expiry Products</h1>
            <p className="text-gray-500 mt-1">Manage products that will expire soon</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button variant="outline">
              <FileDown className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CalendarX className="h-5 w-5 text-red-500 mr-2" />
                Expiring within 30 days
              </CardTitle>
              <div className="text-2xl font-bold text-red-600">{expiringVery30Days}</div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Urgent Attention Required</p>
                  <p>These products will expire very soon and should be prioritized for sales or returns.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CalendarX className="h-5 w-5 text-orange-500 mr-2" />
                Expiring within 60 days
              </CardTitle>
              <div className="text-2xl font-bold text-orange-600">{nearExpiryItems.length}</div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-md flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Monitor Closely</p>
                  <p>These products will expire within the next 60 days and should be monitored.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center">
            <CardTitle>Near Expiry Products</CardTitle>
            <div className="ml-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search expiring products..."
                  className="w-[250px] pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-6">
                <div className="animate-spin h-8 w-8 border-4 border-pharmacy-600 border-opacity-20 border-t-pharmacy-600 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Loading near expiry products...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Days Left</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedItems.length > 0 ? (
                      sortedItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.manufacturer}</TableCell>
                          <TableCell>{item.stock}</TableCell>
                          <TableCell>{formatDate(item.expiryDate)}</TableCell>
                          <TableCell>{getExpiryBadge(item.expiryDate)}</TableCell>
                          <TableCell>
                            <Button variant="default" size="sm" className="bg-pharmacy-600 hover:bg-pharmacy-700">
                              Mark for Disposal
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                          {searchTerm 
                            ? "No matching near expiry products found. Try adjusting your search."
                            : "No products are expiring within the next 60 days."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
