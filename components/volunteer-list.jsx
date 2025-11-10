"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit2, Trash2, Phone, Calendar, ChevronRight } from "lucide-react"

export default function VolunteerList({ volunteers, onEdit, onDelete }) {
  const router = useRouter()

  if (volunteers.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Волонтеры не найдены</p>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {volunteers.map((volunteer) => (
        <Card key={volunteer.id || volunteer._id} className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div
              className="flex-1 cursor-pointer hover:opacity-80 transition"
              onClick={() => router.push(`/dashboard/volunteers/${volunteer._id || volunteer.id}`)}
            >
              <h3 className="text-lg font-semibold text-foreground hover:text-primary">{volunteer.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <p>@{volunteer.telegram}</p>
                {volunteer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-primary" />
                    <p>{volunteer.phone}</p>
                  </div>
                )}
                {volunteer.skills && <p>Навыки: {volunteer.skills}</p>}
                <div className="flex items-center gap-2 mt-2">
                  <Calendar size={14} className="text-primary" />
                  <p>{new Date(volunteer.joinDate).toLocaleDateString("ru-RU")}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <Button
                onClick={() => router.push(`/dashboard/volunteers/${volunteer._id || volunteer.id}`)}
                size="sm"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <ChevronRight size={16} className="mr-1" />
                Подробнее
              </Button>
              <Button onClick={() => onEdit(volunteer)} size="sm" variant="outline" className="text-foreground">
                <Edit2 size={16} className="mr-2" />
                Редактировать
              </Button>
              <Button
                onClick={() => {
                  if (window.confirm(`Вы уверены, что хотите удалить "${volunteer.name}"?`)) {
                    onDelete(volunteer._id || volunteer.id || "")
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
