"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, User, Lock } from "lucide-react";

export default function UserProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  
  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        username: user.username || "",
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
    
      const result = await updateProfile(profileData);
      if (result.success) {
        toast({ title: "Profile Updated", description: result.message });
      } else {
        toast({ title: "Update Failed", description: result.message, variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: "Error", description: "New passwords do not match", variant: "destructive" });
      return;
    }
    setPasswordLoading(true);
    try {
      const result = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmPassword
      );
      if (result.success) {
        toast({ title: "Password Changed", description: result.message });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast({ title: "Change Failed", description: result.message, variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center mb-6"><h1 className="text-2xl font-bold">Profile Settings</h1></div>
      <div className="grid gap-8">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><User /> Personal Information</CardTitle><CardDescription>Update your personal details</CardDescription></CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
              
                <div><Label htmlFor="first_name">First Name</Label><Input id="first_name" name="first_name" value={profileData.first_name} onChange={(e) => setProfileData(p => ({ ...p, first_name: e.target.value }))} /></div>
                <div><Label htmlFor="last_name">Last Name</Label><Input id="last_name" name="last_name" value={profileData.last_name} onChange={(e) => setProfileData(p => ({ ...p, last_name: e.target.value }))} /></div>
              </div>
              <div><Label htmlFor="username">Username</Label><Input id="username" name="username" value={profileData.username} onChange={(e) => setProfileData(p => ({ ...p, username: e.target.value }))} /></div>
              <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={profileData.email} onChange={(e) => setProfileData(p => ({ ...p, email: e.target.value }))} /></div>
              <Button type="submit" disabled={profileLoading}>{profileLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update Profile</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Lock /> Change Password</CardTitle><CardDescription>Update your account password</CardDescription></CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input id="currentPassword" type={showPasswords.current ? "text" : "password"} value={passwordData.currentPassword} onChange={(e) => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))} required />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))}>{showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input id="newPassword" type={showPasswords.new ? "text" : "password"} value={passwordData.newPassword} onChange={(e) => setPasswordData(p => ({ ...p, newPassword: e.target.value }))} required />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}>{showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type={showPasswords.confirm ? "text" : "password"} value={passwordData.confirmPassword} onChange={(e) => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))} required />
              </div>
              <Button type="submit" disabled={passwordLoading}>{passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Change Password</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}