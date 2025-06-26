"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, Edit, Trash2, Package } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  image: string
  status: "active" | "inactive"
  createdAt: string
}

export default function ProductDetailsPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    // Mock API call to fetch product - replace with actual API
    const fetchProduct = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock product data - replace with actual API call
        const mockProduct: Product = {
          id: params.id as string,
          name: "Laptop Dell XPS 13",
          description:
            "High-performance laptop with Intel Core i7 processor, 16GB RAM, and 512GB SSD. Perfect for professional work, gaming, and creative tasks. Features a stunning 13.3-inch InfinityEdge display with vibrant colors and sharp details.",
          price: 1200,
          category: "Electronics",
          stock: 15,
          image: "/placeholder.svg?height=300&width=300",
          status: "active",
          createdAt: "2024-01-10",
        }

        setProduct(mockProduct)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load product. Please try again.",
          variant: "destructive",
        })
        router.push("/admin/products")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, router, toast])

  const handleDelete = async () => {
    if (!product) return

    setDeleteLoading(true)

    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted",
      })

      router.push("/admin/products")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", variant: "destructive" as const }
    if (stock <= 10) return { label: "Low Stock", variant: "secondary" as const }
    return { label: "In Stock", variant: "default" as const }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!product) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Product not found</h3>
            <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
            <Link href="/admin/products">
              <Button>Back to Products</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const stockStatus = getStockStatus(product.stock)

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold md:text-2xl">Product Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/products/${product.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Product
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the product "{product.name}" and remove it
                  from the inventory.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete Product
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Product Image and Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="h-64 w-64 rounded-lg object-cover border"
              />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p className="text-3xl font-bold text-primary">${product.price}</p>
              <div className="flex justify-center gap-2">
                <Badge variant={product.status === "active" ? "default" : "secondary"}>{product.status}</Badge>
                <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Product ID</Label>
                <p className="font-mono text-sm">{product.id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                <p>{product.category}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Stock Quantity</Label>
                <p className="font-semibold">{product.stock} units</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Total Value</Label>
                <p className="font-semibold">${(product.price * product.stock).toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Created Date</Label>
                <p>{new Date(product.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                <p className="capitalize">{product.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {product.description || "No description available for this product."}
          </p>
        </CardContent>
      </Card>

      {/* Stock Information */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Information</CardTitle>
          <CardDescription>Current inventory status and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold">{product.stock}</p>
              <p className="text-sm text-muted-foreground">Units Available</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold">${(product.price * product.stock).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Inventory Value</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Badge variant={stockStatus.variant} className="text-sm">
                {stockStatus.label}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">Stock Status</p>
            </div>
          </div>

          {product.stock <= 10 && product.stock > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Low Stock Alert:</strong> This product is running low on inventory. Consider restocking soon.
              </p>
            </div>
          )}

          {product.stock === 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Out of Stock:</strong> This product is currently out of stock and unavailable for sale.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <label className={className}>{children}</label>
}
