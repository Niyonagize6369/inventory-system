"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
}


interface ProductData {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category_id: number;
  low_stock_threshold: number;
  image_url: string;
  description: string;
}


interface ProductFormData {
  name: string;
  price: number;
  quantity: number;
  category_id: number | null;
  low_stock_threshold: number;
  image_url: string;
  description: string;
}


const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};


export default function EditProductPage() {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    quantity: 0,
    category_id: null,
    low_stock_threshold: 10,
    image_url: "",
    description: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  useEffect(() => {
    const fetchData = async () => {
      if (!productId) return;
      try {
        const headers = getAuthHeaders();
        
  
        const productPromise = fetch(`http://localhost:5000/api/products/${productId}`, { headers });
        const categoriesPromise = fetch("http://localhost:5000/api/categories", { headers });

        const [productResponse, categoriesResponse] = await Promise.all([productPromise, categoriesPromise]);

        if (!productResponse.ok) {
          if (productResponse.status === 404) throw new Error("Product not found.");
          throw new Error("Failed to load product data.");
        }
        if (!categoriesResponse.ok) throw new Error("Failed to load categories.");

        const productData: ProductData = await productResponse.json();
        const categoriesData: Category[] = await categoriesResponse.json();
        
      
        setFormData({
          name: productData.name,
          price: productData.price,
          quantity: productData.quantity,
          category_id: productData.category_id,
          low_stock_threshold: productData.low_stock_threshold,
          image_url: productData.image_url || "",
          description: productData.description || "",
        });
        
        setCategories(categoriesData);

      } catch (err: any) {
        setError(err.message);
        toast({ title: "Error", description: err.message, variant: "destructive" });
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [productId, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["price", "quantity", "low_stock_threshold"].includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category_id || formData.price <= 0) {
      toast({ title: "Validation Error", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);

    try {
      const headers = getAuthHeaders();
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          name: formData.name,
          price: formData.price,
          quantity: formData.quantity,
          category_id: formData.category_id,
          low_stock_threshold: formData.low_stock_threshold,
          image_url: formData.image_url || undefined,
          description: formData.description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update the product.");
      }

      toast({ title: "Success", description: "Product has been updated successfully." });
      router.push("/admin/products");

    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin" /><p className="ml-4">Loading product...</p></div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]"><p className="text-red-500 mb-4">{error}</p><Link href="/admin/products"><Button variant="outline">Back to Products</Button></Link></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center gap-4 mb-4">
        <Link href="/admin/products"><Button variant="outline" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-lg font-semibold md:text-2xl">Edit Product</h1>
      </div>

      <Card>
        <CardHeader><CardTitle>Product Information</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />

                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} />

                <Label htmlFor="image_url">Image URL</Label>
                <Input id="image_url" name="image_url" value={formData.image_url} onChange={handleInputChange} />
              </div>
              
              <div className="space-y-4">
                <Label htmlFor="category_id">Category</Label>
                <Select
                  value={formData.category_id ? String(formData.category_id) : ""}
                  onValueChange={(value) => setFormData(p => ({ ...p, category_id: Number(value) }))}
                  required
                >
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (<SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>))}
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity (Stock)</Label>
                    <Input id="quantity" name="quantity" type="number" min="0" value={formData.quantity} onChange={handleInputChange} required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
                  <Input id="low_stock_threshold" name="low_stock_threshold" type="number" min="0" value={formData.low_stock_threshold} onChange={handleInputChange} required />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="bg-gray-600 hover:bg-gray-700">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update Product
              </Button>
              <Link href="/admin/products"><Button type="button" variant="outline">Cancel</Button></Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}