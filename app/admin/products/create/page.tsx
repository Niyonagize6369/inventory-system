"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

interface ProductFormData {
  name: string;
  price: number;
  quantity: number; 
  category_id: number | null; 
  low_stock_threshold: number;
  image_url: string;
  description: string;
}

// --- Helper for API calls ---
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};


export default function CreateProductPage() {
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
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const headers = getAuthHeaders();
        const response = await fetch("http://localhost:5000/api/categories", { headers });
        if (!response.ok) throw new Error("Failed to load categories.");

        const data: Category[] = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Could not fetch categories:", error);
        toast({ title: "Error", description: "Could not load product categories.", variant: "destructive" });
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [toast]);

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
      toast({
        title: "Validation Error",
        description: "Please fill in Name, Category, and a valid Price.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const headers = getAuthHeaders();
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
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
        throw new Error(errorData.message || "Failed to create product.");
      }
      
      toast({ title: "Success", description: "Product has been created successfully." });
      router.push("/admin/products");

    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center gap-4 mb-4">
        <Link href="/admin/products"><Button variant="outline" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-lg font-semibold md:text-2xl">Create New Product</h1>
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
                <Input id="image_url" name="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="https://example.com/image.png" />
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
                    {isCategoriesLoading ? (
                      <div className="p-2 text-sm text-muted-foreground">Loading...</div>
                    ) : (
                      categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                      ))
                    )}
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
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Product
              </Button>
              <Link href="/admin/products"><Button type="button" variant="outline">Cancel</Button></Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}