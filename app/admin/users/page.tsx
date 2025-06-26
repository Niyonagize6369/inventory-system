"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MoreHorizontal, Edit, Trash2, Eye, UserCheck, UserX, Shield, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface User {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  role: "user" | "admin"
  status: "active" | "disabled"
  image?: string
  createdAt: string
  lastLogin?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const usersPerPage = 10
  const { toast } = useToast()

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockUsers: User[] = [
      {
        id: "1",
        username: "admin",
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        role: "admin",
        status: "active",
        image: "/placeholder.svg?height=40&width=40",
        createdAt: "2024-01-01",
        lastLogin: "2024-01-20",
      },
      {
        id: "2",
        username: "johndoe",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: "user",
        status: "active",
        image: "/placeholder.svg?height=40&width=40",
        createdAt: "2024-01-05",
        lastLogin: "2024-01-19",
      },
      {
        id: "3",
        username: "janedoe",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        role: "user",
        status: "active",
        createdAt: "2024-01-10",
        lastLogin: "2024-01-18",
      },
      {
        id: "4",
        username: "bobsmith",
        firstName: "Bob",
        lastName: "Smith",
        email: "bob@example.com",
        role: "user",
        status: "disabled",
        createdAt: "2024-01-15",
        lastLogin: "2024-01-16",
      },
      {
        id: "5",
        username: "alicejohnson",
        firstName: "Alice",
        lastName: "Johnson",
        email: "alice@example.com",
        role: "user",
        status: "active",
        createdAt: "2024-01-12",
        lastLogin: "2024-01-20",
      },
    ]

    setUsers(mockUsers)
    setFilteredUsers(mockUsers)
  }, [])

  useEffect(() => {
    let filtered = users

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by role
    if (selectedRole !== "all") {
      filtered = filtered.filter((user) => user.role === selectedRole)
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((user) => user.status === selectedStatus)
    }

    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedRole, selectedStatus, users])

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const handleDeleteUser = async (userId: string) => {
    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 500))

      setUsers((prev) => prev.filter((user) => user.id !== userId))
      setDeleteUser(null)

      toast({
        title: "User deleted",
        description: "The user has been successfully deleted",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "disabled" : "active"

      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, status: newStatus as "active" | "disabled" } : user)),
      )

      toast({
        title: "User status updated",
        description: `User has been ${newStatus === "active" ? "enabled" : "disabled"}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const changeUserRole = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === "user" ? "admin" : "user"

      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, role: newRole as "user" | "admin" } : user)),
      )

      toast({
        title: "User role updated",
        description: `User role has been changed to ${newRole}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">User Management</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Total: {users.length}</Badge>
            <Badge variant="default">Active: {users.filter((u) => u.status === "active").length}</Badge>
            <Badge variant="secondary">Disabled: {users.filter((u) => u.status === "disabled").length}</Badge>
          </div>
          <Link href="/admin/users/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create User
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find and filter users by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || "/placeholder.svg"} alt={user.username} />
                        <AvatarFallback>
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">@{user.username}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      className="flex items-center gap-1 w-fit"
                    >
                      {user.role === "admin" && <Shield className="h-3 w-3" />}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "destructive"}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/users/${user.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toggleUserStatus(user.id, user.status)}>
                          {user.status === "active" ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              Disable User
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Enable User
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeUserRole(user.id, user.role)}>
                          <Shield className="mr-2 h-4 w-4" />
                          {user.role === "user" ? "Make Admin" : "Make User"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => setDeleteUser(user)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account for "{deleteUser?.firstName}{" "}
              {deleteUser?.lastName}" and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUser && handleDeleteUser(deleteUser.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
