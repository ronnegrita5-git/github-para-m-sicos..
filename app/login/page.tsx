"use client"

import { useAuth } from '../context/AuthContext'
import Link from 'next/link'

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth()

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Cargando...</div>
  }

  if (user) {
    window.location.href = '/dashboard'
    return null
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'black',
      color: 'white'
    }}>
      {/* Barra lateral */}
      <aside style={{
        width: 240,
        padding: '24px 16px',
        background: 'rgba(255,255,255,0.03)',
        borderRight: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ padding: '0 8px 16px', fontSize: 20, fontWeight: 'bold', color: '#10b981' }}>
          🎵 Music Collab
        </div>
        <Link href="/" style={{
          padding: '10px 12px',
          borderRadius: 8,
          color: '#9ca3af',
          textDecoration: 'none',
          display: 'block'
        }}>
          🏠 Inicio
        </Link>
        <Link href="/login" style={{
          padding: '10px 12px',
          borderRadius: 8,
          background: 'rgba(16, 185, 129, 0.1)',
          color: '#10b981',
          textDecoration: 'none',
          display: 'block'
        }}>
          🔑 Iniciar sesión
        </Link>
      </aside>

      {/* Contenido principal */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
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
          <h2 style={{ marginBottom: 24 }}>GitHub para Músicos</h2>
          <p style={{ color: '#9ca3af', marginBottom: 30 }}>
            Inicia sesión para tocar en la jam session
          </p>
          <button
            onClick={signInWithGoogle}
            style={{
              width: '100%',
              padding: '14px',
              background: 'white',
              color: 'black',
              border: 'none',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🔴 Continuar con Google
          </button>
        </div>
      </main>
    </div>
  )
}
