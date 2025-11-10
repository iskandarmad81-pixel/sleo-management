"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function EventForm({ event, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    location: "",
  })

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        description: event.description || "",
        date: event.date,
        location: event.location || "",
      })
    }
  }, [event])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">{event ? "Редактировать событие" : "Добавить событие"}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Название
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Название события"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-foreground">
            Описание
          </label>
          <Input
            id="description"
            type="text"
            placeholder="Описание события"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-medium text-foreground">
            Дата
          </label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium text-foreground">
            Место
          </label>
          <Input
            id="location"
            type="text"
            placeholder="Адрес события"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" onClick={onCancel} variant="outline" className="text-foreground bg-transparent">
          Отмена
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {event ? "Сохранить" : "Добавить"}
        </Button>
      </div>
    </form>
  )
}
