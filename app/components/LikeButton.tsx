"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "../context/AuthContext"

interface LikeButtonProps {
  projectId: string
}

export default function LikeButton({ projectId }: LikeButtonProps) {
  const { user } = useAuth()
  const [likes, setLikes] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLikes()
  }, [projectId])

  async function loadLikes() {
    setLoading(true)
    
    try {
      // Contar likes
      const { count, error: countError } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("project_id", projectId)
      
      if (countError) {
        console.error("Error al contar likes:", countError)
      } else {
        setLikes(count || 0)
      }
      
      // Verificar si el usuario ya dio like
      if (user) {
        const { data, error } = await supabase
          .from("likes")
          .select("id")
          .eq("project_id", projectId)
          .eq("user_id", user.id)
          .maybeSingle()
        
        if (!error) {
          setHasLiked(!!data)
        }
      }
    } catch (error) {
      console.error("Error al cargar likes:", error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleLike() {
    if (!user) {
      alert("Debes iniciar sesión para dar like")
      return
    }

    try {
      if (hasLiked) {
        // Quitar like
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("project_id", projectId)
          .eq("user_id", user.id)
        
        if (error) throw error
        setLikes(likes - 1)
        setHasLiked(false)
      } else {
        // Dar like
        const { error } = await supabase
          .from("likes")
          .insert([{ project_id: projectId, user_id: user.id }])
        
        if (error) throw error
        setLikes(likes + 1)
        setHasLiked(true)
      }
    } catch (error: any) {
      console.error("Error al cambiar like:", error)
      alert("Error al procesar el like: " + error.message)
    }
  }

  if (loading) {
    return <span style={{ color: "#888", fontSize: 14 }}>Cargando...</span>
  }

  return (
    <button
      onClick={toggleLike}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: 16,
        color: hasLiked ? "#ef4444" : "#666",
        transition: "all 0.2s",
        padding: "8px 12px",
        borderRadius: 8,
        background: hasLiked ? "rgba(239, 68, 68, 0.1)" : "transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = hasLiked ? "rgba(239, 68, 68, 0.2)" : "rgba(0,0,0,0.05)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = hasLiked ? "rgba(239, 68, 68, 0.1)" : "transparent"
      }}
    >
      <span style={{ fontSize: 20 }}>
        {hasLiked ? "❤️" : "🤍"}
      </span>
      <span>{likes}</span>
    </button>
  )
}
