"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { UserLayout } from "@/components/user-layout"
import { FloatingChat } from "@/components/floating-chat"
import { CreditCard, Calendar, CheckCircle, AlertCircle } from "lucide-react"

export default function SubscriptionPage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: api.getCurrentUser,
  })

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <UserLayout title="Subscription" description="Manage your subscription plan and billing">
      <div className="space-y-6">
        {/* Current Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Current Subscription</span>
            </CardTitle>
            <CardDescription>Your active subscription details</CardDescription>
          </CardHeader>
          <CardContent>
            {user?.subscription ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-primary">{user.subscription.plan} Plan</h3>
                    <p className="text-gray-600">Premium AI voice assistant features</p>
                  </div>
                  <Badge
                    className={`${
                      user.subscription.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.subscription.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="font-medium">{new Date(user.subscription.startDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Next Billing</p>
                      <p className="font-medium">{new Date(user.subscription.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button variant="outline">Change Plan</Button>
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent">
                    Cancel Subscription
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h3>
                <p className="text-gray-600 mb-4">Subscribe to unlock premium AI features</p>
                <Button className="bg-primary hover:bg-primary/90">Choose a Plan</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plan Features */}
        {user?.subscription && (
          <Card>
            <CardHeader>
              <CardTitle>Plan Features</CardTitle>
              <CardDescription>What's included in your {user.subscription.plan} plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Unlimited voice messages",
                  "HD voice quality",
                  "Priority support",
                  "Mobile & desktop apps",
                  "10 GB storage",
                  "Voice transcription",
                  "Custom voice filters",
                  "Advanced AI features",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Usage Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Statistics</CardTitle>
            <CardDescription>Your monthly usage overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">24</div>
                <p className="text-sm text-gray-600">Voice Messages</p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">2.4 GB</div>
                <p className="text-sm text-gray-600">Storage Used</p>
                <p className="text-xs text-gray-500">of 10 GB</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">18</div>
                <p className="text-sm text-gray-600">AI Interactions</p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <FloatingChat />
    </UserLayout>
  )
}
