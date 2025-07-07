"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Package, Search, X } from "lucide-react";


interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number; 
  image_url: string;
}

interface StockOutForm {
  quantity: number;
  reason: string;
}


const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export default function AdminStockOutPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<StockOutForm>({
    quantity: 1,
    reason: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const headers = getAuthHeaders();
        const response = await fetch("http://localhost:5000/api/products", { headers });
        if (!response.ok) throw new Error("Failed to load products.");

        const data = await response.json();
        setProducts(data.data || []);
      } catch (error) {
        toast({ title: "Error", description: "Could not load products.", variant: "destructive" });
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchProducts();
  }, [toast]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setFormData({ quantity: 1, reason: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      toast({ title: "Error", description: "Please select a product.", variant: "destructive" });
      return;
    }
    
    if (!formData.reason) {
      toast({ title: "Validation Error", description: "Please select a reason for the stock-out.", variant: "destructive" });
      return;
    }
    if (formData.quantity > selectedProduct.quantity) {
      toast({ title: "Validation Error", description: `Cannot stock out more than available: ${selectedProduct.quantity} units.`, variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const headers = getAuthHeaders();
      const body = {
        productId: selectedProduct.id,
        quantity: formData.quantity,
        reason: formData.reason,
      };

      const response = await fetch("http://localhost:5000/api/inventory/stock-out", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to process stock-out.");
      }
      
      setProducts(prev => prev.map(p => p.id === result.id ? result : p));
      toast({ title: "Success", description: `Removed ${formData.quantity} units of ${selectedProduct.name}.` });
      resetForm();

    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'quantity' ? Number(value) : value }));
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setSearchTerm("");
    setFormData({ quantity: 1, reason: "" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Stock-Out Management</h1>
        <div className="grid gap-6 lg:grid-cols-2">
          
          <Card>
            <CardHeader><CardTitle>1. Select a Product</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" disabled={!!selectedProduct} />
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {isInitialLoading ? (<p className="text-center py-4">Loading...</p>) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                  
                    <div key={product.id} className={`flex items-center gap-4 p-3 border rounded-lg cursor-pointer ${selectedProduct?.id === product.id ? "bg-slate-100 border-slate-400" : "hover:bg-slate-50"}`}
                      onClick={() => !selectedProduct && handleProductSelect(product)}>
                      <div className="flex-1">
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-sm text-slate-600">Current Stock: {product.quantity} units</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4">No products found.</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>2. Enter Stock-Out Details</CardTitle>
              {selectedProduct && <Button variant="ghost" size="sm" onClick={resetForm}><X className="mr-2 h-4 w-4" />Clear Selection</Button>}
            </CardHeader>
            <CardContent>
              {!selectedProduct ? (
                <div className="flex items-center justify-center h-full text-center text-slate-500">Please select a product from the list.</div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h3 className="font-bold">{selectedProduct.name}</h3>
                    <p className="text-sm">Available for stock-out: {selectedProduct.quantity}</p>
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity to Remove</Label>
                    <Input id="quantity" name="quantity" type="number" min="1" max={selectedProduct.quantity} value={formData.quantity} onChange={handleFormChange} required />
                  </div>
                  <div>
                    <Label htmlFor="reason">Reason for Stock-Out</Label>
                    <Select name="reason" value={formData.reason} onValueChange={(value) => setFormData(p => ({...p, reason: value}))} required>
                      <SelectTrigger><SelectValue placeholder="Select a reason..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sale">Sale</SelectItem>
                        <SelectItem value="Damaged">Damaged/Expired</SelectItem>
                        <SelectItem value="Internal Use">Internal Use</SelectItem>
                        <SelectItem value="Return to Supplier">Return to Supplier</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700 text-white">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Process Stock-Out
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}