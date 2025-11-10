"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Edit2, Trash2, Mail, Phone } from "lucide-react"
import type { Volunteer, Event } from "@/types"

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

export default function VolunteerDetailPage({ volunteerId }: { volunteerId: string }) {
  const router = useRouter()
  const volunteer = DEMO_VOLUNTEERS[volunteerId]
  const volunteerEvents = volunteer?.events.map((id) => DEMO_EVENTS[id]) || []

  if (!volunteer) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Волонтер не найден</p>
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
          <Card className="p-6 text-center space-y-4">
            <img
              src={volunteer.photo || "/placeholder.svg"}
              alt={`${volunteer.firstName} ${volunteer.lastName}`}
              className="w-40 h-40 rounded-lg object-cover mx-auto"
            />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {volunteer.firstName} {volunteer.lastName}
              </h1>
              <p className="text-primary font-semibold">{volunteer.trainingGroup}</p>
            </div>

            <div className="border-t border-border pt-4 space-y-3 text-left">
              <div className="flex gap-3 items-center">
                <Mail size={18} className="text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{volunteer.email}</p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Phone size={18} className="text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Телефон</p>
                  <p className="text-sm font-medium">{volunteer.phone}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => router.push(`/dashboard`)}
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
            <h2 className="text-xl font-bold text-foreground mb-4">Участие в событиях</h2>
            {volunteerEvents.length === 0 ? (
              <p className="text-muted-foreground">Нет участия в событиях</p>
            ) : (
              <div className="space-y-3">
                {volunteerEvents.map((event) => (
                  <Card key={event.id} className="p-4 bg-secondary/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-foreground">{event.name}</h3>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                        <p className="text-sm mt-2">{event.description}</p>
                      </div>
                      <Button onClick={() => router.push(`/dashboard/event/${event.id}`)} variant="outline" size="sm">
                        Детали
                      </Button>
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
