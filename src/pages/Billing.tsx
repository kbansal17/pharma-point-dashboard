
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Printer, Trash2, Plus } from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function Billing() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

  // Sample products (would come from API/database in real app)
  const products = [
    { id: "P001", name: "Paracetamol 500mg", price: 5.99 },
    { id: "P002", name: "Amoxicillin 250mg", price: 12.50 },
    { id: "P003", name: "Ibuprofen 400mg", price: 6.75 },
    { id: "P004", name: "Cetirizine 10mg", price: 8.25 },
    { id: "P005", name: "Vitamin C 1000mg", price: 9.99 },
  ];

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const addToCart = (product: typeof products[0]) => {
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
      // Update quantity if product already in cart
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Add new product to cart
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    // Clear search after adding
    setSearchProduct("");
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(
      cart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  const generateBill = () => {
    if (!customerName || cart.length === 0) {
      alert("Please add customer details and products");
      return;
    }
    
    // In a real app, this would submit to an API and save the bill
    const billData = {
      customer: {
        name: customerName,
        phone: customerPhone,
      },
      items: cart,
      summary: {
        subtotal,
        tax,
        total,
      },
      date: new Date().toISOString(),
      billNumber: `BILL-${Math.floor(Math.random() * 10000)}`,
    };
    
    console.log("Bill generated:", billData);
    
    // Save to localStorage for demo purposes (in real app this would go to a database)
    const existingBills = JSON.parse(localStorage.getItem("bills") || "[]");
    localStorage.setItem("bills", JSON.stringify([...existingBills, billData]));
    
    alert("Bill generated successfully!");
    
    // Clear form
    setCustomerName("");
    setCustomerPhone("");
    setCart([]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">New Bill</h1>
            <p className="text-gray-500 mt-1">Create a new bill</p>
          </div>
          <Button onClick={generateBill} className="bg-pharmacy-600 hover:bg-pharmacy-700">
            <FileText className="mr-2 h-4 w-4" /> Generate Bill
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input
                      id="customerName"
                      placeholder="Enter customer name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Phone Number</Label>
                    <Input
                      id="customerPhone"
                      placeholder="Enter phone number"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Input
                    placeholder="Search products..."
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                  />
                  
                  {searchProduct && filteredProducts.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                      {filteredProducts.map(product => (
                        <div
                          key={product.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                          onClick={() => addToCart(product)}
                        >
                          <span>{product.name}</span>
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-2">${product.price.toFixed(2)}</span>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cart.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No products added yet. Search and add products above.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Bill Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax (5%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button 
                    className="w-full bg-pharmacy-600 hover:bg-pharmacy-700"
                    onClick={generateBill}
                  >
                    <FileText className="mr-2 h-4 w-4" /> Generate Bill
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Printer className="mr-2 h-4 w-4" /> Print Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
