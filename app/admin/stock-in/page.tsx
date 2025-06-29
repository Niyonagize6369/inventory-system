"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Package, Search, TrendingUp } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
}

interface StockInForm {
  productId: string;
  productName: string;
  price: number;
  category: string;
  quantity: number;
  supplier: string;
  purchasePrice: number;
  notes: string;
}

export default function AdminStockInPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<StockInForm>({
    productId: "",
    productName: "",
    price: 0,
    category: "",
    quantity: 1,
    supplier: "",
    purchasePrice: 0,
    notes: "",
  });

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    console.log("Loading stock-in page...");

    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

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
            name: "Office Chair Ergonomic",
            price: 250,
            category: "Furniture",
            stock: 8,
            image: "/placeholder.svg?height=60&width=60",
          },
          {
            id: "3",
            name: "Wireless Mouse Logitech",
            price: 35,
            category: "Electronics",
            stock: 45,
            image: "/placeholder.svg?height=60&width=60",
          },
          {
            id: "4",
            name: "Monitor 24 inch 4K",
            price: 300,
            category: "Electronics",
            stock: 22,
            image: "/placeholder.svg?height=60&width=60",
          },
          {
            id: "5",
            name: "Desk Lamp LED",
            price: 45,
            category: "Office Supplies",
            stock: 3,
            image: "/placeholder.svg?height=60&width=60",
          },
        ];

        console.log("Products loaded:", mockProducts.length);
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      } catch (error) {
        console.error("Error loading products:", error);
        toast({
          title: "Error",
          description: "Failed to load products. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.id.includes(searchTerm)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const handleProductSelect = (product: Product) => {
    console.log("Product selected:", product.name);
    setSelectedProduct(product);
    setFormData({
      productId: product.id,
      productName: product.name,
      price: product.price,
      category: product.category,
      quantity: 1,
      supplier: "",
      purchasePrice: product.price * 0.7, // Default to 70% of selling price
      notes: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting stock-in form:", formData);

    if (!selectedProduct) {
      toast({
        title: "No Product Selected",
        description: "Please select a product before proceeding",
        variant: "destructive",
      });
      return;
    }

    if (formData.quantity <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Quantity must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (formData.purchasePrice <= 0) {
      toast({
        title: "Invalid Purchase Price",
        description: "Purchase price must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (!formData.supplier.trim()) {
      toast({
        title: "Supplier Required",
        description: "Please enter the supplier name",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update local stock
      const updatedProducts = products.map((p) =>
        p.id === selectedProduct.id
          ? { ...p, stock: p.stock + formData.quantity }
          : p
      );

      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);

      toast({
        title: "Stock-In Processed Successfully",
        description: `Added ${formData.quantity} units of ${formData.productName} to inventory`,
      });

      // Reset form
      setSelectedProduct(null);
      setFormData({
        productId: "",
        productName: "",
        price: 0,
        category: "",
        quantity: 1,
        supplier: "",
        purchasePrice: 0,
        notes: "",
      });
      setSearchTerm("");

      console.log("Stock-in completed successfully");
    } catch (error) {
      console.error("Stock-in error:", error);
      toast({
        title: "Processing Failed",
        description: "Unable to process stock-in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setFormData({
      productId: "",
      productName: "",
      price: 0,
      category: "",
      quantity: 1,
      supplier: "",
      purchasePrice: 0,
      notes: "",
    });
    setSearchTerm("");
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-slate-600" />
            <p className="text-slate-600">Loading products...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Stock-In Management
            </h1>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Product Selection */}
          <Card className="border-slate-200">
            <CardContent className="p-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name, category, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-300 focus:border-slate-500"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all hover:bg-slate-50 ${
                      selectedProduct?.id === product.id
                        ? "bg-slate-100 border-slate-400 shadow-sm"
                        : "border-slate-200"
                    }`}
                    onClick={() => handleProductSelect(product)}
                  >
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg object-cover border border-slate-200"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">
                        {product.name}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {product.category} • ${product.price.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-slate-700">
                          Current: {product.stock} units
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">
                    No products found
                  </p>
                  <p className="text-sm text-slate-500">
                    Try adjusting your search terms
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
