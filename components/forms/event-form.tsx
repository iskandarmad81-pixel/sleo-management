"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import type { Event } from "@/types"

interface EventFormProps {
  event?: Event
  onSave: (event: Event) => void
  onCancel: () => void
}

export default function EventForm({ event, onSave, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState<Event>(
    event || {
      id: "",
      name: "",
      date: "",
      description: "",
      volunteers: [],
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card className="p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-foreground">{event ? "Редактирование события" : "Создать событие"}</h2>
        <button onClick={onCancel} className="p-1 hover:bg-secondary rounded-lg transition-colors">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Название события</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Название события"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Дата события</label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Описание</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Описание события"
            required
            className="min-h-24"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
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
