"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";


interface Product {
  id: string;
  name: string;
  price: number;
  category: string; 
  stock: number;
  image: string;
  description: string;
  createdAt: string;
  status: "active" | "inactive";
}


const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};


export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const productsPerPage = 10;

  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const headers = getAuthHeaders();
        const response = await fetch("http://localhost:5000/api/products", { headers });

        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }
        
        const responseData = await response.json();
        setProducts(responseData.data || []);

      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);


  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        
        if (selectedStatus !== "all" && product.status !== selectedStatus) {
          return false;
        }
        
        if (selectedCategory !== "all" && product.category !== selectedCategory) {
          return false;
        }
        
        if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        return true;
      });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  
  const handleDeleteProduct = async (productId: string) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok && response.status !== 204) {
        throw new Error("Failed to delete the product.");
      }

      
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      toast({ title: "Success", description: "Product has been deleted." });

    } catch (error) {
      toast({ title: "Error", description: "Could not delete product. Please try again.", variant: "destructive" });
    } finally {
      setDeleteProduct(null); 
    }
  };

  const toggleProductStatus = async (product: Product) => {
    const newStatus = product.status === "active" ? "inactive" : "active";
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`http://localhost:5000/api/products/${product.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status: newStatus }), 
      });
      
      if (!response.ok) {
        throw new Error("Failed to update status.");
      }

      const updatedProduct = await response.json();
      
      // Update UI instantly on success
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updatedProduct : p)));
      toast({ title: "Success", description: `Product status updated to ${newStatus}.` });

    } catch (error) {
      toast({ title: "Error", description: "Could not update product status.", variant: "destructive" });
    }
  };

  // --- UI Helper ---
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", className: "bg-red-100 text-red-800" };
    if (stock <= 10) return { label: "Low Stock", className: "bg-yellow-100 text-yellow-800" };
    return { label: "In Stock", className: "bg-green-100 text-green-800" };
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-2xl font-bold text-gray-800">Product Management</h1>
        <Link href="/admin/products/create">
          <Button className="bg-gray-500 hover:bg-gray-600 hover:text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <Card className="mt-4">
        <CardHeader><CardTitle className="font-bold text-gray-800">Search & Filter</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (<SelectItem key={category} value={category}>{category}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="pt-6">
          {isLoading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold text-gray-800">Product</TableHead>
                    <TableHead className="font-bold text-gray-800">Stock</TableHead>
                    <TableHead className="font-bold text-gray-800">Price</TableHead>
                    <TableHead className="font-bold text-gray-800">Status</TableHead>
                    <TableHead className="text-right font-bold text-gray-800">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product) => {
                      const stockStatus = getStockStatus(product.stock);
                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="font-medium text-gray-800">{product.name}</div>
                            <div className="text-sm text-muted-foreground">{product.category}</div>
                          </TableCell>
                          <TableCell>
                            <Badge className={stockStatus.className}>{stockStatus.label}</Badge>
                            <span className="ml-2">{product.stock} units</span>
                          </TableCell>
                          <TableCell>${(product.price || 0).toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={product.status === "active" ? "default" : "secondary"} onClick={() => toggleProductStatus(product)} className="cursor-pointer">
                              {product.status === "active" ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/admin/products/${product.id}/edit`}><Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button></Link>
                            <Button variant="ghost" size="sm" onClick={() => setDeleteProduct(product)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow><TableCell colSpan={5} className="text-center">No products found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Previous</Button>
                  <span className="text-sm">Page {currentPage} of {totalPages}</span>
                  <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteProduct && handleDeleteProduct(deleteProduct.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}