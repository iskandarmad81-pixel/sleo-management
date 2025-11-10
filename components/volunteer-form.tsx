"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Volunteer } from "@/app/dashboard/page"

interface VolunteerFormProps {
  volunteer?: Volunteer | null
  onSubmit: (data: Omit<Volunteer, "id">) => void
  onCancel: () => void
}

export default function VolunteerForm({ volunteer, onSubmit, onCancel }: VolunteerFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    telegram: "",
    phone: "",
    skills: "",
    joinDate: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    if (volunteer) {
      setFormData({
        name: volunteer.name,
        telegram: volunteer.telegram,
        phone: volunteer.phone,
        skills: volunteer.skills,
        joinDate: volunteer.joinDate,
      })
    }
  }, [volunteer])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">
        {volunteer ? "Редактировать волонтера" : "Добавить волонтера"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Имя
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Иван Иванов"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="telegram" className="text-sm font-medium text-foreground">
            Telegram юзернейм
          </label>
          <Input
            id="telegram"
            type="text"
            placeholder="@ivan_ivanov"
            value={formData.telegram}
            onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            Телефон
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder="+7 (999) 999-9999"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="joinDate" className="text-sm font-medium text-foreground">
            Дата присоединения
          </label>
          <Input
            id="joinDate"
            type="date"
            value={formData.joinDate}
            onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
            required
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label htmlFor="skills" className="text-sm font-medium text-foreground">
            Навыки
          </label>
          <Input
            id="skills"
            type="text"
            placeholder="Программирование, дизайн, преподавание..."
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" onClick={onCancel} variant="outline" className="text-foreground bg-transparent">
          Отмена
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {volunteer ? "Сохранить" : "Добавить"}
        </Button>
      </div>
    </form>
  )
}
