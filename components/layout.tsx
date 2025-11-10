"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("sleo_token")
    localStorage.removeItem("sleo_email")
    router.push("/")
  }

  const navItems = [
    { label: "Волонтеры", href: "/dashboard" },
    { label: "События", href: "/dashboard/events" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/dashboard" className="font-bold text-xl text-primary">
              SLEO
            </Link>

            {/* Desktop Navigation */}
            {!isMobile && (
              <div className="flex gap-6 items-center">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
                <Button onClick={handleLogout} variant="ghost" size="sm" className="flex gap-2 items-center">
                  <LogOut size={18} />
                  Выход
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-secondary rounded-lg">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>

          {/* Mobile Menu */}
          {isMobile && mobileMenuOpen && (
            <div className="pb-4 border-t border-border">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
                className="w-full text-left px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors flex gap-2 items-center"
              >
                <LogOut size={18} />
                Выход
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
