"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "../context/AuthContext"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NotificationBell() {
  const { user } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [actorNames, setActorNames] = useState<Record<string, string>>({})
  const [projectNames, setProjectNames] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) {
      loadNotifications()
    }
  }, [user])

  async function loadNotifications() {
    if (!user) return

    try {
      // 1. Cargar notificaciones
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20)

      if (error) {
        console.error("Error al cargar notificaciones:", error)
        return
      }

      setNotifications(data || [])
      setUnreadCount(data?.filter((n) => !n.read).length || 0)

      // 2. Cargar nombres de los actores
      if (data && data.length > 0) {
        const actorIds = [...new Set(data.map((n) => n.actor_id).filter(Boolean))]
        const names: Record<string, string> = {}
        
        for (const actorId of actorIds) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", actorId)
            .single()
          
          if (profileData) {
            names[actorId] = profileData.full_name || "Usuario"
          } else {
            names[actorId] = "Usuario"
          }
        }
        setActorNames(names)

        // 3. Cargar nombres de los proyectos
        const projectIds = [...new Set(data.map((n) => n.project_id).filter(Boolean))]
        const projNames: Record<string, string> = {}
        
        for (const projectId of projectIds) {
          const { data: projectData } = await supabase
            .from("projects")
            .select("name")
            .eq("id", projectId)
            .single()
          
          if (projectData) {
            projNames[projectId] = projectData.name || "Proyecto"
          }
        }
        setProjectNames(projNames)
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(notificationId: string) {
    try {
      await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId)
      
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error al marcar como leída:", error)
    }
  }

  async function markAllAsRead() {
    try {
      await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user?.id)
        .eq("read", false)
      
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  function getNotificationText(notification: any) {
    const actorName = actorNames[notification.actor_id] || "Alguien"
    const projectName = projectNames[notification.project_id] || "un proyecto"
    
    switch (notification.type) {
      case "like":
        return `${actorName} le dio like a tu proyecto "${projectName}"`
      case "comment":
        return `${actorName} comentó en tu proyecto "${projectName}"`
      case "follow":
        return `${actorName} comenzó a seguirte`
      case "fork":
        return `${actorName} hizo fork de tu proyecto "${projectName}"`
      default:
        return "Nueva notificación"
    }
  }

  function getNotificationIcon(type: string) {
    switch (type) {
      case "like": return "❤️"
      case "comment": return "💬"
      case "follow": return "👤"
      case "fork": return "🔀"
      default: return "🔔"
    }
  }

  if (!user) return null

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 20,
          position: "relative",
          color: "#c4b5fd",
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -5,
              right: -5,
              background: "#ef4444",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: 10,
              fontWeight: "bold",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "30px",
            right: 0,
            width: 380,
            maxHeight: 400,
            overflowY: "auto",
            background: "white",
            borderRadius: 12,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            border: "1px solid #e0e0e0",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4 style={{ margin: 0, fontSize: 16 }}>Notificaciones</h4>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: "none",
                  border: "none",
                  color: "#7c3aed",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          {loading ? (
            <div style={{ padding: 20, textAlign: "center", color: "#888" }}>
              Cargando...
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: 20, textAlign: "center", color: "#888" }}>
              No hay notificaciones
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #f0f0f0",
                  background: n.read ? "white" : "#f8f4ff",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onClick={() => {
                  markAsRead(n.id)
                  if (n.project_id) {
                    router.push(`/project/${n.project_id}`)
                  }
                  setIsOpen(false)
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f0ebff"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = n.read ? "white" : "#f8f4ff"
                }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 18 }}>{getNotificationIcon(n.type)}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 14, color: "#333" }}>
                      {getNotificationText(n)}
                    </p>
                    <span style={{ fontSize: 11, color: "#888" }}>
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {!n.read && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#7c3aed",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
