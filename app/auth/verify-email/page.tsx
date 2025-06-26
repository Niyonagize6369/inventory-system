"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, XCircle, Mail } from "lucide-react"

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [token, setToken] = useState("")

  const { verifyEmail } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    if (tokenParam) {
      setToken(tokenParam)
      handleVerification(tokenParam)
    } else {
      setIsError(true)
      setIsLoading(false)
      toast({
        title: "Invalid verification link",
        description: "The email verification link is invalid or has expired",
        variant: "destructive",
      })
    }
  }, [searchParams])

  const handleVerification = async (verificationToken: string) => {
    try {
      const success = await verifyEmail(verificationToken)
      if (success) {
        setIsSuccess(true)
        toast({
          title: "Email verified successfully",
          description: "Your email has been verified. You can now access all features.",
        })
      } else {
        setIsError(true)
        toast({
          title: "Verification failed",
          description: "Failed to verify email. The link may be expired or invalid.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setIsError(true)
      toast({
        title: "Error",
        description: "Something went wrong during verification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resendVerification = async () => {
    setIsLoading(true)
    try {
      // Mock resend verification - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Verification email sent",
        description: "A new verification email has been sent to your email address",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend verification email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <CardTitle className="text-2xl text-center">Verifying your email</CardTitle>
            <CardDescription className="text-center">Please wait while we verify your email address...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Email verified!</CardTitle>
            <CardDescription className="text-center">
              Your email has been successfully verified. You can now access all features of your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/auth/login">
              <Button className="w-full">Continue to login</Button>
            </Link>
            <div className="text-center text-sm text-muted-foreground">
              Already signed in?{" "}
              <Link href="/" className="text-primary hover:underline">
                Go to dashboard
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Verification failed</CardTitle>
            <CardDescription className="text-center">
              We couldn't verify your email address. The link may be expired or invalid.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={resendVerification} className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Mail className="mr-2 h-4 w-4" />
              Resend verification email
            </Button>
            <div className="text-center">
              <Link href="/auth/login" className="text-primary hover:underline text-sm">
                Back to login
              </Link>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Demo:</strong> This is a demonstration. In a real application, this would verify the actual
                email token.
                <br />
                Token: <code className="bg-blue-200 px-1 rounded">{token || "no-token"}</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
