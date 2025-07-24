"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authenticateUser, setCurrentUser } from "@/lib/auth";
import { Bot, Sparkles } from "lucide-react";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);

    try {
      const user = authenticateUser(data.email, data.password);
      if (user) {
        setCurrentUser(user);

        toast.success("Login successful", {
          description: `Welcome back, ${user.name || user.email}!`,
        });

        // Force a small delay to ensure cookie is set
        setTimeout(() => {
          // Redirect based on role
          if (user.role === "admin") {
            window.location.href = "/admin";
          } else {
            // Check if user has subscription
            if (user.subscription?.status === "active") {
              window.location.href = "/dashboard";
            } else {
              window.location.href = "/subscriptions";
            }
          }
        }, 100);
      } else {
        toast.error("Login failed", {
          description: "Invalid email or password",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "An error occurred during login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 lg:space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-3 mb-4 lg:mb-6">
            <div className="bg-primary/10 p-2 lg:p-3 rounded-2xl">
              <Bot className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold text-primary mb-2">
            GanStró AI Assistant
          </h1>
          <p className="text-gray-600 text-base lg:text-lg">
            Advanced AI-powered voice platform
          </p>
        </div>

        <Card className="border-2" style={{ borderColor: "#009A44" }}>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl lg:text-2xl font-bold text-gray-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">
              Sign in to continue your AI journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 lg:space-y-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 lg:space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-10 lg:h-12 border-2 border-gray-200 focus:border-primary"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-10 lg:h-12 border-2 border-gray-200 focus:border-primary"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-10 lg:h-12 bg-primary hover:bg-primary/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center space-y-4">
              <Link
                href="/forgot-password"
                className="text-primary hover:underline text-sm"
              >
                Forgot your password?
              </Link>
              <div className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-primary hover:underline font-semibold"
                >
                  Sign up
                </Link>
              </div>
            </div>

            <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm font-semibold mb-3 text-gray-700">
                Demo Credentials:
              </p>
              <div className="text-xs space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 bg-white rounded-lg space-y-1 sm:space-y-0">
                  <span>
                    <strong>User:</strong> user@example.com
                  </span>
                  <Badge
                    variant="secondary"
                    className="self-start sm:self-center"
                  >
                    password
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 bg-white rounded-lg space-y-1 sm:space-y-0">
                  <span>
                    <strong>Admin:</strong> admin@example.com
                  </span>
                  <Badge
                    variant="secondary"
                    className="self-start sm:self-center"
                  >
                    password
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
