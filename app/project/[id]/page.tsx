"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/app/context/AuthContext"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { id } = params
  const { user } = useAuth()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase!
          .from("projects")
          .select("*")
          .eq("id", id)
          .single()

        if (error) throw error
        setProject(data)
      } catch (err) {
        console.error("Error cargando proyecto:", err)
        setError("No se pudo cargar el proyecto")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProject()
    }
  }, [id])

  if (loading) {
    return (
      <div style={{ padding: 40, color: "white" }}>
        ⏳ Cargando proyecto...
      </div>
    )
  }

  if (error || !project) {
    return (
      <div style={{ padding: 40, color: "white" }}>
        <p>❌ {error || "Proyecto no encontrado"}</p>
        <Link href="/explore" style={{ color: "#10b981" }}>
          ← Volver a explorar
        </Link>
      </div>
    )
  }

  // ✅ Asegurar que todos los valores sean strings
  const projectName = typeof project.name === 'string' ? project.name : 'Proyecto sin título'
  const projectDescription = typeof project.description === 'string' ? project.description : 'Sin descripción'
  const projectDate = project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Fecha desconocida'
  const projectUserId = typeof project.user_id === 'string' ? project.user_id : 'Usuario desconocido'

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white"
      }}
    >
      <aside
        style={{
          width: 240,
          padding: "24px 16px",
          background: "rgba(255,255,255,0.03)",
          borderRight: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        <div
          style={{
            padding: "0 8px 16px",
            fontSize: 20,
            fontWeight: "bold",
            color: "#10b981"
          }}
        >
          🎵 Music Collab
        </div>
        <Link
          href="/"
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            color: "#9ca3af",
            textDecoration: "none",
            display: "block"
          }}
        >
          🏠 Inicio
        </Link>
        <Link
          href="/explore"
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            color: "#9ca3af",
            textDecoration: "none",
            display: "block"
          }}
        >
          🔍 Explorar
        </Link>
      </aside>

      <main
        style={{
          flex: 1,
          padding: "40px",
          maxWidth: "800px"
        }}
      >
        <Link href="/explore" style={{ color: "#10b981", textDecoration: "none" }}>
          ← Volver a explorar
        </Link>

        <h1 style={{ fontSize: 32, marginTop: 20 }}>{projectName}</h1>

        <p style={{ color: "#9ca3af", fontSize: 16 }}>
          {projectDescription}
        </p>

        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 8
          }}
        >
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            📅 Creado: {projectDate}
          </p>
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            👤 Creado por: {projectUserId}
          </p>
        </div>

        {user && user.id === project.user_id && (
          <div
            style={{
              marginTop: 24,
              padding: 16,
              background: "rgba(16, 185, 129, 0.1)",
              borderRadius: 8,
              border: "1px solid rgba(16, 185, 129, 0.2)"
            }}
          >
            <p style={{ color: "#10b981" }}>✅ Eres el creador de este proyecto</p>
          </div>
        )}
      </main>
    </div>
  )
}
