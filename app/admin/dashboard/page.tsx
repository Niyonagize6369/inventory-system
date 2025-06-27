"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/providers/auth-provider";
import {
  AlertTriangle,
  Package,
  Users,
  DollarSign,
  Plus,
  Minus,
} from "lucide-react";

interface DashboardStats {
  inventoryValue: number;
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  totalEmployees: number;
  stockIn: number;
  stockOut: number;
  stockAlerts: number;
}

interface TopProduct {
  id: string;
  name: string;
  category: string;
  sold: number;
  revenue: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  product: string;
  quantity: number;
  total: number;
  date: string;
  status: "completed" | "pending" | "cancelled";
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    inventoryValue: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalEmployees: 0,
    stockIn: 0,
    stockOut: 0,
    stockAlerts: 0,
  });
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockStats: DashboardStats = {
      inventoryValue: 125000,
      totalUsers: 45,
      totalProducts: 156,
      totalCategories: 12,
      totalEmployees: 8,
      stockIn: 234,
      stockOut: 189,
      stockAlerts: 7,
    };

    const mockTopProducts: TopProduct[] = [
      {
        id: "1",
        name: "Laptop Dell XPS 13",
        category: "Electronics",
        sold: 45,
        revenue: 54000,
      },
      {
        id: "2",
        name: "Office Chair",
        category: "Furniture",
        sold: 32,
        revenue: 8000,
      },
      {
        id: "3",
        name: "Wireless Mouse",
        category: "Electronics",
        sold: 78,
        revenue: 2730,
      },
      {
        id: "4",
        name: 'Monitor 24"',
        category: "Electronics",
        sold: 28,
        revenue: 8400,
      },
      {
        id: "5",
        name: "Desk Lamp",
        category: "Furniture",
        sold: 56,
        revenue: 2800,
      },
    ];

    const mockRecentOrders: RecentOrder[] = [
      {
        id: "ORD-001",
        customerName: "John Smith",
        product: "Laptop Dell XPS 13",
        quantity: 2,
        total: 2400,
        date: "2024-01-15",
        status: "completed",
      },
      {
        id: "ORD-002",
        customerName: "Sarah Johnson",
        product: "Office Chair",
        quantity: 1,
        total: 250,
        date: "2024-01-15",
        status: "pending",
      },
      {
        id: "ORD-003",
        customerName: "Mike Wilson",
        product: "Wireless Mouse",
        quantity: 5,
        total: 175,
        date: "2024-01-14",
        status: "completed",
      },
    ];

    setStats(mockStats);
    setTopProducts(mockTopProducts);
    setRecentOrders(mockRecentOrders);
  }, []);

  return (
    <DashboardLayout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Admin Dashboard</h1>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inventory Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.inventoryValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+3 new this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Across {stats.totalCategories} categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.stockAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Need immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Stock In (This Month)
            </CardTitle>
            <Plus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.stockIn}
            </div>
            <p className="text-xs text-muted-foreground">
              Items added to inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Stock Out (This Month)
            </CardTitle>
            <Minus className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.stockOut}
            </div>
            <p className="text-xs text-muted-foreground">
              Items removed from inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Active team members</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>
              Best performing products this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {product.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{product.sold} sold</p>
                    <p className="text-sm text-muted-foreground">
                      ${product.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            {/* <CardTitle>Recent Orders</CardTitle> */}
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{order.id}</h4>
                    <p className="text-sm text-muted-foreground">
                      {order.customerName} • {order.product}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total}</p>
                    <Badge
                      variant={
                        order.status === "completed"
                          ? "default"
                          : order.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
