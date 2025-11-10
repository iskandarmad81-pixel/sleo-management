"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Calendar, MapPin, Users, TrendingUp } from "lucide-react"
import Navigation from "@/components/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function EventDetailsPage() {
  const [event, setEvent] = useState<any>(null)
  const [volunteers, setVolunteers] = useState<any[]>([])
  const [allVolunteers, setAllVolunteers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const eventId = params.id as string

  const getToken = () => localStorage.getItem("sleo_token")

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push("/")
      return
    }
    fetchEventData()
  }, [eventId, router])

  const fetchEventData = async () => {
    try {
      setLoading(true)
      const eventResponse = await fetch(`${API_URL}/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (eventResponse.ok) {
        const eventData = await eventResponse.json()
        setEvent(eventData)
        setVolunteers(eventData.volunteers || [])
      }

      const volResponse = await fetch(`${API_URL}/api/volunteers`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (volResponse.ok) {
        const volData = await volResponse.json()
        setAllVolunteers(volData)
      }
    } catch (err) {
      console.error("Error fetching event data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("sleo_token")
    localStorage.removeItem("sleo_telegram")
    router.push("/")
  }

  const handleAddVolunteer = async (volunteerId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/events/${eventId}/volunteers/${volunteerId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (response.ok) {
        await fetchEventData()
      }
    } catch (err) {
      console.error("Error adding volunteer:", err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation onLogout={handleLogout} currentPage="events" />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation onLogout={handleLogout} currentPage="events" />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <Button onClick={() => router.push("/dashboard/events")} variant="outline" className="mb-4 text-foreground">
              <ArrowLeft size={16} className="mr-2" />
              Вернуться
            </Button>
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Событие не найдено</p>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  const availableVolunteers = allVolunteers.filter((v) => !volunteers.find((pv) => pv._id === v._id))

  return (
    <div className="min-h-screen bg-background">
      <Navigation onLogout={handleLogout} currentPage="events" />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {/* Back Button */}
          <Button onClick={() => router.push("/dashboard/events")} variant="outline" className="mb-6 text-foreground">
            <ArrowLeft size={16} className="mr-2" />
            Вернуться к событиям
          </Button>

          {/* Event Info Card */}
          <Card className="p-8 mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">{event.name}</h1>
            <p className="text-lg text-muted-foreground mb-6">{event.description}</p>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <Calendar size={24} className="text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Дата</p>
                  <p className="text-lg font-semibold text-foreground">
                    {new Date(event.date).toLocaleDateString("ru-RU", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {event.location && (
                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin size={24} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Место</p>
                    <p className="text-lg font-semibold text-foreground">{event.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Volunteer Count */}
            <div className="pt-8 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Волонтеры</h3>
                </div>
                <span className="text-sm font-medium text-primary">{volunteers.length}</span>
              </div>
            </div>
          </Card>

          {/* Participating Volunteers */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <TrendingUp size={24} />
              Участвующие волонтеры
            </h2>

            {volunteers.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Пока нет зарегистрированных волонтеров</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {volunteers.map((volunteer: any) => (
                  <Card
                    key={volunteer._id}
                    className="p-6 cursor-pointer hover:shadow-lg transition"
                    onClick={() => router.push(`/dashboard/volunteers/${volunteer._id}`)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground hover:text-primary">{volunteer.name}</h3>
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                          <p>@{volunteer.telegram}</p>
                          {volunteer.phone && <p>Телефон: {volunteer.phone}</p>}
                          {volunteer.skills && <p>Навыки: {volunteer.skills}</p>}
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <div className="bg-accent/10 rounded-lg px-4 py-2">
                          <span className="text-accent font-semibold">Зарегистрирован</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Available Volunteers */}
          {availableVolunteers.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Доступные волонтеры</h2>

              <div className="grid gap-4">
                {availableVolunteers.map((volunteer: any) => (
                  <Card key={volunteer._id} className="p-6 hover:shadow-lg transition">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => router.push(`/dashboard/volunteers/${volunteer._id}`)}
                      >
                        <h3 className="text-lg font-semibold text-foreground hover:text-primary">{volunteer.name}</h3>
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                          <p>@{volunteer.telegram}</p>
                          {volunteer.phone && <p>Телефон: {volunteer.phone}</p>}
                          {volunteer.skills && <p>Навыки: {volunteer.skills}</p>}
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <Button
                          className="bg-accent hover:bg-accent/90 text-accent-foreground"
                          onClick={() => handleAddVolunteer(volunteer._id)}
                        >
                          Добавить
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
