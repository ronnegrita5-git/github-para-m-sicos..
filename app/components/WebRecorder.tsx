"use client"

import { useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "../context/AuthContext"

interface WebRecorderProps {
  projectId: string
  trackId: string
  onUploadComplete?: () => void
}

export default function WebRecorder({ projectId, trackId, onUploadComplete }: WebRecorderProps) {
  const { user } = useAuth()
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Solicitar acceso al micrófono y empezar a grabar
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' })
        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)
        // Detener todas las pistas del stream
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorderRef.current.start()
      setIsRecording(true)
      setIsPaused(false)
      setError(null)
      
      // Timer de grabación
      let seconds = 0
      timerRef.current = setInterval(() => {
        seconds++
        setRecordingTime(seconds)
      }, 1000)
      
    } catch (err: any) {
      console.error("Error al acceder al micrófono:", err)
      setError("No se pudo acceder al micrófono. Permite el acceso desde el navegador.")
    }
  }

  // Pausar grabación
  function pauseRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  // Reanudar grabación
  function resumeRecording() {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    }
  }

  // Detener grabación
  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  // Cancelar grabación
  function cancelRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
    if (audioURL) {
      URL.revokeObjectURL(audioURL)
      setAudioURL(null)
    }
    setRecordingTime(0)
  }

  // Subir grabación a Supabase
  async function uploadRecording() {
    if (!audioURL || !user) return
    
    setIsUploading(true)
    setError(null)
    
    try {
      // Obtener el blob desde la URL
      const response = await fetch(audioURL)
      const blob = await response.blob()
      
      const fileName = `${projectId}/${Date.now()}-web-recording.mp3`
      
      // Subir a Storage
      const { error: uploadError } = await supabase.storage
        .from("audio")
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (uploadError) throw uploadError
      
      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from("audio")
        .getPublicUrl(fileName)
      
      const audioUrl = urlData.publicUrl
      
      // Actualizar la pista
      const { error: updateError } = await supabase
        .from("tracks")
        .update({ 
          audio_url: audioUrl,
          source: 'web'
        })
        .eq("id", trackId)
      
      if (updateError) throw updateError
      
      // Limpiar
      URL.revokeObjectURL(audioURL)
      setAudioURL(null)
      setRecordingTime(0)
      
      if (onUploadComplete) onUploadComplete()
      
      alert("✅ Grabación subida correctamente")
      
    } catch (err: any) {
      console.error("Error al subir:", err)
      setError(err.message || "Error al subir la grabación")
    } finally {
      setIsUploading(false)
    }
  }

  // Formatear tiempo (mm:ss)
  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div style={{ marginTop: 10 }}>
      {/* Botón para empezar a grabar */}
      {!isRecording && !audioURL && (
        <button
          onClick={startRecording}
          style={{
            padding: "8px 16px",
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#c82333"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#dc3545"
          }}
        >
          🎙️ Grabar desde web
        </button>
      )}

      {/* Controles de grabación */}
      {isRecording && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
          padding: "8px 12px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.1)",
        }}>
          <span style={{
            color: "#dc3545",
            fontWeight: "bold",
            fontSize: 16,
          }}>
            🔴 {formatTime(recordingTime)}
          </span>
          
          {isPaused ? (
            <button
              onClick={resumeRecording}
              style={{
                padding: "4px 12px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              ▶️ Reanudar
            </button>
          ) : (
            <button
              onClick={pauseRecording}
              style={{
                padding: "4px 12px",
                background: "#ffc107",
                color: "#333",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              ⏸️ Pausar
            </button>
          )}
          
          <button
            onClick={stopRecording}
            style={{
              padding: "4px 12px",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            ⏹️ Detener
          </button>
        </div>
      )}

      {/* Vista previa y subida */}
      {audioURL && (
        <div style={{
          marginTop: 10,
          padding: "12px 16px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: 8,
          border: "1px solid rgba(16, 185, 129, 0.2)",
        }}>
          <audio controls src={audioURL} style={{ width: "100%", maxWidth: 300 }} />
          <div style={{
            display: "flex",
            gap: 10,
            marginTop: 10,
            flexWrap: "wrap",
          }}>
            <button
              onClick={uploadRecording}
              disabled={isUploading}
              style={{
                padding: "8px 16px",
                background: isUploading ? "#6c757d" : "linear-gradient(135deg, #10b981, #059669)",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: isUploading ? "default" : "pointer",
                fontSize: 14,
                transition: "all 0.2s ease",
              }}
            >
              {isUploading ? "⏳ Subiendo..." : "📤 Subir grabación"}
            </button>
            <button
              onClick={cancelRecording}
              style={{
                padding: "8px 16px",
                background: "rgba(239, 68, 68, 0.15)",
                color: "#ef4444",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 14,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.25)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)"
              }}
            >
              ❌ Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Mensajes de error */}
      {error && (
        <p style={{
          color: "#ef4444",
          fontSize: 14,
          marginTop: 10,
          padding: "8px 12px",
          background: "rgba(239, 68, 68, 0.1)",
          borderRadius: 8,
          border: "1px solid rgba(239, 68, 68, 0.2)",
        }}>
          ❌ {error}
        </p>
      )}
    </div>
  )
}
