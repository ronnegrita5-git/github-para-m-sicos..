"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Verificar que el token es válido
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        setError("❌ El enlace de recuperación no es válido o ha expirado.")
      }
    }
    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (password.length < 6) {
      setError("❌ La contraseña debe tener al menos 6 caracteres")
      return
    }

    if (password !== confirmPassword) {
      setError("❌ Las contraseñas no coinciden")
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      setSuccess(true)
      setMessage("✅ Contraseña actualizada correctamente")
      
      // Cerrar sesión después de 3 segundos
      setTimeout(() => {
        supabase.auth.signOut()
        window.location.href = "/login"
      }, 3000)
      
    } catch (error) {
      console.error("Error actualizando contraseña:", error)
      setError("❌ Error al actualizar la contraseña")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#0a0a0a',
      color: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: 400,
        width: '100%',
        padding: 40,
        borderRadius: 16,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: 48, marginBottom: 8 }}>🔑</h1>
        <h2 style={{ marginBottom: 24 }}>Nueva contraseña</h2>

        {error && (
          <div style={{
            padding: 10,
            marginBottom: 16,
            background: 'rgba(239,68,68,0.1)',
            color: '#ef4444',
            borderRadius: 8,
            fontSize: 14
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{
            padding: 10,
            marginBottom: 16,
            background: success ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            color: success ? '#10b981' : '#ef4444',
            borderRadius: 8,
            fontSize: 14
          }}>
            {message}
          </div>
        )}

        {!error || !error.includes("no es válido") ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16, textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: 6, color: '#9ca3af' }}>
                Nueva contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #333',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: 16
                }}
              />
            </div>

            <div style={{ marginBottom: 24, textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: 6, color: '#9ca3af' }}>
                Confirmar contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #333',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: 16
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#444' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>
        ) : (
          <Link href="/login" style={{ color: '#10b981' }}>
            Volver a iniciar sesión
          </Link>
        )}
      </div>
    </div>
  )
}
