"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Package,
  Search,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
}

interface StockOutForm {
  productId: string;
  productName: string;
  price: number;
  category: string;
  quantity: number;
  reason: string;
}

export default function AdminStockOutPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [formData, setFormData] = useState<StockOutForm>({
    productId: "",
    productName: "",
    price: 0,
    category: "",
    quantity: 1,
    reason: "",
  });

  const { toast } = useToast();

  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log("Loading products for stock-out page...");

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockProducts: Product[] = [
          {
            id: "1",
            name: "Dell XPS 13 Laptop",
            price: 1299,
            category: "Electronics",
            stock: 23,
            image: "/placeholder.svg?height=60&width=60",
          },
          {
            id: "2",
            name: "iPhone 15 Pro",
            price: 999,
            category: "Electronics",
            stock: 15,
            image: "/placeholder.svg?height=60&width=60",
          },
          {
            id: "3",
            name: "Samsung Galaxy S24",
            price: 899,
            category: "Electronics",
            stock: 8,
            image: "/placeholder.svg?height=60&width=60",
          },
          {
            id: "4",
            name: "MacBook Pro 14",
            price: 1999,
            category: "Electronics",
            stock: 12,
            image: "/placeholder.svg?height=60&width=60",
          },
          {
            id: "5",
            name: "Office Chair Premium",
            price: 450,
            category: "Furniture",
            stock: 6,
            image: "/placeholder.svg?height=60&width=60",
          },
          {
            id: "6",
            name: "Standing Desk",
            price: 650,
            category: "Furniture",
            stock: 4,
            image: "/placeholder.svg?height=60&width=60",
          },
        ];

        console.log("Products loaded successfully:", mockProducts.length);
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      } catch (error) {
        console.error("Error loading products:", error);
        toast({
          title: "Loading Error",
          description: "Failed to load products. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadProducts();
  }, [toast]);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.id.includes(searchTerm)
      );
      setFilteredProducts(filtered);
      console.log(
        `Filtered ${filtered.length} products for search: "${searchTerm}"`
      );
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
      reason: "",
    });
  };

  const handleQuantityChange = (value: string) => {
    const quantity = Number.parseInt(value) || 0;
    setFormData((prev) => ({ ...prev, quantity }));
  };

  const handleReasonChange = (value: string) => {
    setFormData((prev) => ({ ...prev, reason: value }));
  };

  const validateForm = (): string | null => {
    if (!selectedProduct) {
      return "Please select a product first";
    }

    if (formData.quantity <= 0) {
      return "Quantity must be greater than 0";
    }

    if (formData.quantity > selectedProduct.stock) {
      return `Cannot stock out more than available quantity (${selectedProduct.stock} units)`;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);

    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Processing stock-out transaction...");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update local stock
      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedProduct!.id
            ? { ...p, stock: p.stock - formData.quantity }
            : p
        )
      );

      console.log("Stock-out processed successfully");

      toast({
        title: "Stock-Out Completed",
        description: `Successfully removed ${formData.quantity} units of ${formData.productName} from inventory`,
      });

      // Reset form
      resetForm();
    } catch (error) {
      console.error("Stock-out error:", error);
      toast({
        title: "Transaction Failed",
        description: "Failed to process stock-out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
      reason: "",
    });
    setSearchTerm("");
  };

  const getStockStatusColor = (stock: number) => {
    if (stock === 0) return "text-red-600";
    if (stock <= 5) return "text-amber-600";
    return "text-emerald-600";
  };

  if (isInitialLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-600 font-medium">
              Loading stock-out system...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Stock-Out Management
            </h1>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Product Selection */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-200"></CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by product name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-300 focus:border-slate-500"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all hover:bg-slate-50 ${
                        selectedProduct?.id === product.id
                          ? "bg-slate-50 border-slate-400 ring-2 ring-slate-200"
                          : "border-slate-200"
                      }`}
                      onClick={() => handleProductSelect(product)}
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">
                          {product.name}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {product.category} • ${product.price.toLocaleString()}
                        </p>
                      </div>
                      {selectedProduct?.id === product.id && (
                        <CheckCircle2 className="h-5 w-5 text-slate-600" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      No products found
                    </h3>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
