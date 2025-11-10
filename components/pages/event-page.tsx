"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Trash2, Calendar } from "lucide-react"
import EventForm from "@/components/forms/event-form"
import type { Event } from "@/types"

const DEMO_EVENTS: Event[] = [
  {
    id: "1",
    name: "Уборка парка",
    date: "2024-12-15",
    description: "Общая уборка городского парка",
    volunteers: ["1", "3"],
  },
  {
    id: "2",
    name: "Концерт благотворительности",
    date: "2024-12-20",
    description: "Благотворительный концерт для помощи нуждающимся",
    volunteers: ["1", "2"],
  },
  {
    id: "3",
    name: "Сбор помощи",
    date: "2024-12-25",
    description: "Сбор еды и вещей для нуждающихся",
    volunteers: ["2"],
  },
]

export default function EventPage() {
  const [events, setEvents] = useState<Event[]>(DEMO_EVENTS)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const filteredEvents = events.filter((e) => e.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSave = (event: Event) => {
    if (editingId) {
      setEvents(events.map((e) => (e.id === editingId ? event : e)))
      setEditingId(null)
    } else {
      setEvents([...events, { ...event, id: Date.now().toString() }])
    }
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Вы уверены?")) {
      setEvents(events.filter((e) => e.id !== id))
    }
  }

  const handleEdit = (event: Event) => {
    setEditingId(event.id)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">События</h1>
          <p className="text-muted-foreground">Управление событиями и волонтерами</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null)
            setShowForm(true)
          }}
          className="bg-accent hover:bg-accent/90 text-accent-foreground flex gap-2 items-center w-full sm:w-auto"
        >
          <Plus size={20} />
          Создать событие
        </Button>
      </div>

      {showForm && (
        <EventForm
          event={editingId ? events.find((e) => e.id === editingId) : undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingId(null)
          }}
        />
      )}

      <div className="w-full">
        <Input
          placeholder="Поиск по названию события..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6"
        />
      </div>

      {filteredEvents.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">События не найдены</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="cursor-pointer group">
              <Card
                className="p-4 sm:p-6 hover:shadow-lg transition-all"
                onClick={() => router.push(`/dashboard/event/${event.id}`)}
              >
                <div className="space-y-3">
                  <div className="flex gap-2 items-start">
                    <Calendar size={20} className="text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-2">{event.name}</h3>
                      <p className="text-primary text-xs sm:text-sm mt-1">{event.date}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2">{event.description}</p>
                  <p className="text-xs text-muted-foreground">Волонтеры: {event.volunteers.length}</p>
                </div>
              </Card>

              <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(event)
                  }}
                  size="sm"
                  variant="outline"
                  className="flex-1 flex gap-1 items-center justify-center text-xs sm:text-sm"
                >
                  <Edit2 size={16} />
                  Изменить
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(event.id)
                  }}
                  size="sm"
                  variant="destructive"
                  className="flex-1 flex gap-1 items-center justify-center text-xs sm:text-sm"
                >
                  <Trash2 size={16} />
                  Удалить
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
