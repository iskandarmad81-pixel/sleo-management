"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Edit2, Trash2, Users, Calendar } from "lucide-react"
import type { Event, Volunteer } from "@/types"

const DEMO_EVENTS: Record<string, Event> = {
  "1": {
    id: "1",
    name: "Уборка парка",
    date: "2024-12-15",
    description: "Общая уборка городского парка",
    volunteers: ["1", "3"],
  },
  "2": {
    id: "2",
    name: "Концерт благотворительности",
    date: "2024-12-20",
    description: "Благотворительный концерт для помощи нуждающимся",
    volunteers: ["1", "2"],
  },
}

const DEMO_VOLUNTEERS: Record<string, Volunteer> = {
  "1": {
    id: "1",
    firstName: "Иван",
    lastName: "Петров",
    email: "ivan@example.com",
    phone: "+7 (999) 123-45-67",
    trainingGroup: "Группа А",
    photo: "/volunteer-photo-man.jpg",
    events: ["1", "2"],
  },
  "2": {
    id: "2",
    firstName: "Мария",
    lastName: "Сидорова",
    email: "maria@example.com",
    phone: "+7 (999) 234-56-78",
    trainingGroup: "Группа Б",
    photo: "/volunteer-photo-woman.jpg",
    events: ["2"],
  },
  "3": {
    id: "3",
    firstName: "Алексей",
    lastName: "Иванов",
    email: "alex@example.com",
    phone: "+7 (999) 345-67-89",
    trainingGroup: "Группа А",
    photo: "/volunteer-photo-man.jpg",
    events: ["1"],
  },
}

export default function EventDetailPage({ eventId }: { eventId: string }) {
  const router = useRouter()
  const event = DEMO_EVENTS[eventId]
  const eventVolunteers = event?.volunteers.map((id) => DEMO_VOLUNTEERS[id]) || []

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Событие не найдено</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="flex gap-2 items-center text-primary hover:text-primary/80"
      >
        <ArrowLeft size={20} />
        Назад
      </Button>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="p-6 space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{event.name}</h1>
              <div className="flex gap-2 items-center mt-2 text-primary">
                <Calendar size={18} />
                <p className="font-semibold">{event.date}</p>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">Описание события</p>
              <p className="text-foreground mt-2">{event.description}</p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => router.push(`/dashboard/events`)}
                variant="outline"
                className="flex-1 flex gap-2 items-center"
              >
                <Edit2 size={18} />
                Изменить
              </Button>
              <Button variant="destructive" className="flex-1 flex gap-2 items-center">
                <Trash2 size={18} />
                Удалить
              </Button>
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="p-6">
            <div className="flex gap-2 items-center mb-4">
              <Users size={20} className="text-primary" />
              <h2 className="text-xl font-bold text-foreground">Волонтеры ({eventVolunteers.length})</h2>
            </div>

            {eventVolunteers.length === 0 ? (
              <p className="text-muted-foreground">Волонтеры не назначены</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {eventVolunteers.map((volunteer) => (
                  <Card
                    key={volunteer.id}
                    className="p-4 bg-secondary/50 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => router.push(`/dashboard/volunteer/${volunteer.id}`)}
                  >
                    <div className="flex gap-3">
                      <img
                        src={volunteer.photo || "/placeholder.svg"}
                        alt={`${volunteer.firstName} ${volunteer.lastName}`}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {volunteer.firstName} {volunteer.lastName}
                        </h3>
                        <p className="text-xs text-primary">{volunteer.trainingGroup}</p>
                        <p className="text-xs text-muted-foreground mt-1">{volunteer.email}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
