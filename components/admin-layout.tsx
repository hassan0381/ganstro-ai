"use client"

import type React from "react"

import { AdminSidebar } from "@/components/admin-sidebar"

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex items-center justify-between ml-12 lg:ml-0">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h1>
              {description && <p className="text-sm lg:text-base text-gray-600 mt-1">{description}</p>}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 bg-white">{children}</main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs lg:text-sm text-gray-600 space-y-2 sm:space-y-0">
            <p>&copy; 2024 GanStró AI Assistant. All rights reserved.</p>
            <p>Version 1.0.0</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
