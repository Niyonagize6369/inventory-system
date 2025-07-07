"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/providers/auth-provider";
import { AlertTriangle, Package, TrendingDown, Eye, Loader2 } from "lucide-react";
import Link from "next/link";


interface Product {
  id: number;
  name: string;
  price: number;
  category: string; 
  quantity: number; 
  low_stock_threshold: number;
  image_url: string;
}

interface StockAlert {
  id: number;
  productName: string;
  currentStock: number;
  alertThreshold: number;
  category: string;
  alertLevel: "low" | "critical";
}


const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};


export default function UserDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const headers = getAuthHeaders();
        if (!headers.Authorization) throw new Error("User not authenticated.");

        const response = await fetch("http://localhost:5000/api/products", { headers });
        if (!response.ok) throw new Error("Failed to fetch products from the server.");
        
        const data = await response.json();
        setProducts(data.data || []);

      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  
  const dashboardData = useMemo(() => {
    if (products.length === 0) {
      return { totalProducts: 0, inventoryValue: 0, stockAlerts: [], recentProducts: [] };
    }

    const inventoryValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    
    const stockAlerts = products
      .filter(p => p.quantity <= p.low_stock_threshold)
      .map(p => ({
        id: p.id,
        productName: p.name,
        currentStock: p.quantity,
        alertThreshold: p.low_stock_threshold,
        category: p.category, 
        alertLevel: (p.quantity === 0) ? 'critical' : 'low' as "low" | "critical"
      }));

    
    const recentProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 5);
      
    return { totalProducts: products.length, inventoryValue, stockAlerts, recentProducts };
  }, [products]);


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (error) {
      return <div className="text-center text-red-500 p-4">Error: {error}</div>;
    }

    return (
      <>
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Welcome back, {user?.first_name}!</h1>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Products</CardTitle><Package className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{dashboardData.totalProducts}</div><p className="text-xs text-muted-foreground">Available in inventory</p></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Inventory Value</CardTitle><TrendingDown className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">${dashboardData.inventoryValue.toLocaleString()}</div><p className="text-xs text-muted-foreground">Total stock value</p></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Stock Alerts</CardTitle><AlertTriangle className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{dashboardData.stockAlerts.length}</div><p className="text-xs text-muted-foreground">Products need attention</p></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Quick Actions</CardTitle><Eye className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><Link href="/user/stock-out"><Button size="sm" className="w-full">Stock Out Form</Button></Link></CardContent></Card>
        </div>

        {/* Stock Alerts */}
        {dashboardData.stockAlerts.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-orange-500" /> Stock Alerts</CardTitle><CardDescription>Products at or below their low stock threshold</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.stockAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{alert.productName}</h4>
                      <p className="text-sm text-muted-foreground">Category: {alert.category}</p>
                      <p className="text-sm">Stock: {alert.currentStock} / Threshold: {alert.alertThreshold}</p>
                    </div>
                    <Badge variant={alert.alertLevel === "critical" ? "destructive" : "secondary"}>{alert.alertLevel === "critical" ? "Critical" : "Low Stock"}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Products */}
        <Card>
          <CardHeader><CardTitle>Recent Products</CardTitle><CardDescription>Latest products added to your inventory</CardDescription></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4">
                  <img src={product.image_url || "/placeholder.svg"} alt={product.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">{product.category} • ${product.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{product.quantity} units</p>
                    <p className="text-sm text-muted-foreground">${(product.price * product.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </>
    );
  };

  return (
    <DashboardLayout>
      {renderContent()}
    </DashboardLayout>
  );
}