"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "../context/AuthContext"
import Link from "next/link"

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
}

interface CommentSectionProps {
  projectId: string
}

export default function CommentSection({ projectId }: CommentSectionProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [userNames, setUserNames] = useState<Record<string, string>>({})
  const [projectOwnerId, setProjectOwnerId] = useState<string | null>(null)

  useEffect(() => {
    loadComments()
    loadProjectOwner()
  }, [projectId])

  async function loadProjectOwner() {
    const { data } = await supabase
      .from("projects")
      .select("user_id")
      .eq("id", projectId)
      .single()
    
    if (data) {
      setProjectOwnerId(data.user_id)
    }
  }

  async function loadComments() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error al cargar comentarios:", error)
        setComments([])
        setLoading(false)
        return
      }

      setComments(data || [])

      if (data && data.length > 0) {
        const userIds = [...new Set(data.map((c) => c.user_id))]
        const names: Record<string, string> = {}
        
        for (const userId of userIds) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", userId)
            .single()
          
          if (profileData) {
            names[userId] = profileData.full_name || "Usuario"
          } else {
            names[userId] = "Usuario"
          }
        }
        
        setUserNames(names)
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) {
      alert("Debes iniciar sesión para comentar")
      return
    }
    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from("comments")
        .insert([
          {
            project_id: projectId,
            user_id: user.id,
            content: newComment.trim(),
          },
        ])

      if (error) {
        console.error("Error al enviar comentario:", error)
        alert("Error al enviar comentario: " + error.message)
      } else {
        setNewComment("")
        
        if (projectOwnerId && projectOwnerId !== user.id) {
          await supabase.from("notifications").insert([
            {
              user_id: projectOwnerId,
              type: "comment",
              actor_id: user.id,
              project_id: projectId,
            },
          ])
        }
        
        loadComments()
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ marginTop: 30 }}>
      <h3 style={{ color: "#333", marginBottom: 15 }}>
        💬 Comentarios ({comments.length})
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #ccc",
                fontSize: 14,
              }}
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              style={{
                padding: "10px 20px",
                background: submitting ? "#6c757d" : "#7c3aed",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: submitting ? "default" : "pointer",
                fontSize: 14,
              }}
            >
              {submitting ? "Enviando..." : "Comentar"}
            </button>
          </div>
        </form>
      ) : (
        <p style={{ color: "#666", marginBottom: 20 }}>
          <Link href="/login" style={{ color: "#2b8a3e" }}>Inicia sesión</Link> para comentar
        </p>
      )}

      {loading ? (
        <p style={{ color: "#888" }}>Cargando comentarios...</p>
      ) : comments.length === 0 ? (
        <p style={{ color: "#888" }}>No hay comentarios aún. ¡Sé el primero!</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                padding: "12px 16px",
                background: "#f8f9fa",
                borderRadius: 10,
                border: "1px solid #e0e0e0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "#7c3aed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 14,
                  }}
                >
                  {(userNames[comment.user_id] || "U").charAt(0)}
                </div>
                <div>
                  <Link href={`/user/${comment.user_id}`} style={{ fontWeight: "bold", color: "#2b8a3e", textDecoration: "none" }}>
                    {userNames[comment.user_id] || "Usuario"}
                  </Link>
                  <span style={{ fontSize: 12, color: "#888", marginLeft: 10 }}>
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p style={{ margin: "8px 0 0 40px", color: "#333" }}>
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
