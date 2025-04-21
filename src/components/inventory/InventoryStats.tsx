
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, PackageX, CalendarX } from "lucide-react";

interface InventoryStatsProps {
  totalProducts: number;
  outOfStockCount: number;
  nearExpiryCount: number;
}

export function InventoryStats({
  totalProducts,
  outOfStockCount,
  nearExpiryCount,
}: InventoryStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Total Products
          </CardTitle>
          <Package className="h-5 w-5 text-pharmacy-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
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
          <div className="text-2xl font-bold">{outOfStockCount}</div>
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
          <div className="text-2xl font-bold">{nearExpiryCount}</div>
        </CardContent>
      </Card>
    </div>
  );
}
