"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  Package,
  Search,
  Bell,
  CheckCircle,
  Clock,
  X,
  Users,
  Settings,
  Plus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface Alert {
  id: string;
  type:
    | "low_stock"
    | "out_of_stock"
    | "system"
    | "maintenance"
    | "user_activity"
    | "security";
  title: string;
  message: string;
  productId?: string;
  productName?: string;
  userId?: string;
  userName?: string;
  currentStock?: number;
  minStock?: number;
  severity: "low" | "medium" | "high" | "critical";
  isRead: boolean;
  isResolved: boolean;
  assignedTo?: string;
  createdAt: string;
  resolvedAt?: string;
}

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const alertsPerPage = 10;
  const { toast } = useToast();

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockAlerts: Alert[] = [
      {
        id: "1",
        type: "out_of_stock",
        title: "Critical Stock Alert",
        message: "Multiple products are completely out of stock",
        productId: "4",
        productName: "Notebook A4",
        currentStock: 0,
        minStock: 20,
        severity: "critical",
        isRead: false,
        isResolved: false,
        assignedTo: "admin",
        createdAt: "2024-01-20T10:30:00Z",
      },
      {
        id: "2",
        type: "low_stock",
        title: "Low Stock Warning",
        message: "Laptop Dell XPS 13 inventory is below minimum threshold",
        productId: "1",
        productName: "Laptop Dell XPS 13",
        currentStock: 5,
        minStock: 10,
        severity: "high",
        isRead: false,
        isResolved: false,
        createdAt: "2024-01-20T09:15:00Z",
      },
      {
        id: "3",
        type: "user_activity",
        title: "Unusual User Activity",
        message: "User johndoe has made multiple large stock-out requests",
        userId: "2",
        userName: "John Doe",
        severity: "medium",
        isRead: true,
        isResolved: false,
        assignedTo: "admin",
        createdAt: "2024-01-19T16:45:00Z",
      },
      {
        id: "4",
        type: "system",
        title: "System Maintenance Required",
        message: "Database optimization scheduled for tonight",
        severity: "low",
        isRead: false,
        isResolved: false,
        createdAt: "2024-01-19T14:20:00Z",
      },
      {
        id: "5",
        type: "security",
        title: "Security Alert",
        message: "Multiple failed login attempts detected",
        severity: "high",
        isRead: true,
        isResolved: true,
        resolvedAt: "2024-01-19T12:00:00Z",
        createdAt: "2024-01-19T11:30:00Z",
      },
      {
        id: "6",
        type: "low_stock",
        title: "Stock Alert",
        message: "Office Chair inventory needs restocking",
        productId: "2",
        productName: "Office Chair",
        currentStock: 3,
        minStock: 10,
        severity: "medium",
        isRead: true,
        isResolved: false,
        createdAt: "2024-01-18T15:20:00Z",
      },
    ];

    setAlerts(mockAlerts);
    setFilteredAlerts(mockAlerts);
  }, []);

  useEffect(() => {
    let filtered = alerts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (alert) =>
          alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (alert.productName &&
            alert.productName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (alert.userName &&
            alert.userName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((alert) => alert.type === selectedType);
    }

    // Filter by severity
    if (selectedSeverity !== "all") {
      filtered = filtered.filter(
        (alert) => alert.severity === selectedSeverity
      );
    }

    // Filter by status
    if (selectedStatus === "unread") {
      filtered = filtered.filter((alert) => !alert.isRead);
    } else if (selectedStatus === "unresolved") {
      filtered = filtered.filter((alert) => !alert.isResolved);
    } else if (selectedStatus === "resolved") {
      filtered = filtered.filter((alert) => alert.isResolved);
    }

    setFilteredAlerts(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedSeverity, selectedStatus, alerts]);

  // Pagination
  const indexOfLastAlert = currentPage * alertsPerPage;
  const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
  const currentAlerts = filteredAlerts.slice(
    indexOfFirstAlert,
    indexOfLastAlert
  );
  const totalPages = Math.ceil(filteredAlerts.length / alertsPerPage);

  const markAsRead = async (alertId: string) => {
    try {
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, isRead: true } : alert
        )
      );

      toast({
        title: "Alert marked as read",
        description: "The alert has been marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark alert as read",
        variant: "destructive",
      });
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId
            ? {
                ...alert,
                isResolved: true,
                resolvedAt: new Date().toISOString(),
                isRead: true,
              }
            : alert
        )
      );

      toast({
        title: "Alert resolved",
        description: "The alert has been marked as resolved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve alert",
        variant: "destructive",
      });
    }
  };

  const dismissAlert = async (alertId: string) => {
    try {
      setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));

      toast({
        title: "Alert dismissed",
        description: "The alert has been dismissed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to dismiss alert",
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "low_stock":
      case "out_of_stock":
        return <Package className="h-4 w-4" />;
      case "user_activity":
        return <Users className="h-4 w-4" />;
      case "system":
        return <Settings className="h-4 w-4" />;
      case "maintenance":
        return <Clock className="h-4 w-4" />;
      case "security":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const unreadCount = alerts.filter((alert) => !alert.isRead).length;
  const unresolvedCount = alerts.filter((alert) => !alert.isResolved).length;
  const criticalCount = alerts.filter(
    (alert) => alert.severity === "critical" && !alert.isResolved
  ).length;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold md:text-2xl">
            Alert Management
          </h1>
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {criticalCount} critical
              </Badge>
            )}
            {unreadCount > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Bell className="h-3 w-3" />
                {unreadCount} unread
              </Badge>
            )}
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Alert
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {criticalCount}
            </div>
            <p className="text-sm text-muted-foreground">Critical Alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {unresolvedCount}
            </div>
            <p className="text-sm text-muted-foreground">Unresolved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-sm text-muted-foreground">Unread</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-sm text-muted-foreground">Total Alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
          <CardDescription>Manage and filter system alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Alert Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                <SelectItem value="user_activity">User Activity</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={selectedSeverity}
              onValueChange={setSelectedSeverity}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="unresolved">Unresolved</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alerts ({filteredAlerts.length})</CardTitle>
          <CardDescription>System alerts and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentAlerts.map((alert) => (
                <TableRow
                  key={alert.id}
                  className={!alert.isRead ? "bg-muted/50" : ""}
                >
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getTypeIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className={`font-medium ${
                              !alert.isRead ? "font-semibold" : ""
                            }`}
                          >
                            {alert.title}
                          </h4>
                          {!alert.isRead && (
                            <Badge variant="default" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {alert.message}
                        </p>
                        {(alert.productName || alert.userName) && (
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {alert.productName && (
                              <span>Product: {alert.productName}</span>
                            )}
                            {alert.userName && (
                              <span>User: {alert.userName}</span>
                            )}
                            {alert.currentStock !== undefined && (
                              <span>Stock: {alert.currentStock}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {alert.type.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getSeverityColor(alert.severity) as any}
                      className="capitalize"
                    >
                      {alert.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant={alert.isResolved ? "default" : "secondary"}
                        className="w-fit"
                      >
                        {alert.isResolved ? "Resolved" : "Open"}
                      </Badge>
                      {!alert.isRead && (
                        <Badge variant="outline" className="w-fit text-xs">
                          Unread
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(alert.createdAt).toLocaleDateString()}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {alert.productId && (
                        <Link href={`/admin/products/${alert.productId}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      )}
                      {!alert.isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRead(alert.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {!alert.isResolved && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => resolveAlert(alert.id)}
                        >
                          Resolve
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissAlert(alert.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
