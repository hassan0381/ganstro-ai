"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/lib/api"
import { UserLayout } from "@/components/user-layout"
import { FloatingChat } from "@/components/floating-chat"
import { Download, Receipt, Calendar } from "lucide-react"

export default function InvoicesPage() {
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: api.getCurrentUser,
  })

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["invoices", user?.id],
    queryFn: () => api.getUserInvoices(user?.id || ""),
    enabled: !!user?.id,
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <UserLayout title="Invoices" description="View and manage your billing history">
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">
                    $
                    {invoices
                      ?.filter((i) => i.status === "paid")
                      .reduce((sum, i) => sum + i.amount, 0)
                      .toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Receipt className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    $
                    {invoices
                      ?.filter((i) => i.status === "pending")
                      .reduce((sum, i) => sum + i.amount, 0)
                      .toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                  <p className="text-2xl font-bold text-gray-900">{invoices?.length || 0}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Receipt className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>All your billing transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading invoices...</div>
            ) : invoices && invoices.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">#{invoice.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{invoice.plan}</p>
                          <p className="text-sm text-gray-500 capitalize">{invoice.billingPeriod}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{invoice.createdAt.toLocaleDateString()}</div>
                          {invoice.paidAt && (
                            <div className="text-gray-500">Paid: {invoice.paidAt.toLocaleDateString()}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No invoices found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <FloatingChat />
    </UserLayout>
  )
}
