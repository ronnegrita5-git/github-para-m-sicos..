"use client"

import { useAuth } from "../context/AuthContext"
import Link from "next/link"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function UserStatus() {
  const { user, loading, signOut } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return
      const { data } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single()
      if (data?.role === "admin") {
        setIsAdmin(true)
      }
    }
    checkAdmin()
  }, [user])

  if (loading) {
    return <span style={{ color: "#6b7280", fontSize: 14 }}>⏳ Cargando...</span>
  }

  if (user) {
    const displayName = user.first_name || user.email.split('@')[0]
    
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Link
          href="/profile"
          style={{
            color: "#10b981",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            textDecoration: "none"
          }}
        >
          🟢 <strong>{displayName}</strong>
          <span style={{ color: "#6b7280", fontSize: 12, fontWeight: "normal" }}>
            ({user.email})
          </span>
        </Link>
        {isAdmin && (
          <Link
            href="/admin"
            style={{
              padding: "4px 12px",
              background: "rgba(16,185,129,0.15)",
              color: "#10b981",
              border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: 4,
              textDecoration: "none",
              fontSize: 12
            }}
          >
            🛡️ Admin
          </Link>
        )}
        <button
          onClick={signOut}
          style={{
            padding: "6px 14px",
            background: "rgba(239,68,68,0.15)",
            color: "#ef4444",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 13,
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.25)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.15)"
          }}
        >
          Cerrar sesión
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ color: "#6b7280", fontSize: 13 }}>
        🔴 No logueado
      </span>
      <Link
        href="/login"
        style={{
          padding: "8px 18px",
          background: "#10b981",
          color: "white",
          borderRadius: 6,
          textDecoration: "none",
          fontSize: 14,
          fontWeight: "600",
          transition: "all 0.2s"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#059669"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#10b981"
        }}
      >
        🔑 Iniciar sesión
      </Link>
    </div>
  )
}
