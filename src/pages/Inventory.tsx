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
import { InventoryStats } from "@/components/inventory/InventoryStats";
import { InventoryTable } from "@/components/inventory/InventoryTable";

// Updated inventory data with some out of stock and near expiry items
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
    stock: 0,
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
    stock: 0,
    price: 4.99,
    expiryDate: "2024-05-15",
    batchNumber: "BT23456",
  },
  {
    id: "P010",
    name: "Simvastatin 20mg",
    category: "Cholesterol",
    manufacturer: "LipidCare",
    stock: 0,
    price: 22.50,
    expiryDate: "2024-05-30",
    batchNumber: "BT34567",
  },
  {
    id: "P011",
    name: "Losartan 50mg",
    category: "Blood Pressure",
    manufacturer: "CardioHealth",
    stock: 0,
    price: 15.99,
    expiryDate: "2024-05-10",
    batchNumber: "BT54321",
  },
  {
    id: "P012",
    name: "Atorvastatin 10mg",
    category: "Cholesterol",
    manufacturer: "LipidCare",
    stock: 0,
    price: 19.99,
    expiryDate: "2024-06-20",
    batchNumber: "BT65432",
  },
  {
    id: "P013",
    name: "Azithromycin 250mg",
    category: "Antibiotics",
    manufacturer: "MediPharm",
    stock: 0,
    price: 16.50,
    expiryDate: "2024-07-15",
    batchNumber: "BT76543",
  },
  {
    id: "P014",
    name: "Levothyroxine 50mcg",
    category: "Thyroid",
    manufacturer: "ThyroidCare",
    stock: 0,
    price: 12.99,
    expiryDate: "2024-06-30",
    batchNumber: "BT87654",
  },
  {
    id: "P015",
    name: "Fluconazole 150mg",
    category: "Antifungal",
    manufacturer: "MediPharm",
    stock: 0,
    price: 11.25,
    expiryDate: "2024-07-25",
    batchNumber: "BT98765",
  },
  {
    id: "P016",
    name: "Montelukast 10mg",
    category: "Respiratory",
    manufacturer: "BreathEase",
    stock: 0,
    price: 21.75,
    expiryDate: "2024-06-15",
    batchNumber: "BT12345",
  },
  {
    id: "P017",
    name: "Escitalopram 10mg",
    category: "Mental Health",
    manufacturer: "MindCare",
    stock: 0,
    price: 24.99,
    expiryDate: "2024-08-10",
    batchNumber: "BT23456",
  },
  {
    id: "P018",
    name: "Metoprolol 25mg",
    category: "Blood Pressure",
    manufacturer: "CardioHealth",
    stock: 25,
    price: 13.50,
    expiryDate: "2024-06-05",
    batchNumber: "BT34567",
  },
  {
    id: "P019",
    name: "Calcium + D3 Tablets",
    category: "Supplements",
    manufacturer: "VitaHealth",
    stock: 42,
    price: 8.99,
    expiryDate: "2024-05-25",
    batchNumber: "BT45678",
  },
  {
    id: "P020",
    name: "Folic Acid 5mg",
    category: "Supplements",
    manufacturer: "VitaHealth",
    stock: 36,
    price: 7.25,
    expiryDate: "2024-07-05",
    batchNumber: "BT56789",
  },
  {
    id: "P021",
    name: "Pantoprazole 40mg",
    category: "Digestive Health",
    manufacturer: "DigestCare",
    stock: 18,
    price: 17.99,
    expiryDate: "2024-06-25",
    batchNumber: "BT67890",
  },
  {
    id: "P022",
    name: "Glucosamine 1500mg",
    category: "Joint Health",
    manufacturer: "JointCare",
    stock: 47,
    price: 23.50,
    expiryDate: "2024-05-20",
    batchNumber: "BT78901",
  },
  {
    id: "P023",
    name: "Lansoprazole 30mg",
    category: "Digestive Health",
    manufacturer: "DigestCare",
    stock: 23,
    price: 16.75,
    expiryDate: "2024-06-10",
    batchNumber: "BT89012",
  },
  {
    id: "P024",
    name: "Albuterol Inhaler",
    category: "Respiratory",
    manufacturer: "BreathEase",
    stock: 12,
    price: 29.99,
    expiryDate: "2024-05-18",
    batchNumber: "BT90123",
  },
  {
    id: "P025",
    name: "Cephalexin 500mg",
    category: "Antibiotics",
    manufacturer: "MediPharm",
    stock: 0,
    price: 14.25,
    expiryDate: "2024-07-30",
    batchNumber: "BT01234",
  },
  {
    id: "P026",
    name: "Ranitidine 150mg",
    category: "Digestive Health",
    manufacturer: "DigestCare",
    stock: 31,
    price: 9.99,
    expiryDate: "2024-06-20",
    batchNumber: "BT12345",
  },
  {
    id: "P027",
    name: "Sertraline 50mg",
    category: "Mental Health",
    manufacturer: "MindCare",
    stock: 0,
    price: 18.75,
    expiryDate: "2024-08-05",
    batchNumber: "BT23456",
  },
  {
    id: "P028",
    name: "Iron Tablets 65mg",
    category: "Supplements",
    manufacturer: "VitaHealth",
    stock: 54,
    price: 11.99,
    expiryDate: "2024-06-30",
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

  // Save data to localStorage
  const saveData = (data: InventoryItem[]) => {
    localStorage.setItem("inventoryData", JSON.stringify(data));
    setInventory(data);
  };

  // Helpers for stats
  const currentDate = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(currentDate.getDate() + 30);

  const outOfStockCount = inventory.filter(item => item.stock === 0).length;
  const nearExpiryCount = inventory.filter(item => {
    const expiry = new Date(item.expiryDate);
    return expiry > currentDate && expiry < thirtyDaysFromNow;
  }).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inventory Management</h1>
            <p className="text-gray-500 mt-1">Manage your pharmacy inventory</p>
          </div>
        </div>
        <InventoryStats
          totalProducts={inventory.length}
          outOfStockCount={outOfStockCount}
          nearExpiryCount={nearExpiryCount}
        />
        <InventoryTable
          inventory={inventory}
          saveData={saveData}
        />
      </div>
    </DashboardLayout>
  );
}
