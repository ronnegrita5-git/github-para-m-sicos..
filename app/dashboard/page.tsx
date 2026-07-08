"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"
import Breadcrumbs from "../components/Breadcrumbs"
import NotificationBell from "../components/NotificationBell"
import Navbar from "../components/Navbar"

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDesc, setNewProjectDesc] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    loadProjects()
  }, [user])

  async function loadProjects() {
    if (!user) return
    setLoading(true)
    // 👈 CONSULTA CORRECTA: TODOS los proyectos del usuario (públicos Y privados)
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    setProjects(data || [])
    setLoading(false)
  }

  async function createProject() {
    if (!newProjectName.trim()) {
      alert("El nombre del proyecto es obligatorio")
      return
    }

    if (!user) {
      alert("No has iniciado sesión")
      router.push("/login")
      return
    }

    const { error } = await supabase
      .from("projects")
      .insert([
        {
          name: newProjectName,
          description: newProjectDesc || "Proyecto musical colaborativo",
          user_id: user.id,
          is_public: true,
        },
      ])

    if (error) {
      console.error("❌ Error al crear proyecto:", error)
      alert("Error al crear proyecto: " + error.message)
      return
    }

    setNewProjectName("")
    setNewProjectDesc("")
    setShowCreate(false)
    loadProjects()
  }

  async function deleteProject(projectId: string, projectName: string) {
    if (!confirm(`¿Seguro que quieres eliminar el proyecto "${projectName}"?`)) {
      return
    }

    try {
      const { data: tracks } = await supabase
        .from("tracks")
        .select("audio_url")
        .eq("project_id", projectId)

      if (tracks && tracks.length > 0) {
        for (const track of tracks) {
          if (track.audio_url) {
            const fileName = track.audio_url.split('/').pop()
            if (fileName) {
              await supabase.storage
                .from("audio")
                .remove([`${projectId}/${fileName}`])
            }
          }
        }
      }

      await supabase
        .from("tracks")
        .delete()
        .eq("project_id", projectId)

      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId)

      if (error) {
        alert("Error al eliminar proyecto: " + error.message)
        return
      }

      alert(`✅ Proyecto "${projectName}" eliminado`)
      loadProjects()
    } catch (error: any) {
      alert("Error al eliminar proyecto: " + (error.message || "Error desconocido"))
    }
  }

  function downloadProject(projectId: string, projectName: string) {
    if (!confirm(`📥 ¿Descargar proyecto "${projectName}"?`)) return
    window.location.href = `/api/download-project?projectId=${projectId}`
  }

  if (!user) return null

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #0a0a0a 0%, #0f1a14 50%, #0a0a0a 100%)",
      fontFamily: "'Inter', sans-serif",
      padding: 20
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Navbar />
        <Breadcrumbs />
        
        <div style={{ padding: "30px 0" }}>
          <div style={{ marginBottom: 30 }}>
            <h2 style={{ color: "white", fontSize: 28, margin: 0 }}>
              🎸 Tus proyectos
            </h2>
            <p style={{ color: "#10b981", fontSize: 16, marginTop: 5 }}>
              Crea, colabora y comparte tu música
            </p>
          </div>

          <button
            onClick={() => setShowCreate(!showCreate)}
            style={{
              padding: "12px 28px",
              background: showCreate ? "#065f46" : "linear-gradient(135deg, #10b981, #059669)",
              color: "white",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 16,
              fontWeight: "bold",
              marginBottom: 30,
              transition: "all 0.3s ease",
            }}
          >
            {showCreate ? "✕ Cancelar" : "+ Nuevo Proyecto"}
          </button>

          {showCreate && (
            <div style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(10px)",
              padding: 25,
              borderRadius: 16,
              border: "1px solid rgba(16, 185, 129, 0.15)",
              marginBottom: 30,
            }}>
              <h3 style={{ color: "white", margin: "0 0 15px 0" }}>✨ Crear nuevo proyecto</h3>
              <input
                placeholder="Nombre del proyecto *"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  fontSize: 16,
                  marginBottom: 12,
                }}
              />
              <input
                placeholder="Descripción (opcional)"
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  fontSize: 16,
                  marginBottom: 12,
                }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={createProject}
                  style={{
                    padding: "10px 24px",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                >
                  🚀 Crear
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  style={{
                    padding: "10px 24px",
                    background: "rgba(255,255,255,0.1)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div style={{ color: "#10b981", textAlign: "center", padding: 40 }}>
              🎧 Cargando proyectos...
            </div>
          ) : projects.length === 0 ? (
            <div style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: 16,
              padding: 60,
              textAlign: "center",
              border: "1px dashed rgba(16, 185, 129, 0.2)",
            }}>
              <p style={{ color: "#10b981", fontSize: 18, margin: 0 }}>
                🎹 No tienes proyectos aún. ¡Crea tu primer proyecto musical!
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 20,
            }}>
              {projects.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 16,
                    padding: 20,
                    border: "1px solid rgba(16, 185, 129, 0.1)",
                    transition: "transform 0.2s, box-shadow 0.3s",
                    position: "relative",
                  }}
                >
                  <Link
                    href={`/project/${p.id}`}
                    style={{ textDecoration: "none", color: "inherit", display: "block" }}
                  >
                    <h3 style={{ color: "white", margin: 0, fontSize: 18 }}>
                      🎸 {p.name}
                    </h3>
                    <p style={{ color: "#9ca3af", fontSize: 14, margin: "8px 0 0 0" }}>
                      {p.description || "Sin descripción"}
                    </p>
                    <div style={{ color: "#10b981", fontSize: 12, marginTop: 12 }}>
                      📅 {new Date(p.created_at).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
                      {p.is_public ? "🌍 Público" : "🔒 Privado"}
                    </div>
                  </Link>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      deleteProject(p.id, p.name)
                    }}
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      background: "rgba(239, 68, 68, 0.15)",
                      border: "none",
                      borderRadius: 8,
                      padding: "6px 10px",
                      cursor: "pointer",
                      fontSize: 16,
                      color: "#ef4444",
                    }}
                    title="Eliminar proyecto"
                  >
                    🗑️
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      downloadProject(p.id, p.name)
                    }}
                    style={{
                      position: "absolute",
                      bottom: 12,
                      right: 50,
                      background: "rgba(16, 185, 129, 0.15)",
                      border: "none",
                      borderRadius: 8,
                      padding: "4px 10px",
                      cursor: "pointer",
                      fontSize: 14,
                      color: "#10b981",
                    }}
                    title="Descargar proyecto"
                  >
                    📥
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
