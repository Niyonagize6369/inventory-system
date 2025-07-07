"use client";

import type React from "react";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";


interface FormData {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}


export default function CompleteRegistrationPage() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/auth/complete-registration/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      
        body: JSON.stringify({
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      if (!response.ok) {
        let errorMessage = "An unknown error occurred.";
        try {
          const errorResult = await response.json();
          
          errorMessage = errorResult.message || JSON.stringify(errorResult.issues || errorResult);
        } catch (jsonError) {
          
          errorMessage = await response.text();
        }
        if (errorMessage.startsWith("<!DOCTYPE html>")) {
            errorMessage = "Internal Server Error. Please check the backend logs."
        }
        throw new Error(errorMessage);
      }

      toast({
        title: "Registration Complete!",
        description: "You can now log in.",
      });

      router.push("/auth/login");

    } catch (error: any) {
      console.error("Failed to complete registration:", error);
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Complete Your Registration</CardTitle>
        <CardDescription>
          Welcome! Please set up your account details to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" value={formData.username} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} required />
              <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange} required />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-gray-700 hover:bg-gray-800">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Complete Registration
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}