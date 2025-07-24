"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { mockVoiceNotes } from "@/lib/voice-notes-data";
import { mockUsers } from "@/lib/users-data";
import { AdminLayout } from "@/components/admin-layout";
import { Play, Users, Settings, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") {
      router.push("/login");
    }
  }, [router]);

  const stats = {
    totalNotes: mockVoiceNotes.length,
    totalUsers: mockUsers.filter((u) => u.role === "user").length,
    activeUsers: mockUsers.filter((u) => u.isActive && u.role === "user")
      .length,
    processedNotes: mockVoiceNotes.filter((n) => n.status === "processed")
      .length,
  };

  return (
    <AdminLayout
      title="Admin Dashboard"
      description="Overview of your GanStró AI Assistant platform"
    >
      <div className="space-y-4 lg:space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">
                    Total Voice Notes
                  </p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {stats.totalNotes}
                  </p>
                </div>
                <div className="bg-blue-100 p-2 lg:p-3 rounded-full">
                  <Play className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {stats.totalUsers}
                  </p>
                </div>
                <div className="bg-green-100 p-2 lg:p-3 rounded-full">
                  <Users className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">
                    Active Users
                  </p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {stats.activeUsers}
                  </p>
                </div>
                <div className="bg-purple-100 p-2 lg:p-3 rounded-full">
                  <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">
                    Processed Notes
                  </p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {stats.processedNotes}
                  </p>
                </div>
                <div className="bg-orange-100 p-2 lg:p-3 rounded-full">
                  <Settings className="h-5 w-5 lg:h-6 lg:w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">
                Recent Voice Notes
              </CardTitle>
              <CardDescription className="text-sm lg:text-base">
                Latest voice messages from users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 lg:space-y-4">
                {mockVoiceNotes.slice(0, 5).map((note) => (
                  <div
                    key={note.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2 sm:space-y-0"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {note.userEmail}
                      </p>
                      <p className="text-xs text-gray-500">
                        {note.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <p className="text-sm font-medium">
                        {Math.floor(note.duration / 60)}:
                        {(note.duration % 60).toString().padStart(2, "0")}
                      </p>
                      <p
                        className={`text-xs ${
                          note.status === "processed"
                            ? "text-green-600"
                            : note.status === "pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {note.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Recent Users</CardTitle>
              <CardDescription className="text-sm lg:text-base">
                Newly registered users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 lg:space-y-4">
                {mockUsers
                  .filter((u) => u.role === "user")
                  .slice(0, 5)
                  .map((user) => (
                    <div
                      key={user.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2 sm:space-y-0"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0">
                        <p className="text-sm font-medium">
                          {user.subscription?.plan || "No Plan"}
                        </p>
                        <p
                          className={`text-xs ${
                            user.isActive ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
