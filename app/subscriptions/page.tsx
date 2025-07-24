"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser, setCurrentUser } from "@/lib/auth";
import {
  subscriptionPackages,
  type SubscriptionPackage,
} from "@/lib/subscription-data";
import { Check, Bot, LogOut, Zap, Shield } from "lucide-react";

export default function SubscriptionsPage() {
  const [selectedPackage, setSelectedPackage] =
    useState<SubscriptionPackage | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "user") {
      router.push("/login");
    }
  }, [router]);

  const handleSelectPackage = (pkg: SubscriptionPackage) => {
    const packageWithBilling = {
      ...pkg,
      selectedBilling: billingCycle,
      selectedPrice:
        billingCycle === "monthly" ? pkg.monthlyPrice : pkg.yearlyPrice,
    };
    setSelectedPackage(packageWithBilling);
    localStorage.setItem("selectedPackage", JSON.stringify(packageWithBilling));
    router.push("/checkout");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    window.location.href = "/login";
  };

  const getPrice = (pkg: SubscriptionPackage) => {
    return billingCycle === "monthly" ? pkg.monthlyPrice : pkg.yearlyPrice;
  };

  const getOriginalPrice = (pkg: SubscriptionPackage) => {
    return billingCycle === "monthly"
      ? pkg.originalMonthlyPrice
      : pkg.originalYearlyPrice;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container max-w-7xl mx-auto px-4 py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 lg:mb-12 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="bg-primary p-2 rounded-lg">
              <Bot className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold text-primary">
                Choose Your AI Plan
              </h1>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">
                Unlock advanced AI voice capabilities
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-gray-700 bg-transparent text-sm lg:text-base"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <p className="text-center text-gray-600 mb-6 lg:mb-8 max-w-3xl mx-auto text-sm lg:text-lg">
          Experience next-generation AI voice assistance with our premium plans.
          Choose the perfect package for your needs.
        </p>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8 lg:mb-12">
          <Tabs
            value={billingCycle}
            onValueChange={(value) =>
              setBillingCycle(value as "monthly" | "yearly")
            }
          >
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="monthly" className="text-sm lg:text-base">
                Monthly
              </TabsTrigger>
              <TabsTrigger value="yearly" className="text-sm lg:text-base">
                Yearly
                <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                  Save 20%
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {subscriptionPackages.map((pkg, index) => (
            <div key={pkg.id} className="relative h-full">
              <div
                className="h-full flex flex-col border-2 rounded-lg bg-white shadow-sm"
                style={{ borderColor: "#009A44" }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 lg:-top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <Badge className="bg-primary text-white px-4 lg:px-6 py-1 lg:py-2 text-xs lg:text-sm font-semibold shadow-lg">
                      <Zap className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4 lg:pb-6 relative flex-shrink-0">
                  <CardTitle className="text-xl lg:text-2xl font-bold text-gray-900 pt-5">
                    {pkg.name}
                  </CardTitle>
                  <CardDescription className="text-sm lg:text-base mt-2">
                    {pkg.description}
                  </CardDescription>

                  <div className="mt-4 lg:mt-6">
                    <div className="flex items-center justify-center space-x-2">
                      {getOriginalPrice(pkg) && (
                        <span className="text-base lg:text-lg text-gray-400 line-through">
                          ${getOriginalPrice(pkg)}
                        </span>
                      )}
                      <span className="text-2xl lg:text-3xl font-bold text-primary">
                        ${getPrice(pkg)}
                      </span>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-500 mt-2">
                      per {billingCycle === "monthly" ? "month" : "year"}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 lg:space-y-6 flex-grow flex flex-col px-4 lg:px-6">
                  <ul className="space-y-3 lg:space-y-4 flex-grow">
                    {pkg.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center space-x-3"
                      >
                        <div className="bg-green-100 p-1 rounded-full flex-shrink-0">
                          <Check className="h-3 w-3 lg:h-4 lg:w-4 text-green-600" />
                        </div>
                        <span className="text-xs lg:text-sm font-medium">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <Button
                      className="w-full h-10 lg:h-12 bg-primary hover:bg-primary/90 text-white text-sm lg:text-base"
                      onClick={() => handleSelectPackage(pkg)}
                    >
                      Choose {pkg.name}
                    </Button>
                  </div>
                </CardContent>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 lg:mt-12">
          <div className="inline-flex items-center space-x-2 bg-gray-50 px-4 lg:px-6 py-2 lg:py-3 rounded-full border border-gray-200">
            <Shield className="h-4 w-4 lg:h-5 lg:w-5 text-primary flex-shrink-0" />
            <p className="text-xs lg:text-sm text-gray-600">
              14-day free trial • Cancel anytime • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
