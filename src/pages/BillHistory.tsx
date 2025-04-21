
import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Search, Printer, Eye } from "lucide-react";

type BillType = {
  billNumber: string;
  date: string;
  customer: {
    name: string;
    phone: string;
  };
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  summary: {
    subtotal: number;
    tax: number;
    total: number;
  };
};

export default function BillHistory() {
  const [bills, setBills] = useState<BillType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBill, setSelectedBill] = useState<BillType | null>(null);

  useEffect(() => {
    // In a real app, this would be an API call
    const storedBills = JSON.parse(localStorage.getItem("bills") || "[]");
    setBills(storedBills);
    
    // If no bills in localStorage, add some sample data for demo
    if (storedBills.length === 0) {
      const sampleBills: BillType[] = [
        {
          billNumber: "BILL-1234",
          date: new Date(2025, 3, 15).toISOString(),
          customer: {
            name: "Arjun Mehta",
            phone: "555-123-4567",
          },
          items: [
            { id: "P001", name: "Paracetamol 500mg", price: 5.99, quantity: 2 },
            { id: "P003", name: "Ibuprofen 400mg", price: 6.75, quantity: 1 },
          ],
          summary: {
            subtotal: 18.73,
            tax: 0.94,
            total: 19.67,
          },
        },
        {
          billNumber: "BILL-1235",
          date: new Date(2025, 3, 16).toISOString(),
          customer: {
            name: "Riya Patel",
            phone: "555-987-6543",
          },
          items: [
            { id: "P002", name: "Amoxicillin 250mg", price: 12.50, quantity: 1 },
            { id: "P005", name: "Vitamin C 1000mg", price: 9.99, quantity: 2 },
          ],
          summary: {
            subtotal: 32.48,
            tax: 1.62,
            total: 34.10,
          },
        },
        {
          billNumber: "BILL-1236",
          date: new Date(2025, 3, 17).toISOString(),
          customer: {
            name: "Saanvi Sharma",
            phone: "555-555-1212",
          },
          items: [
            { id: "P004", name: "Cetirizine 10mg", price: 8.25, quantity: 1 },
          ],
          summary: {
            subtotal: 8.25,
            tax: 0.41,
            total: 8.66,
          },
        },
      ];
      
      localStorage.setItem("bills", JSON.stringify(sampleBills));
      setBills(sampleBills);
    }
  }, []);

  const filteredBills = bills.filter(bill => 
    bill.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const viewBill = (bill: BillType) => {
    setSelectedBill(bill);
  };

  const closeBillView = () => {
    setSelectedBill(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Bill History</h1>
          <p className="text-gray-500 mt-1">View and manage all bills</p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center">
            <CardTitle>All Bills</CardTitle>
            <div className="ml-auto flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search bills..."
                  className="w-[250px] pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {bills.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bill #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBills.map((bill) => (
                    <TableRow key={bill.billNumber}>
                      <TableCell className="font-medium">{bill.billNumber}</TableCell>
                      <TableCell>{formatDate(bill.date)}</TableCell>
                      <TableCell>
                        <div>
                          <div>{bill.customer.name}</div>
                          <div className="text-sm text-gray-500">{bill.customer.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">₹{bill.summary.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => viewBill(bill)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No bills found. Create your first bill.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bill View Modal */}
      {selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-pharmacy-600">Bill Details</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Printer className="h-4 w-4 mr-1" /> Print
                  </Button>
                  <Button variant="ghost" size="sm" onClick={closeBillView}>
                    Close
                  </Button>
                </div>
              </div>
              
              <div className="border-b pb-4 mb-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold text-lg">MediTrack</h3>
                    <p className="text-gray-500">Medical Store Management</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{selectedBill.billNumber}</p>
                    <p className="text-gray-500">{formatDate(selectedBill.date)}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-b pb-4 mb-4">
                <h3 className="font-bold mb-2">Customer Information</h3>
                <p>{selectedBill.customer.name}</p>
                <p>{selectedBill.customer.phone}</p>
              </div>
              
              <div className="border-b pb-4 mb-4">
                <h3 className="font-bold mb-2">Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedBill.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="text-right">
                <div className="flex justify-end mb-1">
                  <span className="w-24 text-gray-500">Subtotal:</span>
                  <span className="w-20">₹{selectedBill.summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-end mb-1">
                  <span className="w-24 text-gray-500">Tax (5%):</span>
                  <span className="w-20">₹{selectedBill.summary.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-end font-bold text-lg">
                  <span className="w-24">Total:</span>
                  <span className="w-20">₹{selectedBill.summary.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
