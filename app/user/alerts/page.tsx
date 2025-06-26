"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Package, Search, Bell, CheckCircle, Clock, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Alert {
  id: string
  type: "low_stock" | "out_of_stock" | "system" | "maintenance"
  title: string
  message: string
  productId?: string
  productName?: string
  currentStock?: number
  minStock?: number
  severity: "low" | "medium" | "high" | "critical"
  isRead: boolean
  createdAt: string
}

export default function UserAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockAlerts: Alert[] = [
      {
        id: "1",
        type: "low_stock",
        title: "Low Stock Alert",
        message: "Laptop Dell XPS 13 is running low on stock",
        productId: "1",
        productName: "Laptop Dell XPS 13",
        currentStock: 5,
        minStock: 10,
        severity: "medium",
        isRead: false,
        createdAt: "2024-01-20T10:30:00Z",
      },
      {
        id: "2",
        type: "out_of_stock",
        title: "Out of Stock Alert",
        message: "Notebook A4 is completely out of stock",
        productId: "4",
        productName: "Notebook A4",
        currentStock: 0,
        minStock: 20,
        severity: "critical",
        isRead: false,
        createdAt: "2024-01-20T09:15:00Z",
      },
      {
        id: "3",
        type: "low_stock",
        title: "Low Stock Alert",
        message: "Office Chair stock is below minimum threshold",
        productId: "2",
        productName: "Office Chair",
        currentStock: 3,
        minStock: 10,
        severity: "high",
        isRead: true,
        createdAt: "2024-01-19T16:45:00Z",
      },
      {
        id: "4",
        type: "system",
        title: "System Notification",
        message: "Your inventory report for January is ready for review",
        severity: "low",
        isRead: false,
        createdAt: "2024-01-19T14:20:00Z",
      },
      {
        id: "5",
        type: "low_stock",
        title: "Low Stock Alert",
        message: "Wireless Mouse inventory is getting low",
        productId: "3",
        productName: "Wireless Mouse",
        currentStock: 8,
        minStock: 15,
        severity: "medium",
        isRead: true,
        createdAt: "2024-01-18T11:30:00Z",
      },
    ]

    setAlerts(mockAlerts)
    setFilteredAlerts(mockAlerts)
  }, [])

  useEffect(() => {
    let filtered = alerts

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (alert) =>
          alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (alert.productName && alert.productName.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((alert) => alert.type === selectedType)
    }

    // Filter by severity
    if (selectedSeverity !== "all") {
      filtered = filtered.filter((alert) => alert.severity === selectedSeverity)
    }

    // Filter by read status
    if (showUnreadOnly) {
      filtered = filtered.filter((alert) => !alert.isRead)
    }

    setFilteredAlerts(filtered)
  }, [searchTerm, selectedType, selectedSeverity, showUnreadOnly, alerts])

  const markAsRead = async (alertId: string) => {
    try {
      setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, isRead: true } : alert)))

      toast({
        title: "Alert marked as read",
        description: "The alert has been marked as read",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark alert as read",
        variant: "destructive",
      })
    }
  }

  const markAllAsRead = async () => {
    try {
      setAlerts((prev) => prev.map((alert) => ({ ...alert, isRead: true })))

      toast({
        title: "All alerts marked as read",
        description: "All alerts have been marked as read",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark all alerts as read",
        variant: "destructive",
      })
    }
  }

  const dismissAlert = async (alertId: string) => {
    try {
      setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))

      toast({
        title: "Alert dismissed",
        description: "The alert has been dismissed",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to dismiss alert",
        variant: "destructive",
      })
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "low_stock":
      case "out_of_stock":
        return <Package className="h-4 w-4" />
      case "system":
        return <Bell className="h-4 w-4" />
      case "maintenance":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const unreadCount = alerts.filter((alert) => !alert.isRead).length

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold md:text-2xl">Alerts & Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Bell className="h-3 w-3" />
              {unreadCount} unread
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Alerts</CardTitle>
          <CardDescription>Search and filter alerts by type, severity, or status</CardDescription>
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
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
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
            <Button
              variant={showUnreadOnly ? "default" : "outline"}
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              className="w-full md:w-auto"
            >
              {showUnreadOnly ? "Show All" : "Unread Only"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No alerts found</h3>
              <p className="text-muted-foreground text-center">
                {showUnreadOnly
                  ? "You have no unread alerts"
                  : searchTerm || selectedType !== "all" || selectedSeverity !== "all"
                    ? "Try adjusting your search criteria"
                    : "You're all caught up! No alerts at the moment."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card key={alert.id} className={`${!alert.isRead ? "border-l-4 border-l-primary" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 mt-1">{getTypeIcon(alert.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium ${!alert.isRead ? "font-semibold" : ""}`}>{alert.title}</h4>
                        <Badge variant={getSeverityColor(alert.severity) as any} className="text-xs">
                          {alert.severity}
                        </Badge>
                        {!alert.isRead && (
                          <Badge variant="default" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                      {alert.productName && (
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                          <span>Product: {alert.productName}</span>
                          {alert.currentStock !== undefined && <span>Current Stock: {alert.currentStock}</span>}
                          {alert.minStock !== undefined && <span>Min Stock: {alert.minStock}</span>}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">{new Date(alert.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {alert.productId && (
                      <Link href={`/user/products/${alert.productId}`}>
                        <Button variant="outline" size="sm">
                          View Product
                        </Button>
                      </Link>
                    )}
                    {!alert.isRead && (
                      <Button variant="outline" size="sm" onClick={() => markAsRead(alert.id)}>
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => dismissAlert(alert.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {alerts.filter((a) => a.severity === "critical").length}
            </div>
            <p className="text-sm text-muted-foreground">Critical Alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {alerts.filter((a) => a.severity === "high").length}
            </div>
            <p className="text-sm text-muted-foreground">High Priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {alerts.filter((a) => a.severity === "medium").length}
            </div>
            <p className="text-sm text-muted-foreground">Medium Priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-sm text-muted-foreground">Unread Alerts</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
