"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import Breadcrumbs from "../components/Breadcrumbs"
import JamSession from "../components/JamSession"

export default function JamPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user])

  if (!user) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0a 0%, #0f1a14 50%, #0a0a0a 100%)",
        padding: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "'Inter', sans-serif",
      }}>
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0a 0%, #0f1a14 50%, #0a0a0a 100%)",
      fontFamily: "'Inter', sans-serif",
      padding: 20,
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Breadcrumbs />
        
        <div style={{
          padding: "20px 0",
          borderBottom: "1px solid rgba(16, 185, 129, 0.1)",
          marginBottom: 30,
        }}>
          <h1 style={{
            color: "white",
            fontSize: 28,
            margin: 0,
            background: "linear-gradient(135deg, #10b981, #34d399)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            🎹 Jam Session en vivo
          </h1>
          <p style={{ color: "#10b981", fontSize: 16, marginTop: 5 }}>
            Toca junto con otros músicos en tiempo real
          </p>
        </div>

        <JamSession />
      </div>
    </div>
  )
}
