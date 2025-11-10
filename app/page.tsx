"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function LoginPage() {
  const [telegram, setTelegram] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("sleo_token")
    if (token) {
      router.push("/dashboard")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login"
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegram, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ошибка аутентификации")
      }

      localStorage.setItem("sleo_token", data.token)
      localStorage.setItem("sleo_telegram", data.user.telegram)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка аутентификации")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">SLEO</h1>
            <p className="text-muted-foreground">Social Life and Event Organization</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="telegram" className="text-sm font-medium">
                Telegram юзернейм
              </label>
              <Input
                id="telegram"
                type="text"
                placeholder="@yourname"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Пароль
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? "Загрузка..." : isRegistering ? "Зарегистрироваться" : "Войти"}
            </Button>
          </form>

          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs text-center text-primary hover:underline w-full"
          >
            {isRegistering ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
          </button>
        </div>
      </Card>
    </div>
  )
}
