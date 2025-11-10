"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit2, Trash2, MapPin, Calendar, ChevronRight } from "lucide-react"
import type { Event } from "@/app/dashboard/events/page"

interface EventListProps {
  events: Event[]
  onEdit: (event: Event) => void
  onDelete: (id: string) => void
}

export default function EventList({ events, onEdit, onDelete }: EventListProps) {
  const router = useRouter()

  if (events.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">События не найдены</p>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {events.map((event) => (
        <Card key={event.id || event._id} className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div
              className="flex-1 cursor-pointer hover:opacity-80 transition"
              onClick={() => router.push(`/dashboard/events/${event._id || event.id}`)}
            >
              <h3 className="text-lg font-semibold text-foreground hover:text-primary">{event.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  <span>{new Date(event.date).toLocaleDateString("ru-RU")}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <Button
                onClick={() => router.push(`/dashboard/events/${event._id || event.id}`)}
                size="sm"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <ChevronRight size={16} className="mr-1" />
                Подробнее
              </Button>
              <Button onClick={() => onEdit(event)} size="sm" variant="outline" className="text-foreground">
                <Edit2 size={16} className="mr-2" />
                Редактировать
              </Button>
              <Button
                onClick={() => {
                  if (window.confirm(`Вы уверены, что хотите удалить "${event.name}"?`)) {
                    onDelete(event._id || event.id || "")
                  }
                }}
                size="sm"
                variant="outline"
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 size={16} className="mr-2" />
                Удалить
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
