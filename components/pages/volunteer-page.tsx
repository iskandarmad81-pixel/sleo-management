"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Trash2 } from "lucide-react"
import VolunteerForm from "@/components/forms/volunteer-form"
import type { Volunteer } from "@/types/volunteer"

const DEMO_VOLUNTEERS: Volunteer[] = [
  {
    id: "1",
    firstName: "Иван",
    lastName: "Петров",
    email: "ivan@example.com",
    phone: "+7 (999) 123-45-67",
    trainingGroup: "Группа А",
    photo: "/volunteer-photo-man.jpg",
    events: ["1", "2"],
  },
  {
    id: "2",
    firstName: "Мария",
    lastName: "Сидорова",
    email: "maria@example.com",
    phone: "+7 (999) 234-56-78",
    trainingGroup: "Группа Б",
    photo: "/volunteer-photo-woman.jpg",
    events: ["2"],
  },
  {
    id: "3",
    firstName: "Алексей",
    lastName: "Иванов",
    email: "alex@example.com",
    phone: "+7 (999) 345-67-89",
    trainingGroup: "Группа А",
    photo: "/volunteer-photo-man.jpg",
    events: ["1"],
  },
]

export default function VolunteerPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>(DEMO_VOLUNTEERS)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const filteredVolunteers = volunteers.filter(
    (v) =>
      v.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.lastName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSave = (volunteer: Volunteer) => {
    if (editingId) {
      setVolunteers(volunteers.map((v) => (v.id === editingId ? volunteer : v)))
      setEditingId(null)
    } else {
      setVolunteers([...volunteers, { ...volunteer, id: Date.now().toString() }])
    }
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Вы уверены?")) {
      setVolunteers(volunteers.filter((v) => v.id !== id))
    }
  }

  const handleEdit = (volunteer: Volunteer) => {
    setEditingId(volunteer.id)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Волонтеры</h1>
          <p className="text-muted-foreground">Управление волонтерами и их участием в событиях</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null)
            setShowForm(true)
          }}
          className="bg-accent hover:bg-accent/90 text-accent-foreground flex gap-2 items-center w-full sm:w-auto"
        >
          <Plus size={20} />
          Добавить волонтера
        </Button>
      </div>

      {showForm && (
        <VolunteerForm
          volunteer={editingId ? volunteers.find((v) => v.id === editingId) : undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingId(null)
          }}
        />
      )}

      <div className="w-full">
        <Input
          placeholder="Поиск по имени или фамилии..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6"
        />
      </div>

      {filteredVolunteers.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Волонтеры не найдены</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredVolunteers.map((volunteer) => (
            <div key={volunteer.id} className="cursor-pointer group">
              <Card
                className="p-4 sm:p-6 hover:shadow-lg transition-all"
                onClick={() => router.push(`/dashboard/volunteer/${volunteer.id}`)}
              >
                <div className="text-center space-y-3">
                  <img
                    src={volunteer.photo || "/placeholder.svg"}
                    alt={`${volunteer.firstName} ${volunteer.lastName}`}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover mx-auto"
                  />
                  <div>
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">{volunteer.firstName}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">{volunteer.lastName}</p>
                    <p className="text-xs text-primary mt-1">{volunteer.trainingGroup}</p>
                  </div>
                </div>
              </Card>

              <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(volunteer)
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
                    handleDelete(volunteer.id)
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
