"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Package, Search, X } from "lucide-react";


interface Product {
  id: number;
  name: string;
  price: number;
  category_id: number; 
  quantity: number;    
  image_url: string;
}

interface StockInFormData {
  quantity: number;
  supplier: string;
  purchasePrice: number;
  notes: string;
}

// --- Helper ---
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export default function AdminStockInPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<StockInFormData>({
    quantity: 1,
    supplier: "",
    purchasePrice: 0,
    notes: "",
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
        setIsLoading(false);
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
    setFormData(prev => ({ ...prev, purchasePrice: +(product.price * 0.7).toFixed(2) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      toast({ title: "Error", description: "Please select a product.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const headers = getAuthHeaders();
      
      const body = {
        productId: selectedProduct.id,
        quantity: formData.quantity,
        supplier: formData.supplier,
        purchasePrice: formData.purchasePrice,
        notes: formData.notes,
      };

      const response = await fetch("http://localhost:5000/api/inventory/stock-in", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let errorMessage = "Failed to process stock-in.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || JSON.stringify(errorData);
        } catch (e) {
            errorMessage = `Server Error: ${response.status}. Check backend console.`;
        }
        throw new Error(errorMessage);
      }

      const updatedProduct = await response.json();
      
    
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      toast({ title: "Success", description: `Added ${formData.quantity} units of ${selectedProduct.name}.` });
      resetForm();

    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: ['quantity', 'purchasePrice'].includes(name) ? Number(value) : value }));
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setSearchTerm("");
    setFormData({ quantity: 1, supplier: "", purchasePrice: 0, notes: "" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Stock-In Management</h1>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Product Selection */}
          <Card>
            <CardHeader><CardTitle>1. Select a Product</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" disabled={!!selectedProduct} />
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {isLoading ? (<p className="text-center py-4">Loading...</p>) : filteredProducts.map((product) => (
                  <div key={product.id} className={`flex items-center gap-4 p-3 border rounded-lg cursor-pointer ${selectedProduct?.id === product.id ? "bg-slate-100 border-slate-400" : "hover:bg-slate-50"}`}
                    onClick={() => !selectedProduct && handleProductSelect(product)}>
                    <div className="flex-1">
                      <h4 className="font-semibold">{product.name}</h4>
                      {/* Using 'quantity' to match the database schema */}
                      <p className="text-sm text-slate-600">Current Stock: {product.quantity} units</p>
                    </div>
                  </div>
                ))}
                {filteredProducts.length === 0 && !isLoading && <p className="text-center py-4">No products found for your search.</p>}
              </div>
            </CardContent>
          </Card>
          
          {/* Stock-In Form */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>2. Enter Stock-In Details</CardTitle>
              {selectedProduct && <Button variant="ghost" size="sm" onClick={resetForm}><X className="mr-2 h-4 w-4" />Clear Selection</Button>}
            </CardHeader>
            <CardContent>
              {!selectedProduct ? (
                <div className="flex items-center justify-center h-full text-center text-slate-500">Please select a product from the list.</div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h3 className="font-bold">{selectedProduct.name}</h3>
                    <p className="text-sm">Current Stock: {selectedProduct.quantity}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label htmlFor="quantity">Quantity to Add</Label><Input id="quantity" name="quantity" type="number" min="1" value={formData.quantity} onChange={handleFormChange} required /></div>
                    <div><Label htmlFor="purchasePrice">Purchase Price (per unit)</Label><Input id="purchasePrice" name="purchasePrice" type="number" min="0.01" step="0.01" value={formData.purchasePrice} onChange={handleFormChange} required /></div>
                  </div>
                  <div><Label htmlFor="supplier">Supplier</Label><Input id="supplier" name="supplier" value={formData.supplier} onChange={handleFormChange} required /></div>
                  <div><Label htmlFor="notes">Notes (Optional)</Label><Textarea id="notes" name="notes" value={formData.notes} onChange={handleFormChange} /></div>
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-gray-700 hover:bg-gray-800">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add to Stock
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