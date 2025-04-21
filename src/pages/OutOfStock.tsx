
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
  PackageX, 
  Search, 
  FileDown,
  RefreshCcw,
  AlertTriangle
} from "lucide-react";

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

export default function OutOfStockPage() {
  const [outOfStockItems, setOutOfStockItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Sample out of stock items
  const sampleOutOfStockItems: InventoryItem[] = [
    {
      id: "MED001",
      name: "Azithromycin 500mg",
      category: "Antibiotics",
      manufacturer: "Sun Pharma",
      stock: 0,
      price: 145.50,
      expiryDate: "2025-12-15",
      batchNumber: "AZ2501"
    },
    {
      id: "MED002",
      name: "Metformin 850mg",
      category: "Diabetes",
      manufacturer: "Cipla",
      stock: 0,
      price: 78.25,
      expiryDate: "2026-03-20",
      batchNumber: "MT8502"
    },
    {
      id: "MED003",
      name: "Montelukast 10mg",
      category: "Respiratory",
      manufacturer: "Dr. Reddy's",
      stock: 0,
      price: 120.00,
      expiryDate: "2025-08-10",
      batchNumber: "ML1003"
    },
    {
      id: "MED004",
      name: "Atorvastatin 20mg",
      category: "Cardiac",
      manufacturer: "Lupin",
      stock: 0,
      price: 95.75,
      expiryDate: "2025-10-05",
      batchNumber: "AS2004"
    },
    {
      id: "MED005",
      name: "Levothyroxine 50mcg",
      category: "Hormones",
      manufacturer: "Alkem",
      stock: 0,
      price: 65.30,
      expiryDate: "2026-01-25",
      batchNumber: "LT5005"
    }
  ];
  
  useEffect(() => {
    // Load inventory data from localStorage
    const loadData = () => {
      setIsLoading(true);
      const inventoryData = localStorage.getItem("inventoryData");
      
      if (inventoryData) {
        const parsedData: InventoryItem[] = JSON.parse(inventoryData);
        // Filter for out of stock items only
        const outOfStock = parsedData.filter(item => item.stock === 0);
        
        // If there are no out of stock items, use our sample data
        if (outOfStock.length === 0) {
          // Save sample data to localStorage
          const updatedInventory = [...parsedData, ...sampleOutOfStockItems];
          localStorage.setItem("inventoryData", JSON.stringify(updatedInventory));
          setOutOfStockItems(sampleOutOfStockItems);
        } else {
          setOutOfStockItems(outOfStock);
        }
      } else {
        // If no data in localStorage, use sample out of stock items
        localStorage.setItem("inventoryData", JSON.stringify(sampleOutOfStockItems));
        setOutOfStockItems(sampleOutOfStockItems);
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
      const outOfStock = parsedData.filter(item => item.stock === 0);
      setOutOfStockItems(outOfStock);
    }
  };
  
  // Filter the out of stock items based on search term
  const filteredItems = outOfStockItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Format the date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Out of Stock Products</h1>
            <p className="text-gray-500 mt-1">Manage products that need to be restocked</p>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <PackageX className="h-5 w-5 text-red-500 mr-2" />
              Total Out of Stock Items
            </CardTitle>
            <div className="text-2xl font-bold">{outOfStockItems.length}</div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md flex items-start mb-4">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Attention Required</p>
                <p>The following products are currently out of stock and need to be reordered as soon as possible to avoid customer dissatisfaction.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center">
            <CardTitle>Out of Stock Products</CardTitle>
            <div className="ml-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search out of stock products..."
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
                <p className="text-gray-500">Loading out of stock products...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>₹{item.price.toFixed(2)}</TableCell>
                          <TableCell>{formatDate(item.expiryDate)}</TableCell>
                          <TableCell>{item.manufacturer}</TableCell>
                          <TableCell>{item.batchNumber}</TableCell>
                          <TableCell>
                            <Button variant="default" size="sm" className="bg-pharmacy-600 hover:bg-pharmacy-700">
                              Reorder
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                          {searchTerm 
                            ? "No matching out of stock products found. Try adjusting your search."
                            : "All products are currently in stock. Great job maintaining inventory!"}
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
