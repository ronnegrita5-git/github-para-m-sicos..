"use client"

import { useAuth } from "../context/AuthContext"
import Link from "next/link"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const { user, loading, signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [showResetModal, setShowResetModal] = useState(false)
  const [resetMessage, setResetMessage] = useState<string | null>(null)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      window.location.href = '/explore'
    }
  }, [user])

  if (loading) {
    return <div style={{ color: 'white', padding: 40 }}>Cargando...</div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoadingSubmit(true)

    try {
      await signIn(email, password)
    } catch (err) {
      setError('❌ ' + (err as Error).message)
    } finally {
      setLoadingSubmit(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail) {
      setResetMessage("❌ Introduce tu correo electrónico")
      return
    }

    setResetLoading(true)
    setResetMessage(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: 'https://github-para-musicos-jet.vercel.app/update-password',
      })

      if (error) throw error

      setResetSuccess(true)
      setResetMessage("✅ Te hemos enviado un enlace para restablecer tu contraseña. Revisa tu correo.")
    } catch (error) {
      console.error("Error en recuperación:", error)
      setResetMessage("❌ Error al enviar el correo de recuperación")
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#0a0a0a',
      color: 'white',
      alignItems: 'center',
      justifyContent: 'center'
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
        <h1 style={{ fontSize: 48, marginBottom: 8 }}>🎵</h1>
        <h2 style={{ marginBottom: 24 }}>Iniciar sesión</h2>

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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16, textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#9ca3af' }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <div style={{ marginBottom: 16, textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#9ca3af' }}>
              Contraseña
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

          <div style={{ textAlign: 'right', marginBottom: 24 }}>
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#6b7280',
                fontSize: 13,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            type="submit"
            disabled={loadingSubmit}
            style={{
              width: '100%',
              padding: '14px',
              background: loadingSubmit ? '#444' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 'bold',
              cursor: loadingSubmit ? 'not-allowed' : 'pointer'
            }}
          >
            {loadingSubmit ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <div style={{ marginTop: 16, color: '#6b7280', fontSize: 14 }}>
          ¿No tienes cuenta? <Link href="/register" style={{ color: '#10b981' }}>Regístrate</Link>
        </div>
      </div>

      {/* Modal de recuperación de contraseña */}
      {showResetModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            maxWidth: 400,
            width: '100%',
            padding: 40,
            borderRadius: 16,
            background: '#1a1a1a',
            border: '1px solid #333',
            textAlign: 'center'
          }}>
            <h2 style={{ marginBottom: 16 }}>🔑 Recuperar contraseña</h2>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>
              Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            {resetMessage && (
              <div style={{
                padding: 10,
                marginBottom: 16,
                background: resetSuccess ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                color: resetSuccess ? '#10b981' : '#ef4444',
                borderRadius: 8,
                fontSize: 14
              }}>
                {resetMessage}
              </div>
            )}

            {!resetSuccess && (
              <form onSubmit={handleResetPassword}>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Tu correo electrónico"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid #333',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    fontSize: 16,
                    marginBottom: 16
                  }}
                />
                <button
                  type="submit"
                  disabled={resetLoading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: resetLoading ? '#444' : '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 'bold',
                    cursor: resetLoading ? 'not-allowed' : 'pointer',
                    marginBottom: 12
                  }}
                >
                  {resetLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                </button>
              </form>
            )}

            <button
              onClick={() => {
                setShowResetModal(false)
                setResetMessage(null)
                setResetSuccess(false)
                setResetEmail("")
              }}
              style={{
                background: 'transparent',
                border: '1px solid #444',
                color: 'white',
                padding: '8px 24px',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              {resetSuccess ? 'Cerrar' : 'Cancelar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
