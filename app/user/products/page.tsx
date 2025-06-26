"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Package } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  image: string
  description: string
  createdAt: string
}

export default function UserProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [categories, setCategories] = useState<string[]>([])
  const productsPerPage = 12

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Laptop Dell XPS 13",
        price: 1200,
        category: "Electronics",
        stock: 15,
        image: "/placeholder.svg?height=200&width=200",
        description: "High-performance laptop with Intel Core i7",
        createdAt: "2024-01-10",
      },
      {
        id: "2",
        name: "Office Chair",
        price: 250,
        category: "Furniture",
        stock: 8,
        image: "/placeholder.svg?height=200&width=200",
        description: "Ergonomic office chair with lumbar support",
        createdAt: "2024-01-12",
      },
      {
        id: "3",
        name: "Wireless Mouse",
        price: 35,
        category: "Electronics",
        stock: 45,
        image: "/placeholder.svg?height=200&width=200",
        description: "Bluetooth wireless mouse with precision tracking",
        createdAt: "2024-01-08",
      },
      {
        id: "4",
        name: "Notebook A4",
        price: 5,
        category: "Stationery",
        stock: 12,
        image: "/placeholder.svg?height=200&width=200",
        description: "Premium quality A4 notebook with lined pages",
        createdAt: "2024-01-15",
      },
      {
        id: "5",
        name: "Monitor 24 inch",
        price: 300,
        category: "Electronics",
        stock: 22,
        image: "/placeholder.svg?height=200&width=200",
        description: "Full HD 24-inch monitor with IPS panel",
        createdAt: "2024-01-05",
      },
      {
        id: "6",
        name: "Desk Lamp",
        price: 50,
        category: "Furniture",
        stock: 18,
        image: "/placeholder.svg?height=200&width=200",
        description: "LED desk lamp with adjustable brightness",
        createdAt: "2024-01-14",
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
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, products])

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", variant: "destructive" as const }
    if (stock <= 10) return { label: "Low Stock", variant: "secondary" as const }
    return { label: "In Stock", variant: "default" as const }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
        <Link href="/user/stock-out">
          <Button>Stock Out Form</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find products by name, category, or other criteria</CardDescription>
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
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select category" />
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
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentProducts.map((product) => {
          const stockStatus = getStockStatus(product.stock)
          return (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover transition-all hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">${product.price}</span>
                    <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{product.category}</span>
                    <span>{product.stock} units</span>
                  </div>
                  <Link href={`/user/products/${product.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
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

      {/* No results */}
      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground text-center">Try adjusting your search criteria or filters</p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}
