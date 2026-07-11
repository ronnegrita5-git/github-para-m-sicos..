"use client"

import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#0a0a0a',
      color: 'white',
    }}>
      <div style={{
        maxWidth: 400,
        width: '100%',
        padding: 40,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>🎵</h1>
        <h2 style={{ marginBottom: 24, fontSize: 24 }}>GitHub para Músicos</h2>
        <p style={{ marginBottom: 32, color: '#9ca3af' }}>
          Inicia sesión para tocar en la jam session
        </p>
        <button
          onClick={() => {
            console.log('Botón clickeado')
            signInWithGoogle()
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            width: '100%',
            padding: '12px 24px',
            backgroundColor: 'white',
            color: '#1a1a1a',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <span style={{ fontSize: 20 }}>🔴</span>
          Continuar con Google
        </button>
      </div>
    </div>
  )
}
