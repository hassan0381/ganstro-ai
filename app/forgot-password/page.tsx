"use client";

import { useState } from "react";
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
import { resetPassword } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Bot, Sparkles, ArrowLeft, Mail } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);

    try {
      const success = resetPassword(data.email);
      if (success) {
        setIsEmailSent(true);
        toast({
          title: "Reset email sent",
          description: "Check your email for password reset instructions",
        });
      } else {
        toast({
          title: "Email not found",
          description: "No account found with this email address",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while sending reset email",
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
            Reset your password
          </p>
        </div>

        <Card className="border-2" style={{ borderColor: "#009A44" }}>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl lg:text-2xl font-bold text-gray-900">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">
              {isEmailSent
                ? "Check your email for reset instructions"
                : "Enter your email to receive reset instructions"}{" "}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEmailSent ? (
              <div className="text-center space-y-6">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Email Sent!
                  </h3>
                  <p className="text-gray-600">
                    We've sent password reset instructions to{" "}
                    <span className="font-semibold">{getValues("email")}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Didn't receive the email? Check your spam folder or try
                    again.
                  </p>
                </div>
                <Button
                  onClick={() => setIsEmailSent(false)}
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Try Different Email
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                    <p className="text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full h-10 lg:h-12 bg-primary hover:bg-primary/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Instructions"}
                </Button>
              </form>
            )}

            <div className="text-center space-y-4">
              <div className="text-sm text-gray-600">
                Remember your password?{" "}
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
