"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Navigation from "@/components/navigation"
import VolunteerList from "@/components/volunteer-list"
import VolunteerForm from "@/components/volunteer-form"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function DashboardPage() {
  const [volunteers, setVolunteers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingVolunteer, setEditingVolunteer] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const router = useRouter()

  const getToken = () => localStorage.getItem("sleo_token")

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push("/")
      return
    }
    fetchVolunteers()
  }, [router])


  const fetchVolunteers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/volunteers`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (response.ok) {
        const data = await response.json()
        setVolunteers(data.map((v) => ({ ...v, id: v._id })))
      }
    } catch (err) {
      console.error("Error fetching volunteers:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddVolunteer = async (formData) => {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      setFormError("")

      const response = await fetch(`${API_URL}/api/volunteers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchVolunteers()
        setShowForm(false)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Ошибка при добавлении волонтера")
      }
    } catch (err) {
      console.error("Error adding volunteer:", err)
      setFormError(err.message)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateVolunteer = async (formData) => {
    if (!editingVolunteer || isSubmitting) return

    try {
      setIsSubmitting(true)
      setFormError("")

      const volunteerId = editingVolunteer._id || editingVolunteer.id
      const response = await fetch(`${API_URL}/api/volunteers/${volunteerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchVolunteers()
        setEditingVolunteer(null)
        setShowForm(false)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Ошибка при обновлении волонтера")
      }
    } catch (err) {
      console.error("Error updating volunteer:", err)
      setFormError(err.message)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteVolunteer = async (id) => {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      const response = await fetch(`${API_URL}/api/volunteers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (response.ok) {
        await fetchVolunteers()
      }
    } catch (err) {
      console.error("Error deleting volunteer:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (volunteer) => {
    setEditingVolunteer(volunteer)
    setShowForm(true)
    setFormError("")
  }

  const filteredVolunteers = volunteers.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.telegram.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleLogout = () => {
    localStorage.removeItem("sleo_token")
    localStorage.removeItem("sleo_telegram")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation onLogout={handleLogout} />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Волонтеры</h1>
              <p className="text-muted-foreground mt-1">Управление волонтерами SLEO</p>
            </div>
            <Button
              onClick={() => {
                setEditingVolunteer(null)
                setShowForm(true)
                setFormError("")
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-fit"
              disabled={isSubmitting}
            >
              Добавить волонтера
            </Button>
          </div>

          <div className="mb-6">
            <Input
              placeholder="Поиск по имени или Telegram..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {showForm && (
            <Card className="mb-8 p-6">
              <VolunteerForm
                volunteer={editingVolunteer}
                onSubmit={editingVolunteer ? handleUpdateVolunteer : handleAddVolunteer}
                onCancel={() => {
                  setShowForm(false)
                  setEditingVolunteer(null)
                  setFormError("")
                }}
              />
            </Card>
          )}

          <VolunteerList volunteers={filteredVolunteers} onEdit={handleEdit} onDelete={handleDeleteVolunteer} />
        </div>
      </main>
    </div>
  )
}
