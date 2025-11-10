"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import type { Volunteer } from "@/types"

interface VolunteerFormProps {
  volunteer?: Volunteer
  onSave: (volunteer: Volunteer) => void
  onCancel: () => void
}

export default function VolunteerForm({ volunteer, onSave, onCancel }: VolunteerFormProps) {
  const [formData, setFormData] = useState<Volunteer>(
    volunteer || {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      trainingGroup: "",
      photo: "",
      events: [],
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card className="p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-foreground">
          {volunteer ? "Редактирование волонтера" : "Добавить волонтера"}
        </h2>
        <button onClick={onCancel} className="p-1 hover:bg-secondary rounded-lg transition-colors">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Имя</label>
            <Input
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="Имя"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Фамилия</label>
            <Input
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Фамилия"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Телефон</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+7 (999) 123-45-67"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Группа обучения</label>
          <Input
            value={formData.trainingGroup}
            onChange={(e) => setFormData({ ...formData, trainingGroup: e.target.value })}
            placeholder="Группа А"
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
            Сохранить
          </Button>
          <Button type="button" onClick={onCancel} variant="outline" className="flex-1 bg-transparent">
            Отмена
          </Button>
        </div>
      </form>
    </Card>
  )
}
