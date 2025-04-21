
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Search, 
  UserPlus,
  Edit,
  Trash2,
  X,
  Check,
  UserCheck,
  UserX
} from "lucide-react";

// Sample staff data
const initialStaffData = [
  { 
    id: "S001", 
    name: "Dr. Sarah Johnson", 
    role: "Pharmacist", 
    phone: "555-123-4567", 
    email: "sarah.j@pharmaclinic.com", 
    status: "Active", 
    joinDate: "2022-06-15" 
  },
  { 
    id: "S002", 
    name: "Michael Chen", 
    role: "Pharmacy Technician", 
    phone: "555-987-6543", 
    email: "michael.c@pharmaclinic.com", 
    status: "Active", 
    joinDate: "2023-02-20" 
  },
  { 
    id: "S003", 
    name: "Emma Rodriguez", 
    role: "Cashier", 
    phone: "555-456-7890", 
    email: "emma.r@pharmaclinic.com", 
    status: "On Leave", 
    joinDate: "2023-04-10" 
  },
  { 
    id: "S004", 
    name: "John Smith", 
    role: "Inventory Manager", 
    phone: "555-789-0123", 
    email: "john.s@pharmaclinic.com", 
    status: "Active", 
    joinDate: "2021-11-05" 
  },
  { 
    id: "S005", 
    name: "Priya Patel", 
    role: "Pharmacist", 
    phone: "555-321-6549", 
    email: "priya.p@pharmaclinic.com", 
    status: "Inactive", 
    joinDate: "2020-08-12" 
  },
];

type Staff = typeof initialStaffData[0];

export default function StaffPage() {
  // State for staff data
  const [staffData, setStaffData] = useState<Staff[]>(() => {
    // Try to load from localStorage first
    const saved = localStorage.getItem("staffData");
    return saved ? JSON.parse(saved) : initialStaffData;
  });
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Form state for adding/editing staff
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Staff, "id">>({
    name: "",
    role: "",
    phone: "",
    email: "",
    status: "Active",
    joinDate: new Date().toISOString().split("T")[0],
  });
  
  // Apply filters to staff data
  const filteredStaff = staffData.filter(staff => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || staff.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Save data to localStorage
  const saveData = (data: Staff[]) => {
    localStorage.setItem("staffData", JSON.stringify(data));
    setStaffData(data);
  };
  
  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleStatusChange = (value: string) => {
    setFormData({
      ...formData,
      status: value,
    });
  };
  
  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value,
    });
  };
  
  const handleAddStaff = () => {
    setIsAddingStaff(true);
    setFormData({
      name: "",
      role: "",
      phone: "",
      email: "",
      status: "Active",
      joinDate: new Date().toISOString().split("T")[0],
    });
  };
  
  const handleEditStaff = (staff: Staff) => {
    setEditingStaffId(staff.id);
    setFormData({
      name: staff.name,
      role: staff.role,
      phone: staff.phone,
      email: staff.email,
      status: staff.status,
      joinDate: staff.joinDate,
    });
  };
  
  const handleCancelEdit = () => {
    setEditingStaffId(null);
    setIsAddingStaff(false);
  };
  
  const handleSaveStaff = () => {
    if (editingStaffId) {
      // Update existing staff
      const updatedStaff = staffData.map(staff => 
        staff.id === editingStaffId ? { ...staff, ...formData } : staff
      );
      saveData(updatedStaff);
      setEditingStaffId(null);
    } else if (isAddingStaff) {
      // Add new staff
      const newStaff = {
        id: `S${String(staffData.length + 1).padStart(3, '0')}`,
        ...formData,
      };
      saveData([...staffData, newStaff]);
      setIsAddingStaff(false);
    }
  };
  
  const handleDeleteStaff = (id: string) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      const updatedStaff = staffData.filter(staff => staff.id !== id);
      saveData(updatedStaff);
    }
  };
  
  // Format the join date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Staff Management</h1>
            <p className="text-gray-500 mt-1">Manage your pharmacy staff</p>
          </div>
          <Button 
            onClick={handleAddStaff} 
            className="bg-pharmacy-600 hover:bg-pharmacy-700"
            disabled={isAddingStaff || editingStaffId !== null}
          >
            <UserPlus className="mr-2 h-4 w-4" /> Add New Staff
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center">
            <CardTitle>Staff Members</CardTitle>
            <div className="ml-auto flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search staff..."
                  className="w-[250px] pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isAddingStaff && (
              <Card className="mb-6 border-pharmacy-100 bg-pharmacy-50">
                <CardHeader>
                  <CardTitle className="text-pharmacy-700">Add New Staff Member</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={formData.role} onValueChange={handleRoleChange}>
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                          <SelectItem value="Pharmacy Technician">Pharmacy Technician</SelectItem>
                          <SelectItem value="Cashier">Cashier</SelectItem>
                          <SelectItem value="Inventory Manager">Inventory Manager</SelectItem>
                          <SelectItem value="Store Manager">Store Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={handleStatusChange}>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="On Leave">On Leave</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="joinDate">Join Date</Label>
                      <Input
                        id="joinDate"
                        name="joinDate"
                        type="date"
                        value={formData.joinDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="ghost" onClick={handleCancelEdit}>
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button className="bg-pharmacy-600 hover:bg-pharmacy-700" onClick={handleSaveStaff}>
                    <Check className="mr-2 h-4 w-4" /> Save
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff) => (
                  <TableRow key={staff.id}>
                    {editingStaffId === staff.id ? (
                      <>
                        <TableCell>{staff.id}</TableCell>
                        <TableCell>
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                        </TableCell>
                        <TableCell>
                          <Select value={formData.role} onValueChange={handleRoleChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                              <SelectItem value="Pharmacy Technician">Pharmacy Technician</SelectItem>
                              <SelectItem value="Cashier">Cashier</SelectItem>
                              <SelectItem value="Inventory Manager">Inventory Manager</SelectItem>
                              <SelectItem value="Store Manager">Store Manager</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <Input
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="Phone"
                            />
                            <Input
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="Email"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select value={formData.status} onValueChange={handleStatusChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="On Leave">On Leave</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            name="joinDate"
                            type="date"
                            value={formData.joinDate}
                            onChange={handleInputChange}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                              <X className="h-4 w-4" />
                            </Button>
                            <Button variant="default" size="sm" className="bg-pharmacy-600" onClick={handleSaveStaff}>
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-medium">{staff.id}</TableCell>
                        <TableCell>{staff.name}</TableCell>
                        <TableCell>{staff.role}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div>{staff.phone}</div>
                            <div className="text-sm text-gray-500">{staff.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {staff.status === "Active" && (
                              <span className="flex items-center text-green-600">
                                <UserCheck className="mr-1 h-4 w-4" /> {staff.status}
                              </span>
                            )}
                            {staff.status === "On Leave" && (
                              <span className="flex items-center text-yellow-600">
                                <Users className="mr-1 h-4 w-4" /> {staff.status}
                              </span>
                            )}
                            {staff.status === "Inactive" && (
                              <span className="flex items-center text-red-600">
                                <UserX className="mr-1 h-4 w-4" /> {staff.status}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(staff.joinDate)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditStaff(staff)}
                              disabled={isAddingStaff || editingStaffId !== null}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:text-red-700" 
                              onClick={() => handleDeleteStaff(staff.id)}
                              disabled={isAddingStaff || editingStaffId !== null}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
                
                {filteredStaff.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                      No staff members found. Add a new staff member or adjust your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
