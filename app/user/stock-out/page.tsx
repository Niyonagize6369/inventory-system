"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Package, Search } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  image: string
}

interface StockOutForm {
  productId: string
  productName: string
  price: number
  category: string
  quantity: number
  reason: string
}

export default function StockOutPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<StockOutForm>({
    productId: "",
    productName: "",
    price: 0,
    category: "",
    quantity: 1,
    reason: "",
  })

  const { toast } = useToast()
  const router = useRouter()

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
      },
      {
        id: "2",
        name: "Office Chair",
        price: 250,
        category: "Furniture",
        stock: 8,
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        id: "3",
        name: "Wireless Mouse",
        price: 35,
        category: "Electronics",
        stock: 45,
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        id: "4",
        name: "Monitor 24 inch",
        price: 300,
        category: "Electronics",
        stock: 22,
        image: "/placeholder.svg?height=60&width=60",
      },
    ]

    setProducts(mockProducts)
    setFilteredProducts(mockProducts)
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [searchTerm, products])

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      productId: product.id,
      productName: product.name,
      price: product.price,
      category: product.category,
      quantity: 1,
      reason: "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Please select a product",
        variant: "destructive",
      })
      return
    }

    if (formData.quantity > selectedProduct.stock) {
      toast({
        title: "Error",
        description: `Cannot stock out more than available quantity (${selectedProduct.stock})`,
        variant: "destructive",
      })
      return
    }

    if (formData.quantity <= 0) {
      toast({
        title: "Error",
        description: "Quantity must be greater than 0",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local stock (in real app, this would be handled by the API)
      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProduct.id ? { ...p, stock: p.stock - formData.quantity } : p)),
      )

      toast({
        title: "Stock Out Successful",
        description: `${formData.quantity} units of ${formData.productName} have been removed from inventory`,
      })

      // Reset form
      setSelectedProduct(null)
      setFormData({
        productId: "",
        productName: "",
        price: 0,
        category: "",
        quantity: 1,
        reason: "",
      })
      setSearchTerm("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process stock out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Stock Out Form</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Product Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Product</CardTitle>
            <CardDescription>Search and select a product to stock out</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                    selectedProduct?.id === product.id ? "bg-muted border-primary" : ""
                  }`}
                  onClick={() => handleProductSelect(product)}
                >
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
                    <p className="text-sm">Stock: {product.stock} units</p>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No products found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock Out Form */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Out Details</CardTitle>
            <CardDescription>Enter the details for stock out transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input id="productName" value={formData.productName} disabled placeholder="Select a product first" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" value={formData.price ? `$${formData.price}` : ""} disabled placeholder="$0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" value={formData.category} disabled placeholder="Category" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity to Stock Out</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedProduct?.stock || 0}
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      quantity: Number.parseInt(e.target.value) || 0,
                    }))
                  }
                  disabled={!selectedProduct}
                  placeholder="Enter quantity"
                />
                {selectedProduct && (
                  <p className="text-sm text-muted-foreground">Available: {selectedProduct.stock} units</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Select
                  value={formData.reason}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, reason: value }))}
                  disabled={!selectedProduct}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                    <SelectItem value="return">Return</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedProduct && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Transaction Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Product:</span>
                      <span>{formData.productName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span>{formData.quantity} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unit Price:</span>
                      <span>${formData.price}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total Value:</span>
                      <span>${(formData.price * formData.quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining Stock:</span>
                      <span>{selectedProduct.stock - formData.quantity} units</span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={!selectedProduct || isLoading || formData.quantity <= 0}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Process Stock Out
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
