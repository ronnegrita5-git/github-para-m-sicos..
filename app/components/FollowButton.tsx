"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "../context/AuthContext"

interface FollowButtonProps {
  userId: string
}

export default function FollowButton({ userId }: FollowButtonProps) {
  const { user } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [followersCount, setFollowersCount] = useState(0)

  useEffect(() => {
    loadFollowStatus()
    loadFollowersCount()
  }, [userId, user])

  async function loadFollowStatus() {
    if (!user || user.id === userId) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("follows")
        .select("id")
        .eq("follower_id", user.id)
        .eq("following_id", userId)
        .maybeSingle()

      if (!error) {
        setIsFollowing(!!data)
      }
    } catch (error) {
      console.error("Error al cargar estado de follow:", error)
    } finally {
      setLoading(false)
    }
  }

  async function loadFollowersCount() {
    try {
      const { count, error } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", userId)

      if (!error) {
        setFollowersCount(count || 0)
      }
    } catch (error) {
      console.error("Error al cargar seguidores:", error)
    }
  }

  async function toggleFollow() {
    if (!user) {
      alert("Debes iniciar sesión para seguir a otros usuarios")
      return
    }

    if (user.id === userId) {
      alert("No puedes seguirte a ti mismo")
      return
    }

    try {
      if (isFollowing) {
        // Dejar de seguir
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", userId)

        if (error) throw error
        setIsFollowing(false)
        setFollowersCount(followersCount - 1)
      } else {
        // Seguir
        const { error } = await supabase
          .from("follows")
          .insert([{ follower_id: user.id, following_id: userId }])

        if (error) throw error
        setIsFollowing(true)
        setFollowersCount(followersCount + 1)

        // Crear notificación
        await supabase.from("notifications").insert([
          {
            user_id: userId,
            type: "follow",
            actor_id: user.id,
          },
        ])
      }
    } catch (error: any) {
      console.error("Error:", error)
      alert("Error al procesar: " + error.message)
    }
  }

  // Si es el mismo usuario o no hay usuario, no mostrar botón
  if (!user || user.id === userId) {
    return (
      <span style={{ color: "#666", fontSize: 14 }}>
        👤 {followersCount} seguidores
      </span>
    )
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <button
        onClick={toggleFollow}
        disabled={loading}
        style={{
          padding: "8px 20px",
          background: isFollowing ? "#ef4444" : "#7c3aed",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: loading ? "default" : "pointer",
          fontSize: 14,
          fontWeight: "500",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.background = isFollowing ? "#dc2626" : "#6d28d9"
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.currentTarget.style.background = isFollowing ? "#ef4444" : "#7c3aed"
          }
        }}
      >
        {loading ? "Cargando..." : (isFollowing ? "Dejar de seguir" : "Seguir")}
      </button>
      <span style={{ color: "#666", fontSize: 14 }}>
        {followersCount} seguidores
      </span>
    </div>
  )
}
