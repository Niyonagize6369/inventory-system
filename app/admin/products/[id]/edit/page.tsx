"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"

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

export default function EditProductPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<Omit<Product, "id" | "createdAt">>({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    image: "",
    status: "active",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()

  const categories = ["Electronics", "Furniture", "Stationery", "Clothing", "Books", "Sports", "Home & Garden"]

  useEffect(() => {
    // Mock API call to fetch product - replace with actual API
    const fetchProduct = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock product data - replace with actual API call
        const mockProduct: Product = {
          id: params.id as string,
          name: "Laptop Dell XPS 13",
          description: "High-performance laptop with Intel Core i7 processor, 16GB RAM, and 512GB SSD",
          price: 1200,
          category: "Electronics",
          stock: 15,
          image: "/placeholder.svg?height=200&width=200",
          status: "active",
          createdAt: "2024-01-10",
        }

        setProduct(mockProduct)
        setFormData({
          name: mockProduct.name,
          description: mockProduct.description,
          price: mockProduct.price,
          category: mockProduct.category,
          stock: mockProduct.stock,
          image: mockProduct.image,
          status: mockProduct.status,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load product. Please try again.",
          variant: "destructive",
        })
        router.push("/admin/products")
      } finally {
        setPageLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, router, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageLoading(true)

    try {
      // Mock image upload - replace with actual upload logic
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a mock URL for the uploaded image
      const imageUrl = URL.createObjectURL(file)
      setFormData((prev) => ({ ...prev, image: imageUrl }))

      toast({
        title: "Image uploaded",
        description: "Product image has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setImageLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.category || formData.price <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields with valid values",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Product updated",
        description: "The product has been successfully updated",
      })

      router.push("/admin/products")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (pageLoading) {
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
            <p className="text-muted-foreground">Product not found</p>
            <Link href="/admin/products">
              <Button className="mt-4">Back to Products</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold md:text-2xl">Edit Product</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Update the product details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Image */}
              <div className="space-y-4">
                <Label>Product Image</Label>
                <div className="flex flex-col items-center gap-4">
                  {formData.image ? (
                    <img
                      src={formData.image || "/placeholder.svg"}
                      alt="Product preview"
                      className="h-32 w-32 rounded-lg object-cover border"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <Button variant="outline" disabled={imageLoading} asChild>
                      <span>
                        {imageLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="mr-2 h-4 w-4" />
                        )}
                        Change Image
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, status: value as "active" | "inactive" }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows={4}
              />
            </div>

            {/* Changes Summary */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Product Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Product ID:</span>
                  <span>{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span>{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span>{formData.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span>${formData.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stock:</span>
                  <span>{formData.stock} units</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="capitalize">{formData.status}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Product
              </Button>
              <Link href="/admin/products">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
