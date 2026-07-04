"use client"

import { use, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ProjectPage({ params }: any) {
  const { id } = use(params)

  const [project, setProject] = useState<any>(null)
  const [tracks, setTracks] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadProject()
    loadTracks()
  }, [id])

  async function loadProject() {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single()

    setProject(data)
  }

  async function loadTracks() {
    const { data } = await supabase
      .from("tracks")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: true })

    setTracks(data || [])
  }

  async function addTrack() {
    const name = prompt("Nombre de la pista 🎵")
    if (!name) return

    await supabase.from("tracks").insert([
      {
        name,
        project_id: id,
      },
    ])

    loadTracks()
  }

  async function uploadAudio(e: any, trackId: string) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    const fileName = `${id}/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from("audio")
      .upload(fileName, file)

    if (uploadError) {
      console.log("UPLOAD ERROR:", uploadError)
      setUploading(false)
      return
    }

    const { data } = supabase.storage
      .from("audio")
      .getPublicUrl(fileName)

    const audioUrl = data.publicUrl

    await supabase
      .from("tracks")
      .update({ audio_url: audioUrl })
      .eq("id", trackId)

    setUploading(false)
    loadTracks()
  }

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>🎵 {project?.name || "Cargando..."}</h1>

      <button onClick={addTrack}>
        + Añadir pista
      </button>

      <div style={{ marginTop: 20 }}>
        {tracks.length === 0 && <p>No hay pistas todavía...</p>}

        {tracks.map((t) => (
          <div
            key={t.id}
            style={{
              padding: 10,
              border: "1px solid #ccc",
              marginTop: 10,
              borderRadius: 8,
            }}
          >
            <div>🎧 {t.name}</div>

            <div style={{ marginTop: 10 }}>
              {!t.audio_url ? (
                <>
                  <input
                    type="file"
                    accept="audio/mpeg"
                    onChange={(e) => uploadAudio(e, t.id)}
                  />
                  {uploading && <p>Subiendo...</p>}
                </>
              ) : (
                <audio controls src={t.audio_url} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}