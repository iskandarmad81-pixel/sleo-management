"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Navigation from "@/components/navigation"
import EventList from "@/components/event-list"
import EventForm from "@/components/event-form"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface Event {
  _id?: string
  id?: string
  name: string
  description?: string
  date: string
  location?: string
  volunteers?: any[]
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const getToken = () => localStorage.getItem("sleo_token")

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push("/")
      return
    }
    fetchEvents()
  }, [router])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/events`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (response.ok) {
        const data = await response.json()
        setEvents(data.map((e: any) => ({ ...e, id: e._id })))
      }
    } catch (err) {
      console.error("Error fetching events:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddEvent = async (formData: Omit<Event, "id">) => {
    try {
      const response = await fetch(`${API_URL}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        await fetchEvents()
        setShowForm(false)
      }
    } catch (err) {
      console.error("Error adding event:", err)
    }
  }

  const handleUpdateEvent = async (formData: Omit<Event, "id">) => {
    if (!editingEvent) return
    try {
      const eventId = editingEvent._id || editingEvent.id
      const response = await fetch(`${API_URL}/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        await fetchEvents()
        setEditingEvent(null)
        setShowForm(false)
      }
    } catch (err) {
      console.error("Error updating event:", err)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (response.ok) {
        await fetchEvents()
      }
    } catch (err) {
      console.error("Error deleting event:", err)
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setShowForm(true)
  }

  const filteredEvents = events.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.location && e.location.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleLogout = () => {
    localStorage.removeItem("sleo_token")
    localStorage.removeItem("sleo_telegram")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation onLogout={handleLogout} currentPage="events" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground">События</h1>
              <p className="text-muted-foreground mt-1">Управление событиями SLEO</p>
            </div>
            <Button
              onClick={() => {
                setEditingEvent(null)
                setShowForm(true)
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-fit"
            >
              Добавить событие
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="Поиск по названию или месту..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* Form */}
          {showForm && (
            <Card className="mb-8 p-6">
              <EventForm
                event={editingEvent}
                onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent}
                onCancel={() => {
                  setShowForm(false)
                  setEditingEvent(null)
                }}
              />
            </Card>
          )}

          {/* List */}
          <EventList events={filteredEvents} onEdit={handleEdit} onDelete={handleDeleteEvent} />
        </div>
      </main>
    </div>
  )
}
