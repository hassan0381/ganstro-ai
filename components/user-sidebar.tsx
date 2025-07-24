"use client"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { setCurrentUser } from "@/lib/auth"
import { LayoutDashboard, CreditCard, User, LogOut, Bot, Settings, Menu } from "lucide-react"
import { useState } from "react"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Subscription",
    icon: CreditCard,
    href: "/dashboard/subscription",
  },
  {
    title: "Invoices",
    icon: CreditCard,
    href: "/dashboard/invoices",
  },
  {
    title: "Profile",
    icon: User,
    href: "/dashboard/profile",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
]

interface SidebarContentProps {
  onItemClick?: () => void
}

function SidebarContent({ onItemClick }: SidebarContentProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    setCurrentUser(null)
    document.cookie = "currentUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    router.push("/login")
    onItemClick?.()
  }

  const handleNavigation = (href: string) => {
    router.push(href)
    onItemClick?.()
  }

  return (
    <div className="h-full flex flex-col">
      {/* Logo/Brand */}
      <div className="p-4 lg:p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-primary p-2 rounded-lg">
            <Bot className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-base lg:text-lg font-bold text-gray-900">GanStró AI</h1>
            <p className="text-xs text-gray-500">Assistant</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 lg:p-4 space-y-1 lg:space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Button
              key={item.href}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start text-sm lg:text-base h-10 lg:h-auto ${
                isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => handleNavigation(item.href)}
            >
              <Icon className="h-4 w-4 mr-2 lg:mr-3" />
              {item.title}
            </Button>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 lg:p-4 border-t border-gray-200 space-y-3">
        <Button
          variant="outline"
          className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 bg-transparent text-sm lg:text-base h-10 lg:h-auto"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}

export function UserSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 h-screen bg-white border-r border-gray-200 shadow-sm">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-md">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent onItemClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  )
}
