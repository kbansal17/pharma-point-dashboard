
import { useState } from "react";
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Search, 
  FileDown, 
  Plus,
  Filter,
  PackageX,
  CalendarX
} from "lucide-react";

// Sample inventory data
const initialInventory = [
  {
    id: "P001",
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    manufacturer: "PharmaCorp",
    stock: 245,
    price: 5.99,
    expiryDate: "2025-09-15",
    batchNumber: "BT21458",
  },
  {
    id: "P002",
    name: "Amoxicillin 250mg",
    category: "Antibiotics",
    manufacturer: "MediPharm",
    stock: 120,
    price: 12.50,
    expiryDate: "2025-06-20",
    batchNumber: "BT34572",
  },
  {
    id: "P003",
    name: "Ibuprofen 400mg",
    category: "Pain Relief",
    manufacturer: "HealthCare",
    stock: 78,
    price: 6.75,
    expiryDate: "2025-10-10",
    batchNumber: "BT56789",
  },
  {
    id: "P004",
    name: "Cetirizine 10mg",
    category: "Allergy Relief",
    manufacturer: "AllerCure",
    stock: 0,
    price: 8.25,
    expiryDate: "2025-05-30",
    batchNumber: "BT78901",
  },
  {
    id: "P005",
    name: "Vitamin C 1000mg",
    category: "Vitamins",
    manufacturer: "VitaHealth",
    stock: 156,
    price: 9.99,
    expiryDate: "2026-02-15",
    batchNumber: "BT12345",
  },
  {
    id: "P006",
    name: "Omeprazole 20mg",
    category: "Digestive Health",
    manufacturer: "DigestCare",
    stock: 5,
    price: 14.99,
    expiryDate: "2025-05-05",
    batchNumber: "BT98765",
  },
  {
    id: "P007",
    name: "Metformin 500mg",
    category: "Diabetes",
    manufacturer: "GlucoHealth",
    stock: 212,
    price: 18.50,
    expiryDate: "2025-12-20",
    batchNumber: "BT45678",
  },
  {
    id: "P008",
    name: "Salbutamol Inhaler",
    category: "Respiratory",
    manufacturer: "BreathEase",
    stock: 0,
    price: 25.99,
    expiryDate: "2025-08-10",
    batchNumber: "BT87654",
  },
  {
    id: "P009",
    name: "Aspirin 75mg",
    category: "Pain Relief",
    manufacturer: "HeartCare",
    stock: 189,
    price: 4.99,
    expiryDate: "2024-05-15",
    batchNumber: "BT23456",
  },
  {
    id: "P010",
    name: "Simvastatin 20mg",
    category: "Cholesterol",
    manufacturer: "LipidCare",
    stock: 65,
    price: 22.50,
    expiryDate: "2024-05-30",
    batchNumber: "BT34567",
  },
];

type InventoryItem = typeof initialInventory[0];

export default function InventoryPage() {
  // State for inventory data
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    // Try to load from localStorage first
    const saved = localStorage.getItem("inventoryData");
    return saved ? JSON.parse(saved) : initialInventory;
  });
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  
  // Calculate the current date and 30 days from now for expiry checks
  const currentDate = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(currentDate.getDate() + 30);
  
  // Extract unique categories for the filter dropdown
  const categories = [...new Set(inventory.map(item => item.category))];
  
  // Apply filters to inventory data
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    
    // Stock filter logic
    let matchesStock = true;
    if (stockFilter === "outOfStock") {
      matchesStock = item.stock === 0;
    } else if (stockFilter === "lowStock") {
      matchesStock = item.stock > 0 && item.stock <= 10;
    } else if (stockFilter === "inStock") {
      matchesStock = item.stock > 10;
    }
    
    return matchesSearch && matchesCategory && matchesStock;
  });
  
  // Save data to localStorage
  const saveData = (data: InventoryItem[]) => {
    localStorage.setItem("inventoryData", JSON.stringify(data));
    setInventory(data);
  };
  
  // Stock status badge
  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive" className="bg-red-500">Out of Stock</Badge>;
    } else if (stock <= 10) {
      return <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">Low Stock</Badge>;
    } else {
      return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">In Stock</Badge>;
    }
  };
  
  // Expiry status
  const getExpiryStatus = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    
    if (expiry < currentDate) {
      return <Badge variant="destructive" className="bg-red-500">Expired</Badge>;
    } else if (expiry < thirtyDaysFromNow) {
      return <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">Expiring Soon</Badge>;
    } else {
      return formatDate(expiryDate);
    }
  };
  
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
            <h1 className="text-3xl font-bold">Inventory Management</h1>
            <p className="text-gray-500 mt-1">Manage your pharmacy inventory</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <FileDown className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button className="bg-pharmacy-600 hover:bg-pharmacy-700">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-5 w-5 text-pharmacy-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventory.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Out of Stock
              </CardTitle>
              <PackageX className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inventory.filter(item => item.stock === 0).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Near Expiry
              </CardTitle>
              <CalendarX className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inventory.filter(item => {
                  const expiry = new Date(item.expiryDate);
                  return expiry > currentDate && expiry < thirtyDaysFromNow;
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center">
            <CardTitle>All Products</CardTitle>
            <div className="ml-auto flex flex-col sm:flex-row items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full sm:w-[250px] pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={stockFilter} onValueChange={setStockFilter}>
                  <SelectTrigger className="w-[130px]">
                    <Package className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Stock" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stock</SelectItem>
                    <SelectItem value="inStock">In Stock</SelectItem>
                    <SelectItem value="lowStock">Low Stock</SelectItem>
                    <SelectItem value="outOfStock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Batch</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{item.stock}</span>
                          <span>{getStockBadge(item.stock)}</span>
                        </div>
                      </TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>{getExpiryStatus(item.expiryDate)}</TableCell>
                      <TableCell>{item.manufacturer}</TableCell>
                      <TableCell>{item.batchNumber}</TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredInventory.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                        No products found. Add new products or adjust your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
