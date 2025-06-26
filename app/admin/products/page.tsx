"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  image: string
  description: string
  createdAt: string
  status: "active" | "inactive"
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [categories, setCategories] = useState<string[]>([])
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const productsPerPage = 10
  const { toast } = useToast()

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Laptop Dell XPS 13",
        price: 1200,
        category: "Electronics",
        stock: 15,
        image: "/placeholder.svg?height=60&width=60",
        description: "High-performance laptop with Intel Core i7",
        createdAt: "2024-01-10",
        status: "active",
      },
      {
        id: "2",
        name: "Office Chair",
        price: 250,
        category: "Furniture",
        stock: 8,
        image: "/placeholder.svg?height=60&width=60",
        description: "Ergonomic office chair with lumbar support",
        createdAt: "2024-01-12",
        status: "active",
      },
      {
        id: "3",
        name: "Wireless Mouse",
        price: 35,
        category: "Electronics",
        stock: 45,
        image: "/placeholder.svg?height=60&width=60",
        description: "Bluetooth wireless mouse with precision tracking",
        createdAt: "2024-01-08",
        status: "active",
      },
      {
        id: "4",
        name: "Notebook A4",
        price: 5,
        category: "Stationery",
        stock: 0,
        image: "/placeholder.svg?height=60&width=60",
        description: "Premium quality A4 notebook with lined pages",
        createdAt: "2024-01-15",
        status: "inactive",
      },
      {
        id: "5",
        name: "Monitor 24 inch",
        price: 300,
        category: "Electronics",
        stock: 22,
        image: "/placeholder.svg?height=60&width=60",
        description: "Full HD 24-inch monitor with IPS panel",
        createdAt: "2024-01-05",
        status: "active",
      },
    ]

    setProducts(mockProducts)
    setFilteredProducts(mockProducts)

    // Extract unique categories
    const uniqueCategories = Array.from(new Set(mockProducts.map((p) => p.category)))
    setCategories(uniqueCategories)
  }, [])

  useEffect(() => {
    let filtered = products

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((product) => product.status === selectedStatus)
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, selectedStatus, products])

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const handleDeleteProduct = async (productId: string) => {
    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 500))

      setProducts((prev) => prev.filter((product) => product.id !== productId))
      setDeleteProduct(null)

      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleProductStatus = async (productId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active"

      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, status: newStatus as "active" | "inactive" } : product,
        ),
      )

      toast({
        title: "Product status updated",
        description: `Product has been ${newStatus === "active" ? "activated" : "deactivated"}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", variant: "destructive" as const }
    if (stock <= 10) return { label: "Low Stock", variant: "secondary" as const }
    return { label: "In Stock", variant: "default" as const }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Product Management</h1>
        <Link href="/admin/products/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find and filter products by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
          <CardDescription>Manage your product inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock)
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{product.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{product.stock}</span>
                        <Badge variant={stockStatus.variant} className="text-xs">
                          {stockStatus.label}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.status === "active" ? "default" : "secondary"}>{product.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Product
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toggleProductStatus(product.id, product.status)}>
                            {product.status === "active" ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => setDeleteProduct(product)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product "{deleteProduct?.name}" and remove
              it from the inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProduct && handleDeleteProduct(deleteProduct.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
