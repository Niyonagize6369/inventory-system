"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Package, Search, Bell, CheckCircle, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";


interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  quantity: number;
  low_stock_threshold: number;
  image_url: string;
}

interface StockAlert {
  severity: string;
  title: any;
  message: any;
  created_at: string | number | Date;
  id: number;
  productName: string;
  currentStock: number;
  alertThreshold: number;
  category: string;
  alertLevel: "low" | "critical" | "high" | "medium"; 
  isRead: boolean; 
  type: string;
}

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("authToken");
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) { headers["Authorization"] = `Bearer ${token}`; }
  return headers;
};

export default function UserAlertsPage() {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  
  const { toast } = useToast();

  
  useEffect(() => {
    const fetchProductsAndGenerateAlerts = async () => {
      try {
        setIsLoading(true);
        const headers = getAuthHeaders();
        const response = await fetch("http://localhost:5000/api/products", { headers });
        if (!response.ok) throw new Error("Failed to load product data.");

        const data = await response.json();
        const products: Product[] = data.data || [];

      
        const generatedAlerts = products
          .filter(p => p.quantity <= p.low_stock_threshold)
          .map(p => ({
            id: p.id,
            productName: p.name,
            currentStock: p.quantity,
            alertThreshold: p.low_stock_threshold,
            category: p.category,
            type: p.quantity === 0 ? 'out_of_stock' : 'low_stock',
            title: p.quantity === 0 ? 'Out of Stock' : 'Low Stock Alert',
            message: `${p.name} is running low. Current stock: ${p.quantity}.`,
            severity: ((): "critical" | "high" | "medium" => {
              if (p.quantity === 0) return 'critical';
              if (p.quantity <= (p.low_stock_threshold * 0.5)) return 'high';
              return 'medium';
            })(),
            isRead: false, 
            created_at: new Date().toISOString(), 
          }));

        setAlerts(generatedAlerts);
        setError(null);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductsAndGenerateAlerts();
  }, []);


  const filteredAlerts = useMemo(() => {
    return alerts
      .filter(a => showUnreadOnly ? !a.isRead : true)
      .filter(a => selectedType === 'all' || a.type === selectedType)
      .filter(a => selectedSeverity === 'all' || a.severity === selectedSeverity)
      .filter(a => 
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        a.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.productName && a.productName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  }, [alerts, searchTerm, selectedType, selectedSeverity, showUnreadOnly]);

  
  const markAsRead = (alertId: number) => setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, isRead: true } : a));
  const markAllAsRead = () => setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
  const dismissAlert = (alertId: number) => setAlerts(prev => prev.filter(a => a.id !== alertId));
  
  const unreadCount = useMemo(() => alerts.filter(a => !a.isRead).length, [alerts]);
  const getSeverityBadgeVariant = (s: string) => (s === 'critical' || s === 'high' ? 'destructive' : 'secondary');
  const getTypeIcon = (t: string) => t.includes('stock') ? <Package className="h-5 w-5 text-muted-foreground" /> : <Bell className="h-5 w-5 text-muted-foreground" />;

  const renderContent = () => {
    if (isLoading) return <div className="text-center py-20"><Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" /></div>;
    if (error) return <div className="text-center py-20 text-red-600 font-semibold bg-red-50 p-4 rounded-lg">{error}</div>;
    if (filteredAlerts.length === 0) return <Card><CardContent className="py-12 text-center text-muted-foreground">You're all caught up! No alerts match your criteria.</CardContent></Card>;
    
    return (
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <Card key={alert.id} className={`${!alert.isRead ? "border-l-4 border-primary bg-primary/5" : ""}`}>
            <CardContent className="p-4 flex items-start justify-between">
              <div className="flex-1 flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">{getTypeIcon(alert.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-medium ${!alert.isRead ? "font-semibold" : ""}`}>{alert.title}</h4>
                    <Badge variant={getSeverityBadgeVariant(alert.severity)} className="text-xs">{alert.severity}</Badge>
                    {!alert.isRead && <Badge className="text-xs">New</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{new Date(alert.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Link href={`/user/products/${alert.id}`}><Button variant="outline" size="sm">View Product</Button></Link>
                {!alert.isRead && <Button variant="outline" size="sm" onClick={() => markAsRead(alert.id)}><CheckCircle className="h-4 w-4" /></Button>}
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => dismissAlert(alert.id)}><X className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4"><h1 className="text-lg font-semibold md:text-2xl">Alerts & Notifications</h1>{unreadCount > 0 && <Badge variant="destructive">{unreadCount} unread</Badge>}</div>
        {unreadCount > 0 && <Button onClick={markAllAsRead} variant="outline"><CheckCircle className="mr-2 h-4 w-4" />Mark All as Read</Button>}
      </div>
      <Card className="mb-4">
        <CardHeader><CardTitle>Filter Alerts</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1 relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search alerts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" /></div>
            <Select value={selectedType} onValueChange={setSelectedType}><SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Alert Type" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="low_stock">Low Stock</SelectItem><SelectItem value="out_of_stock">Out of Stock</SelectItem></SelectContent></Select>
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}><SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Severity" /></SelectTrigger><SelectContent><SelectItem value="all">All Severities</SelectItem><SelectItem value="critical">Critical</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem></SelectContent></Select>
            <Button variant={showUnreadOnly ? "default" : "outline"} onClick={() => setShowUnreadOnly(!showUnreadOnly)}>{showUnreadOnly ? "Show All" : "Unread Only"}</Button>
          </div>
        </CardContent>
      </Card>
      {renderContent()}
    </DashboardLayout>
  );
}