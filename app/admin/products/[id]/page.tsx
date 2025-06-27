"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Star,
  TrendingUp,
  Calendar,
  DollarSign,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  status: "active" | "inactive";
  createdAt: string;
}

export default function ProductDetailsPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockProduct: Product = {
          id: params.id as string,
          name: "Laptop Dell XPS 13",
          description:
            "High-performance laptop with Intel Core i7 processor, 16GB RAM, and 512GB SSD. Perfect for professional work, gaming, and creative tasks. Features a stunning 13.3-inch InfinityEdge display with vibrant colors and sharp details.",
          price: 1200,
          category: "Electronics",
          stock: 15,
          image: "/placeholder.svg?height=400&width=400",
          status: "active",
          createdAt: "2024-01-10",
        };

        setProduct(mockProduct);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load product. Please try again.",
          variant: "destructive",
        });
        router.push("/admin/products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router, toast]);

  const handleDelete = async () => {
    if (!product) return;

    setDeleteLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted",
      });

      router.push("/admin/products");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return {
        label: "Out of Stock",
        variant: "destructive" as const,
        icon: XCircle,
        color: "text-red-500",
      };
    if (stock <= 10)
      return {
        label: "Low Stock",
        variant: "secondary" as const,
        icon: AlertTriangle,
        color: "text-amber-500",
      };
    return {
      label: "In Stock",
      variant: "default" as const,
      icon: CheckCircle,
      color: "text-emerald-500",
    };
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto"></div>
              <div
                className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-fuchsia-600 rounded-full animate-spin mx-auto"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "0.8s",
                }}
              ></div>
            </div>
            <p className="text-slate-600 font-medium">
              Loading product details...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md">
            <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mx-auto">
              <Package className="h-12 w-12 text-white" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-slate-800">
                Product Not Found
              </h3>
              <p className="text-slate-600">
                The product you're looking for doesn't exist or has been
                removed.
              </p>
            </div>
            <Link href="/admin/products">
              <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stockStatus = getStockStatus(product.stock);
  const StockIcon = stockStatus.icon;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0 bg-repeat"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>

          <div className="relative z-10 px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Link href="/admin/products">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-xl"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold">Product Details</h1>
                  <p className="text-white/80 mt-1">
                    Comprehensive product information
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link href={`/admin/products/${product.id}/edit`}>
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/20 border border-white/30 rounded-xl px-6"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Product
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-red-500/20 border border-red-300/50 rounded-xl px-6"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-xl">
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-base">
                        This action cannot be undone. This will permanently
                        delete the product "{product.name}" and remove it from
                        the inventory system.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteLoading}
                        className="bg-red-600 hover:bg-red-700 rounded-xl"
                      >
                        {deleteLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Delete Product
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8 space-y-8">
          {/* Hero Product Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Image & Gallery */}
            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-white/50">
                  <img
                    src={
                      product.image || "/placeholder.svg?height=400&width=400"
                    }
                    alt={product.name}
                    className="w-full h-80 object-cover rounded-2xl shadow-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge
                      variant={
                        product.status === "active" ? "default" : "secondary"
                      }
                      className="px-4 py-2 text-sm font-semibold rounded-full shadow-lg"
                    >
                      {product.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-white/50">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Badge
                        variant="outline"
                        className="px-3 py-1 text-sm font-medium rounded-full border-violet-200 text-violet-700"
                      >
                        {product.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <StockIcon className={`h-4 w-4 ${stockStatus.color}`} />
                        <Badge
                          variant={stockStatus.variant}
                          className="px-3 py-1 text-sm font-medium rounded-full"
                        >
                          {stockStatus.label}
                        </Badge>
                      </div>
                    </div>
                    <h2 className="text-4xl font-bold text-slate-800 mb-4">
                      {product.name}
                    </h2>
                    <div className="flex items-baseline gap-4">
                      <span className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                        ${product.price.toLocaleString()}
                      </span>
                      <span className="text-lg text-slate-500">per unit</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-4 border border-violet-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-slate-800">
                            {product.stock}
                          </p>
                          <p className="text-sm text-slate-600">
                            Units Available
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-fuchsia-50 to-pink-50 rounded-2xl p-4 border border-fuchsia-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-slate-800">
                            ${(product.price * product.stock).toLocaleString()}
                          </p>
                          <p className="text-sm text-slate-600">Total Value</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Product Information */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Product Info
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Product ID</span>
                  <span className="font-mono text-sm bg-slate-100 px-3 py-1 rounded-lg">
                    {product.id}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Category</span>
                  <span className="font-semibold text-slate-800">
                    {product.category}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600 font-medium">Created</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Stock Analytics */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Stock Analytics
                </h3>
              </div>

              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                  <p className="text-3xl font-bold text-emerald-600">
                    {product.stock}
                  </p>
                  <p className="text-sm text-emerald-700 font-medium">
                    Current Stock
                  </p>
                </div>

                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                  <StockIcon className={`h-5 w-5 ${stockStatus.color}`} />
                  <span className="font-semibold text-slate-700">
                    {stockStatus.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Quick Actions
                </h3>
              </div>

              <div className="space-y-3">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="block"
                >
                  <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Product
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full border-2 border-slate-200 hover:border-slate-300 rounded-xl py-3 font-semibold bg-transparent"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  View History
                </Button>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-white/50">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">
              Product Description
            </h3>
            <div className="prose prose-lg max-w-none">
              <p className="text-slate-600 leading-relaxed text-lg">
                {product.description ||
                  "No description available for this product."}
              </p>
            </div>
          </div>

          {/* Stock Alerts */}
          {product.stock <= 10 && (
            <div
              className={`rounded-3xl p-6 shadow-xl border ${
                product.stock === 0
                  ? "bg-gradient-to-br from-red-50 to-rose-50 border-red-200"
                  : "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    product.stock === 0
                      ? "bg-gradient-to-br from-red-500 to-rose-500"
                      : "bg-gradient-to-br from-amber-500 to-yellow-500"
                  }`}
                >
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4
                    className={`text-xl font-bold mb-2 ${
                      product.stock === 0 ? "text-red-800" : "text-amber-800"
                    }`}
                  >
                    {product.stock === 0
                      ? "Out of Stock Alert"
                      : "Low Stock Alert"}
                  </h4>
                  <p
                    className={`text-lg ${
                      product.stock === 0 ? "text-red-700" : "text-amber-700"
                    }`}
                  >
                    {product.stock === 0
                      ? "This product is currently out of stock and unavailable for sale. Immediate restocking is required."
                      : "This product is running low on inventory. Consider restocking soon to avoid stockouts."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
