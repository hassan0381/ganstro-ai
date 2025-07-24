"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { UserLayout } from "@/components/user-layout"
import { FloatingChat } from "@/components/floating-chat"
import { CreditCard, Calendar, TrendingUp, MessageCircle } from "lucide-react"

export default function UserDashboard() {
  const router = useRouter()

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: api.getCurrentUser,
  })

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "user")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <UserLayout title="Dashboard" description="Welcome to your AI assistant dashboard">
      <div className="space-y-4 lg:space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 lg:p-6 rounded-lg border border-primary/20">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900 mb-2">Welcome back, {user.name || user.email}!</h2>
          <p className="text-sm lg:text-base text-gray-600">
            Manage your AI assistant subscription and explore powerful voice features.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">Current Plan</p>
                  <p className="text-lg lg:text-2xl font-bold text-primary">{user.subscription?.plan || "No Plan"}</p>
                </div>
                <div className="bg-primary/10 p-2 lg:p-3 rounded-full">
                  <CreditCard className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                </div>
              </div>
              <div className="mt-3 lg:mt-4">
                <Badge
                  className={`text-xs ${
                    user.subscription?.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.subscription?.status || "inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">Member Since</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="bg-blue-100 p-2 lg:p-3 rounded-full">
                  <Calendar className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">Voice Messages</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">24</p>
                </div>
                <div className="bg-purple-100 p-2 lg:p-3 rounded-full">
                  <MessageCircle className="h-5 w-5 lg:h-6 lg:w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">This month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl">Quick Actions</CardTitle>
            <CardDescription className="text-sm lg:text-base">Common tasks and features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <div
                className="p-3 lg:p-4 border border-gray-200 rounded-lg hover:border-primary/50 cursor-pointer transition-colors"
                onClick={() => router.push("/dashboard/subscription")}
              >
                <CreditCard className="h-6 w-6 lg:h-8 lg:w-8 text-primary mb-2" />
                <h3 className="font-semibold text-sm lg:text-base">Manage Subscription</h3>
                <p className="text-xs lg:text-sm text-gray-600">View and update your plan</p>
              </div>

              <div
                className="p-3 lg:p-4 border border-gray-200 rounded-lg hover:border-primary/50 cursor-pointer transition-colors"
                onClick={() => router.push("/dashboard/invoices")}
              >
                <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-sm lg:text-base">View Invoices</h3>
                <p className="text-xs lg:text-sm text-gray-600">Check billing history</p>
              </div>

              <div
                className="p-3 lg:p-4 border border-gray-200 rounded-lg hover:border-primary/50 cursor-pointer transition-colors"
                onClick={() => router.push("/dashboard/profile")}
              >
                <Calendar className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-sm lg:text-base">Edit Profile</h3>
                <p className="text-xs lg:text-sm text-gray-600">Update your information</p>
              </div>

              <div className="p-3 lg:p-4 border border-gray-200 rounded-lg hover:border-primary/50 cursor-pointer transition-colors">
                <MessageCircle className="h-6 w-6 lg:h-8 lg:w-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-sm lg:text-base">AI Chat</h3>
                <p className="text-xs lg:text-sm text-gray-600">Use floating chat button</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <FloatingChat />
    </UserLayout>
  )
}
