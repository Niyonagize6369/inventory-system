"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Package,
  Users,
  DollarSign,
  BarChart3, 
} from "lucide-react";


interface DashboardStats {
  total_users: number;
  total_products: number;
  total_categories: number;
  total_inventory_value: number;
  low_stock_alerts: number; 
}

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number; 
  category: { name: string }; 
  image_url: string;
}


const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.error("Authentication token not found!");
    return {};
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};


export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const headers = getAuthHeaders();
        if (!headers.Authorization) throw new Error("User is not authenticated.");
        
        const statsPromise = fetch("http://localhost:5000/api/admin/stats", { headers });
        const productsPromise = fetch("http://localhost:5000/api/products", { headers });
        
        const [statsResponse, productsResponse] = await Promise.all([statsPromise, productsPromise]);

        if (!statsResponse.ok) throw new Error(`Failed to fetch dashboard stats: ${statsResponse.statusText}`);
        if (!productsResponse.ok) throw new Error(`Failed to fetch products: ${productsResponse.statusText}`);
        
        const statsData: DashboardStats = await statsResponse.json();
        const productsData = await productsResponse.json();
        
        setStats(statsData);
        setProducts(productsData.data || []);

      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Admin Dashboard</h1>
      </div>

      {isLoading && <p className="mt-4">Loading dashboard data...</p>}
      {error && <p className="mt-4 text-red-500">Error: {error}</p>}

      {!isLoading && !error && stats && (
        <>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-gray-800">Inventory Value</CardTitle>
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(stats.total_inventory_value || 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total value of all products in stock</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-gray-800">Total Products</CardTitle>
                <Package className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_products || 0}</div>
                <p className="text-xs text-muted-foreground">Unique products in inventory</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-gray-800">Total Users</CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_users || 0}</div>
                <p className="text-xs text-muted-foreground">Registered users in the system</p>
              </CardContent>
            </Card>

      

          </div>
          
          <div className="grid gap-6 md:gap-8 lg:grid-cols-2 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Recently Added Products</CardTitle>
                <CardDescription>A quick look at the newest items in your inventory.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.length > 0 ? (
                    products.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                          <Package className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Stock: {product.quantity || 0} units
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(product.price || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No products found.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            
            <Card>
                <CardHeader>
                    <CardTitle>Inventory Breakdown</CardTitle>
                    <CardDescription>A summary of your inventory structure.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Categories</span>
                        <span className="font-bold">{stats.total_categories || 0}</span>
                    </div>
                    
                </CardContent>
            </Card>

          </div>
        </>
      )}
    </DashboardLayout>
  );
}