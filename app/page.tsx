"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.log(error)
      return
    }

    setProjects(data || [])
  }

  async function createProject() {
    const name = prompt("Nombre del proyecto 🎵")
    if (!name) return

    const { error } = await supabase
      .from("projects")
      .insert([{ name }])

    if (error) {
      console.log(error)
      return
    }

    loadProjects()
  }

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>🎵 Music Collab</h1>

      <button onClick={createProject}>
        + Nuevo proyecto
      </button>

      <div style={{ marginTop: 20 }}>
        {projects.length === 0 && (
          <p>No hay proyectos todavía...</p>
        )}

        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/project/${p.id}`}
            style={{
              display: "block",
              padding: 10,
              border: "1px solid #ccc",
              borderRadius: 8,
              marginTop: 10,
              textDecoration: "none",
              color: "black",
            }}
          >
            🎼 {p.name}
          </Link>
        ))}
      </div>
    </div>
  )
}