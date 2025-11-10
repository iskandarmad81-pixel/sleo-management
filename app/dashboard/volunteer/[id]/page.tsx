"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect } from "react"
import Layout from "@/components/layout"
import VolunteerDetailPage from "@/components/pages/volunteer-detail-page"

export default function VolunteerDetailsPage() {
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
      <VolunteerDetailPage volunteerId={params.id as string} />
    </Layout>
  )
}
