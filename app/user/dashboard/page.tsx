"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useAuth } from "@/components/providers/auth-provider"
import { AlertTriangle, Package, TrendingDown, Eye } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  image: string
  maxStock: number
}

interface StockAlert {
  id: string
  productName: string
  currentStock: number
  maxStock: number
  category: string
  alertLevel: "low" | "critical"
}

export default function UserDashboard() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([])

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Laptop Dell XPS 13",
        price: 1200,
        category: "Electronics",
        stock: 15,
        maxStock: 50,
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        id: "2",
        name: "Office Chair",
        price: 250,
        category: "Furniture",
        stock: 8,
        maxStock: 25,
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        id: "3",
        name: "Wireless Mouse",
        price: 35,
        category: "Electronics",
        stock: 45,
        maxStock: 100,
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        id: "4",
        name: "Notebook A4",
        price: 5,
        category: "Stationery",
        stock: 12,
        maxStock: 200,
        image: "/placeholder.svg?height=60&width=60",
      },
    ]

    const mockAlerts: StockAlert[] = mockProducts
      .filter((product) => product.stock / product.maxStock <= 0.2)
      .map((product) => ({
        id: product.id,
        productName: product.name,
        currentStock: product.stock,
        maxStock: product.maxStock,
        category: product.category,
        alertLevel: product.stock / product.maxStock <= 0.1 ? "critical" : "low",
      }))

    setProducts(mockProducts)
    setStockAlerts(mockAlerts)
  }, [])

  const totalProducts = products.length
  const lowStockProducts = stockAlerts.length
  const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0)

  return (
    <DashboardLayout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Welcome back, {user?.firstName}!</h1>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Available in inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total stock value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">Products need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link href="/user/stock-out">
              <Button size="sm" className="w-full">
                Stock Out Form
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Stock Alerts */}
      {stockAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Stock Alerts
            </CardTitle>
            <CardDescription>Products that need immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stockAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{alert.productName}</h4>
                    <p className="text-sm text-muted-foreground">Category: {alert.category}</p>
                    <p className="text-sm">
                      Stock: {alert.currentStock} / {alert.maxStock}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={alert.alertLevel === "critical" ? "destructive" : "secondary"}>
                      {alert.alertLevel === "critical" ? "Critical" : "Low Stock"}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {Math.round((alert.currentStock / alert.maxStock) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Products */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Products</CardTitle>
          <CardDescription>Latest products in your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center gap-4">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {product.category} • ${product.price}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{product.stock} units</p>
                  <p className="text-sm text-muted-foreground">${(product.price * product.stock).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
