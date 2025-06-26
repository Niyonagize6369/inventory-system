"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/providers/auth-provider"
import { BarChart3, Box, Home, LogOut, Menu, Package, Settings, Users, AlertTriangle, Plus, Minus } from "lucide-react"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const userNavItems = [
    {
      title: "Dashboard",
      href: "/user/dashboard",
      icon: Home,
    },
    {
      title: "Products",
      href: "/user/products",
      icon: Package,
    },
    {
      title: "Stock Out",
      href: "/user/stock-out",
      icon: Minus,
    },
    {
      title: "Alerts",
      href: "/user/alerts",
      icon: AlertTriangle,
    },
    {
      title: "Profile",
      href: "/user/profile",
      icon: Settings,
    },
  ]

  const adminNavItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: Home,
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      title: "Categories",
      href: "/admin/categories",
      icon: Box,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Stock In",
      href: "/admin/stock-in",
      icon: Plus,
    },
    {
      title: "Stock Out",
      href: "/admin/stock-out",
      icon: Minus,
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: BarChart3,
    },
    {
      title: "Profile",
      href: "/admin/profile",
      icon: Settings,
    },
  ]

  const navItems = user?.role === "admin" ? adminNavItems : userNavItems

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6" />
          <span>Inventory MS</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === item.href && "bg-muted text-primary",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-4">
        <Button variant="outline" className="w-full justify-start" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <div className={cn("hidden border-r bg-muted/40 md:block", className)}>
      <SidebarContent />
    </div>
  )
}

// Mobile Sidebar Component
export function MobileSidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const userNavItems = [
    {
      title: "Dashboard",
      href: "/user/dashboard",
      icon: Home,
    },
    {
      title: "Products",
      href: "/user/products",
      icon: Package,
    },
    {
      title: "Stock Out",
      href: "/user/stock-out",
      icon: Minus,
    },
    {
      title: "Alerts",
      href: "/user/alerts",
      icon: AlertTriangle,
    },
    {
      title: "Profile",
      href: "/user/profile",
      icon: Settings,
    },
  ]

  const adminNavItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: Home,
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      title: "Categories",
      href: "/admin/categories",
      icon: Box,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Stock In",
      href: "/admin/stock-in",
      icon: Plus,
    },
    {
      title: "Stock Out",
      href: "/admin/stock-out",
      icon: Minus,
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: BarChart3,
    },
    {
      title: "Profile",
      href: "/admin/profile",
      icon: Settings,
    },
  ]

  const navItems = user?.role === "admin" ? adminNavItems : userNavItems

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package className="h-6 w-6" />
              <span>Inventory MS</span>
            </Link>
          </div>
          <ScrollArea className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    pathname === item.href && "bg-muted text-primary",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </ScrollArea>
          <div className="mt-auto p-4">
            <Button variant="outline" className="w-full justify-start" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
