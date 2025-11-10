"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Navigation from "@/components/navigation"
import VolunteerList from "@/components/volunteer-list"
import VolunteerForm from "@/components/volunteer-form"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface Volunteer {
  _id?: string
  id?: string
  name: string
  telegram: string
  phone: string
  skills: string
  joinDate: string
  events?: any[]
}

export default function DashboardPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingVolunteer, setEditingVolunteer] = useState<Volunteer | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
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
        setVolunteers(data.map((v: any) => ({ ...v, id: v._id })))
      }
    } catch (err) {
      console.error("Error fetching volunteers:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddVolunteer = async (formData: Omit<Volunteer, "id">) => {
    try {
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
      }
    } catch (err) {
      console.error("Error adding volunteer:", err)
    }
  }

  const handleUpdateVolunteer = async (formData: Omit<Volunteer, "id">) => {
    if (!editingVolunteer) return
    try {
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
      }
    } catch (err) {
      console.error("Error updating volunteer:", err)
    }
  }

  const handleDeleteVolunteer = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/volunteers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (response.ok) {
        await fetchVolunteers()
      }
    } catch (err) {
      console.error("Error deleting volunteer:", err)
    }
  }

  const handleEdit = (volunteer: Volunteer) => {
    setEditingVolunteer(volunteer)
    setShowForm(true)
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
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Волонтеры</h1>
              <p className="text-muted-foreground mt-1">Управление волонтерами SLEO</p>
            </div>
            <Button
              onClick={() => {
                setEditingVolunteer(null)
                setShowForm(true)
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-fit"
            >
              Добавить волонтера
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="Поиск по имени или Telegram..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* Form */}
          {showForm && (
            <Card className="mb-8 p-6">
              <VolunteerForm
                volunteer={editingVolunteer}
                onSubmit={editingVolunteer ? handleUpdateVolunteer : handleAddVolunteer}
                onCancel={() => {
                  setShowForm(false)
                  setEditingVolunteer(null)
                }}
              />
            </Card>
          )}

          {/* List */}
          <VolunteerList volunteers={filteredVolunteers} onEdit={handleEdit} onDelete={handleDeleteVolunteer} />
        </div>
      </main>
    </div>
  )
}
