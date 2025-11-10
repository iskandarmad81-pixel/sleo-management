"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Phone, Calendar, Award } from "lucide-react"
import Navigation from "@/components/navigation"
import type { Volunteer } from "@/app/dashboard/page"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function VolunteerDetailsPage() {
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null)
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const volunteerId = params.id as string

  const getToken = () => localStorage.getItem("sleo_token")

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push("/")
      return
    }
    fetchVolunteerData()
  }, [volunteerId, router])

  const fetchVolunteerData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/volunteers/${volunteerId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (response.ok) {
        const data = await response.json()
        setVolunteer(data)
        setEvents(data.events || [])
      }
    } catch (err) {
      console.error("Error fetching volunteer:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("sleo_token")
    localStorage.removeItem("sleo_telegram")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation onLogout={handleLogout} currentPage="volunteers" />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!volunteer) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation onLogout={handleLogout} currentPage="volunteers" />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <Button onClick={() => router.push("/dashboard")} variant="outline" className="mb-4 text-foreground">
              <ArrowLeft size={16} className="mr-2" />
              Вернуться
            </Button>
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Волонтер не найден</p>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation onLogout={handleLogout} currentPage="volunteers" />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {/* Back Button */}
          <Button onClick={() => router.push("/dashboard")} variant="outline" className="mb-6 text-foreground">
            <ArrowLeft size={16} className="mr-2" />
            Вернуться к волонтерам
          </Button>

          {/* Volunteer Info Card */}
          <Card className="p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-foreground mb-2">{volunteer.name}</h1>
                <p className="text-muted-foreground mb-6">Активный волонтер SLEO</p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-foreground">
                    <Award size={18} className="text-primary" />
                    <span>@{volunteer.telegram}</span>
                  </div>
                  {volunteer.phone && (
                    <div className="flex items-center gap-3 text-foreground">
                      <Phone size={18} className="text-primary" />
                      <span>{volunteer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-foreground">
                    <Calendar size={18} className="text-primary" />
                    <span>Присоединился: {new Date(volunteer.joinDate).toLocaleDateString("ru-RU")}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="md:text-right">
                <div className="bg-primary/10 rounded-lg p-6 mb-4">
                  <div className="text-3xl font-bold text-primary">{events.length}</div>
                  <div className="text-sm text-muted-foreground">Событий</div>
                </div>
              </div>
            </div>

            {/* Skills */}
            {volunteer.skills && (
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3">Навыки</h3>
                <div className="flex flex-wrap gap-2">
                  {volunteer.skills.split(",").map((skill, index) => (
                    <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Event History */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">История событий</h2>

            {events.length === 0 ? (
              <Card className="p-8 text-center">
                <Award size={32} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">Пока нет участия в событиях</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {events.map((event: any) => (
                  <Card
                    key={event._id}
                    className="p-6 hover:shadow-lg transition cursor-pointer"
                    onClick={() => router.push(`/dashboard/events/${event._id}`)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">{event.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span>📅 {new Date(event.date).toLocaleDateString("ru-RU")}</span>
                          {event.location && <span>📍 {event.location}</span>}
                        </div>
                      </div>

                      <div className="md:text-right flex-shrink-0">
                        <div className="inline-block bg-accent/10 rounded-lg px-4 py-2">
                          <span className="text-accent font-semibold">Участник</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
