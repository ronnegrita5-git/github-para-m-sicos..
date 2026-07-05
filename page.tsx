"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"

export default function PRListPage({ params }: any) {
  const { id } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const [prs, setPrs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    loadPRs()
  }, [user])

  async function loadPRs() {
    setLoading(true)
    const { data, error } = await supabase
      .from("pull_requests")
      .select(`
        *,
        profiles (email)
      `)
      .eq("project_id", id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error al cargar PRs:", error)
    } else {
      setPrs(data || [])
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: 30, fontFamily: "Arial", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>📥 Pull Requests</h1>
        <Link href={`/project/${id}`} style={{ textDecoration: "none", color: "#2b8a3e" }}>
          ← Volver al proyecto
        </Link>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : prs.length === 0 ? (
        <p style={{ color: "#666", marginTop: 30 }}>No hay Pull Requests</p>
      ) : (
        prs.map((pr) => (
          <div
            key={pr.id}
            style={{
              padding: 15,
              border: "1px solid #e0e0e0",
              borderRadius: 12,
              marginBottom: 12,
              background: "white",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ margin: 0 }}>{pr.title}</h3>
                <p style={{ margin: "5px 0", color: "#666", fontSize: 14 }}>
                  {pr.description || "Sin descripción"}
                </p>
                <div style={{ fontSize: 12, color: "#888" }}>
                  👤 {pr.profiles?.email?.split("@")[0] || "Usuario"} · 
                  📅 {new Date(pr.created_at).toLocaleDateString()}
                </div>
              </div>
              <div>
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: 12,
                    background:
                      pr.status === "pending" ? "#ffc107" :
                      pr.status === "approved" ? "#28a745" :
                      "#dc3545",
                    color: "white",
                    fontSize: 12,
                  }}
                >
                  {pr.status === "pending" ? "⏳ Pendiente" :
                   pr.status === "approved" ? "✅ Aceptado" :
                   "❌ Rechazado"}
                </span>
                {pr.status === "pending" && (
                  <Link
                    href={`/project/${id}/pr/${pr.id}`}
                    style={{
                      marginLeft: 10,
                      padding: "4px 12px",
                      background: "#0d6efd",
                      color: "white",
                      borderRadius: 8,
                      textDecoration: "none",
                      fontSize: 14,
                    }}
                  >
                    Revisar
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
