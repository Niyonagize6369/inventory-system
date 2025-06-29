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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Shield,
  Plus,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "disabled";
  image?: string;
  createdAt: string;
  lastLogin?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [loadingActions, setLoadingActions] = useState<{
    [key: string]: boolean;
  }>({});
  const usersPerPage = 10;
  const { toast } = useToast();

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
    ];

    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  useEffect(() => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (selectedRole !== "all") {
      filtered = filtered.filter((user) => user.role === selectedRole);
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((user) => user.status === selectedStatus);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedRole, selectedStatus, users]);

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleDeleteUser = async (userId: string) => {
    try {
      setLoadingActions((prev) => ({ ...prev, [`delete-${userId}`]: true }));

      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setDeleteUser(null);

      toast({
        title: "User Removed",
        description: "The user has been permanently deleted from the system.",
      });
    } catch (error) {
      toast({
        title: "Something Went Wrong",
        description: "We couldn't delete the user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingActions((prev) => ({ ...prev, [`delete-${userId}`]: false }));
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      setLoadingActions((prev) => ({ ...prev, [`status-${userId}`]: true }));

      const newStatus = currentStatus === "active" ? "disabled" : "active";

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, status: newStatus as "active" | "disabled" }
            : user
        )
      );

      toast({
        title: "Status Updated",
        description: `User has been ${
          newStatus === "active" ? "enabled" : "disabled"
        } successfully.`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "We couldn't update the user status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingActions((prev) => ({ ...prev, [`status-${userId}`]: false }));
    }
  };

  const changeUserRole = async (userId: string, currentRole: string) => {
    try {
      setLoadingActions((prev) => ({ ...prev, [`role-${userId}`]: true }));

      const newRole = currentRole === "user" ? "admin" : "user";

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, role: newRole as "user" | "admin" }
            : user
        )
      );

      toast({
        title: "Role Changed",
        description: `User role has been updated to ${newRole} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Role Update Failed",
        description: "We couldn't change the user role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingActions((prev) => ({ ...prev, [`role-${userId}`]: false }));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              User Management
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/users/create">
              <Button className="bg-gray-900 hover:bg-gray-800">
                <Plus className="mr-2 h-4 w-4" />
                Add New User
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="text-slate-900">
              Search & Filter Users
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search users "
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-slate-300 focus:border-slate-500"
                  />
                </div>
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full md:w-[180px] border-slate-300">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-[180px] border-slate-300">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active Users</SelectItem>
                  <SelectItem value="disabled">Disabled Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="text-slate-900">Users</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200">
                  <TableHead className="text-gray-700 font-bold">
                    User
                  </TableHead>
                  <TableHead className="text-gray-700 font-bold">
                    Email
                  </TableHead>
                  <TableHead className="text-gray-700 font-bold">
                    Role
                  </TableHead>
                  <TableHead className="text-gray-700 font-bold">
                    Status
                  </TableHead>
                  <TableHead className="text-gray-700 font-bold">
                    Created
                  </TableHead>
                  <TableHead className="text-gray-700 font-bold">
                    Last Login
                  </TableHead>
                  <TableHead className="text-gray-700 font-bold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-slate-200 hover:bg-slate-50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-semibold text-slate-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-slate-600">
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                        className={`flex items-center gap-1 w-fit ${
                          user.role === "admin"
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {user.role === "admin" && (
                          <Shield className="h-3 w-3" />
                        )}
                        {user.role === "admin" ? "Administrator" : "User"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "active" ? "default" : "destructive"
                        }
                        className={
                          user.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {user.status === "active" ? "Active" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString()
                        : "Never"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/users/${user.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteUser(user)}
                          className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 p-4 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="border-slate-300 text-slate-700"
                >
                  Previous
                </Button>
                <span className="text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="border-slate-300 text-slate-700"
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <AlertDialogContent className="border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900">
              Are you absolutely sure? to Delete
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-300 text-slate-700 hover:bg-slate-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUser && handleDeleteUser(deleteUser.id)}
              disabled={loadingActions[`delete-${deleteUser?.id}`]}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {loadingActions[`delete-${deleteUser?.id}`] && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
