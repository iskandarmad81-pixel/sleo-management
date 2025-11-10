"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Navigation({ onLogout, currentPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userTelegram, setUserTelegram] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const telegram = localStorage.getItem("sleo_telegram")
    setUserTelegram(telegram || "")
    setMobileMenuOpen(false)
  }, [pathname])

  const handleNavigate = (path) => {
    router.push(path)
    setMobileMenuOpen(false)
  }

  const isVolunteersPage = currentPage === "volunteers" || pathname.startsWith("/dashboard/volunteers")
  const isEventsPage = currentPage === "events" || pathname.startsWith("/dashboard/events")

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => handleNavigate("/dashboard")}
            className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity duration-200"
          >
            SLEO
          </button>

          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              <button
                onClick={() => handleNavigate("/dashboard")}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isVolunteersPage
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Волонтеры
              </button>
              <button
                onClick={() => handleNavigate("/dashboard/events")}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isEventsPage
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                События
              </button>
            </div>

            <div className="flex items-center gap-4 border-l border-border pl-6">
              <span className="text-sm text-muted-foreground truncate max-w-xs">{userTelegram}</span>
              <Button
                onClick={() => {
                  onLogout()
                  handleNavigate("/")
                }}
                variant="outline"
                className="text-foreground hover:bg-muted"
              >
                Выход
              </Button>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-foreground p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border animate-in fade-in duration-200">
            <div className="flex flex-col gap-2 pt-4">
              <button
                onClick={() => handleNavigate("/dashboard")}
                className={`text-sm font-medium text-left px-3 py-3 rounded-lg transition-colors duration-200 ${
                  isVolunteersPage
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Волонтеры
              </button>
              <button
                onClick={() => handleNavigate("/dashboard/events")}
                className={`text-sm font-medium text-left px-3 py-3 rounded-lg transition-colors duration-200 ${
                  isEventsPage
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                События
              </button>

              <div className="border-t border-border pt-3 mt-2">
                <div className="px-3 pb-3">
                  <span className="text-xs text-muted-foreground truncate block">{userTelegram}</span>
                </div>
                <Button
                  onClick={() => {
                    onLogout()
                    handleNavigate("/")
                  }}
                  variant="outline"
                  className="w-full text-foreground hover:bg-muted"
                >
                  Выход
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
