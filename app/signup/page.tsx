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
import { registerUser, setCurrentUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Bot, Sparkles, ArrowLeft } from "lucide-react";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);

    try {
      const user = registerUser(data.email, data.password, data.name);
      if (user) {
        setCurrentUser(user);

        toast({
          title: "Account created successfully",
          description: `Welcome to GanStró AI, ${user.name}!`,
        });

        // Redirect to subscriptions page for new users
        setTimeout(() => {
          window.location.href = "/subscriptions";
        }, 100);
      } else {
        toast({
          title: "Registration failed",
          description: "An account with this email already exists",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
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
            Join the future of AI voice technology
          </p>
        </div>

        <Card className="border-2" style={{ borderColor: "#009A44" }}>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl lg:text-2xl font-bold text-gray-900">
              Create Account
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">
              Start your AI journey today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="h-10 lg:h-12 border-2 border-gray-200 focus:border-primary"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
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
                  placeholder="Create a password"
                  className="h-10 lg:h-12 border-2 border-gray-200 focus:border-primary"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold"
                >
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="h-10 lg:h-12 border-2 border-gray-200 focus:border-primary"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-10 lg:h-12 bg-primary hover:bg-primary/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center space-y-4">
              <div className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:underline font-semibold"
                >
                  Sign in
                </Link>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-gray-600 hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
