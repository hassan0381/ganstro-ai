"use client";

import type React from "react";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/lib/api";
import { UserLayout } from "@/components/user-layout";
import { FloatingChat } from "@/components/floating-chat";
import {
  Upload,
  FileImage,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

interface LetterheadSettings {
  id?: string;
  fileName: string;
  fileUrl: string;
  uploadDate: Date;
}

interface VATSettings {
  selectedVAT: number[];
}

export default function SettingsPage() {
  const [letterheads, setLetterheads] = useState<LetterheadSettings[]>([]);
  const [selectedVAT, setSelectedVAT] = useState<number[]>([10]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: api.getCurrentUser,
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordForm) => {
      // Mock password change API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Password changed", {
        description: "Your password has been successfully updated.",
      });
      resetPasswordForm();
      setIsChangingPassword(false);
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to change password. Please try again.",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type", {
          description: "Please upload an image file (PNG, JPG, etc.)",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Please upload an image smaller than 5MB",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const fileUrl = e.target?.result as string;
        const newLetterhead: LetterheadSettings = {
          id: Date.now().toString(),
          fileName: file.name,
          fileUrl,
          uploadDate: new Date(),
        };
        setLetterheads((prev) => [...prev, newLetterhead]);
        setPreviewImage(fileUrl);
        toast.success("Letterhead uploaded", {
          description: `${file.name} has been uploaded successfully.`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteLetterhead = (id: string) => {
    setLetterheads((prev) => prev.filter((letterhead) => letterhead.id !== id));
    setPreviewImage(null);
    toast.error("Letterhead deleted", {
      description: "The letterhead has been removed.",
    });
  };

  const handlePreviewLetterhead = (fileUrl: string) => {
    setPreviewImage(fileUrl);
  };

  const handleVATChange = (vatRate: number, checked: boolean) => {
    if (checked) {
      setSelectedVAT((prev) => [...prev, vatRate]);
    } else {
      setSelectedVAT((prev) => prev.filter((rate) => rate !== vatRate));
    }
  };

  const handleSaveSettings = () => {
    const settings = {
      letterheads,
      selectedVAT,
    };

    // Mock save API call
    setTimeout(() => {
      toast.success("Settings saved", {
        description: "Your settings have been successfully updated.",
      });
      console.log("Saved settings:", settings);
    }, 500);
  };

  const onPasswordSubmit = (data: PasswordForm) => {
    changePasswordMutation.mutate(data);
  };

  return (
    <UserLayout
      title="Settings"
      description="Manage your account settings and preferences"
    >
      <div className="space-y-4 lg:space-y-6">
        {/* Letterhead Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
              <FileImage className="h-4 w-4 lg:h-5 lg:w-5" />
              <span>Letterhead Management</span>
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">
              Upload and manage your company letterheads
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 lg:space-y-6">
            {/* Upload Section */}
            <div className="space-y-3 lg:space-y-4">
              <Label className="text-sm font-medium">Upload Letterhead</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 lg:p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="letterhead-upload"
                />
                <label htmlFor="letterhead-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 lg:h-12 lg:w-12 mx-auto text-gray-400 mb-3 lg:mb-4" />
                  <p className="text-sm lg:text-base text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs lg:text-sm text-gray-500">
                    PNG, JPG up to 5MB
                  </p>
                </label>
              </div>
            </div>

            {/* Preview Section */}
            {previewImage && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Preview</Label>
                <div className="border border-gray-200 rounded-lg p-3 lg:p-4 bg-gray-50">
                  <img
                    src={previewImage || "/placeholder.svg"}
                    alt="Letterhead preview"
                    className="max-w-full h-auto max-h-48 lg:max-h-64 mx-auto rounded border"
                  />
                </div>
              </div>
            )}

            {/* Letterhead List */}
            {letterheads.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Uploaded Letterheads
                </Label>
                <div className="space-y-2">
                  {letterheads.map((letterhead) => (
                    <div
                      key={letterhead.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-gray-200 rounded-lg bg-white space-y-2 sm:space-y-0"
                    >
                      <div className="flex items-center space-x-3">
                        <FileImage className="h-4 w-4 lg:h-5 lg:w-5 text-primary flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">
                            {letterhead.fileName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Uploaded on{" "}
                            {letterhead.uploadDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handlePreviewLetterhead(letterhead.fileUrl)
                          }
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteLetterhead(letterhead.id!)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* VAT Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
              <Settings className="h-4 w-4 lg:h-5 lg:w-5" />
              <span>VAT Settings</span>
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">
              Select applicable VAT rates for your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 lg:space-y-4">
              <Label className="text-sm font-medium">Select VAT Rates</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                {[10, 15, 20].map((vatRate) => (
                  <div
                    key={vatRate}
                    className={`border-2 rounded-lg p-3 lg:p-4 cursor-pointer transition-colors ${
                      selectedVAT.includes(vatRate)
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() =>
                      handleVATChange(vatRate, !selectedVAT.includes(vatRate))
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedVAT.includes(vatRate)}
                        onCheckedChange={(checked) =>
                          handleVATChange(vatRate, checked as boolean)
                        }
                      />
                      <div>
                        <p className="font-semibold text-base lg:text-lg">
                          {vatRate}%
                        </p>
                        <p className="text-xs lg:text-sm text-gray-600">
                          VAT Rate
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs lg:text-sm text-gray-500">
                Selected VAT rates:{" "}
                {selectedVAT.length > 0
                  ? selectedVAT.join("%, ") + "%"
                  : "None"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl">
              Change Password
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">
              Update your account password
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isChangingPassword ? (
              <Button onClick={() => setIsChangingPassword(true)}>
                Change Password
              </Button>
            ) : (
              <form
                onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                className="space-y-3 lg:space-y-4"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="currentPassword"
                    className="text-sm font-medium"
                  >
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      className="border-2 border-gray-200 focus:border-primary pr-10"
                      {...registerPassword("currentPassword")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-red-600">
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="border-2 border-gray-200 focus:border-primary pr-10"
                      {...registerPassword("newPassword")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-600">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="border-2 border-gray-200 focus:border-primary pr-10"
                      {...registerPassword("confirmPassword")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-red-600">
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending
                      ? "Changing..."
                      : "Change Password"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto bg-transparent"
                    onClick={() => {
                      setIsChangingPassword(false);
                      resetPasswordForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Save Settings Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSaveSettings}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      <FloatingChat />
    </UserLayout>
  );
}
