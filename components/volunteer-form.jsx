"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function VolunteerForm({ volunteer, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    telegram: "",
    phone: "",
    skills: "",
    joinDate: new Date().toISOString().split("T")[0],
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) {
      setError("Имя обязательно")
      return
    }
    if (!formData.telegram.trim()) {
      setError("Telegram юзернейм обязателен")
      return
    }

    setLoading(true)
    try {
      await onSubmit(formData)
    } catch (err) {
      setError(err.message || "Ошибка при сохранении")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">
        {volunteer ? "Редактировать волонтера" : "Добавить волонтера"}
      </h3>

      {error && <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="text-foreground bg-transparent"
          disabled={loading}
        >
          Отмена
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
          {loading ? "Сохранение..." : volunteer ? "Сохранить" : "Добавить"}
        </Button>
      </div>
    </form>
  )
}
