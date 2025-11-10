"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect } from "react"
import Layout from "@/components/layout"
import EventDetailPage from "@/components/pages/event-detail-page"

export default function EventDetailsPage() {
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const token = localStorage.getItem("sleo_token")
    if (!token) {
      router.push("/")
    }
  }, [router])

  return (
    <Layout>
      <EventDetailPage eventId={params.id as string} />
    </Layout>
  )
}
