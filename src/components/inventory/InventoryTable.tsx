
import { useState } from "react";
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
import { Search, FileDown, Plus, Filter, Package as PackageIcon } from "lucide-react";

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

interface InventoryTableProps {
  inventory: InventoryItem[];
  onAddProduct?: () => void;
  saveData: (data: InventoryItem[]) => void;
}

export function InventoryTable({ inventory, onAddProduct, saveData }: InventoryTableProps) {
  // Search/filter UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  // Date helpers for expiry
  const currentDate = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(currentDate.getDate() + 30);

  // Extract unique categories for dropdown
  const categories = [...new Set(inventory.map(item => item.category))];

  // Filtering logic
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
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

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="mt-6">
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button className="bg-pharmacy-600 hover:bg-pharmacy-700" onClick={onAddProduct}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
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
                <PackageIcon className="h-4 w-4 mr-2" />
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
      </div>
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
                <TableCell>₹{item.price.toFixed(2)}</TableCell>
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
    </div>
  );
}
