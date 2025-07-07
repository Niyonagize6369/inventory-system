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
import { Search, Edit, Trash2, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";


interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;  
  email: string;
  role: "user" | "admin";
  status: "active" | "disabled" | "pending"; 
  image_url?: string;
  created_at: string;
  last_login?: string;
}


const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};


export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const usersPerPage = 10;

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const headers = getAuthHeaders();
        const response = await fetch("http://localhost:5000/api/admin/users", { headers });
        if (!response.ok) throw new Error("Failed to fetch users.");
        
        const data = await response.json();
        setUsers(data.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);


const filteredUsers = useMemo(() => {
    return users.filter(user => {

      const searchableContent = [
        user.username,
        user.first_name,
        user.last_name,
        user.email
      ]
      .filter(Boolean) 
      .join(' ')      
      .toLowerCase();

  
      const roleMatch = selectedRole === "all" || user.role === selectedRole;
      const statusMatch = selectedStatus === "all" || user.status === selectedStatus;
      const searchTermMatch = searchTerm === "" || searchableContent.includes(searchTerm.toLowerCase());

      return roleMatch && statusMatch && searchTermMatch;
    });
}, [users, searchTerm, selectedRole, selectedStatus]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  
  const handleUpdateUser = async (userId: string, updateData: { role?: User['role']; status?: User['status'] }) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Failed to update user.");
      
      const updatedUser = await response.json();
      setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
      toast({ title: "Success", description: "User has been updated." });
    } catch (error) {
      toast({ title: "Error", description: "Could not update user.", variant: "destructive" });
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok && response.status !== 204) throw new Error("Failed to delete user.");
      
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast({ title: "Success", description: "User has been deleted." });
    } catch (error) {
      toast({ title: "Error", description: "Could not delete user.", variant: "destructive" });
    } finally {
      setUserToDelete(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Management</h1>
          <Button asChild className="bg-gray-900 hover:bg-gray-800"><Link href="/admin/users/create"><Plus className="mr-2 h-4 w-4" /> Add New User</Link></Button>
        </div>

        <Card>
          <CardHeader><CardTitle>Search & Filter Users</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Filter by role" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Roles</SelectItem><SelectItem value="admin">Admin</SelectItem><SelectItem value="user">User</SelectItem></SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="disabled">Disabled</SelectItem></SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {isLoading ? ( <div className="p-6 text-center">Loading users...</div> ) : 
             error ? ( <div className="p-6 text-center text-red-500">{error}</div> ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Created</TableHead><TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentUsers.length > 0 ? (
                      currentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="font-semibold">{user.first_name} {user.last_name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={user.role}
                              onValueChange={(newRole: User['role']) => handleUpdateUser(user.id, { role: newRole })}
                              disabled={user.id === currentUser?.id}
                            >
                              <SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="user">User</SelectItem><SelectItem value="admin">Admin</SelectItem></SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={user.status}
                              onValueChange={(newStatus: User['status']) => handleUpdateUser(user.id, { status: newStatus })}
                              disabled={user.id === currentUser?.id}
                            >
                              <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem><SelectItem value="disabled">Disabled</SelectItem><SelectItem value="pending">Pending</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button asChild variant="ghost" size="sm"><Link href={`/admin/users/${user.id}/edit`}><Edit className="h-4 w-4" /></Link></Button>
                            <Button variant="ghost" size="sm" onClick={() => setUserToDelete(user)} disabled={user.id === currentUser?.id}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow><TableCell colSpan={5} className="text-center">No users found.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
                {totalPages > 1 && (
                  <div className="flex items-center justify-end gap-2 p-4 border-t">
                    <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Previous</Button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => userToDelete && handleDeleteUser(userToDelete.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}