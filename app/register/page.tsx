"use client"

import { useAuth } from '../context/AuthContext'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loadingSubmit, setLoadingSubmit] = useState(false)

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Cargando...</div>
  }

  if (user) {
    router.push('/dashboard')
    return null
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('❌ Las contraseñas no coinciden')
      return
    }
    
    if (password.length < 6) {
      setError('❌ La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoadingSubmit(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
      
      if (data?.user) {
        alert('✅ ¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.')
        router.push('/login')
      }
    } catch (err) {
      setError('❌ ' + (err as Error).message)
    } finally {
      setLoadingSubmit(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#0a0a0a',
      color: 'white'
    }}>
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
          color: '#9ca3af',
          textDecoration: 'none',
          display: 'block'
        }}>
          🔑 Iniciar sesión
        </Link>
        <Link href="/register" style={{
          padding: '10px 12px',
          borderRadius: 8,
          background: 'rgba(16, 185, 129, 0.1)',
          color: '#10b981',
          textDecoration: 'none',
          display: 'block'
        }}>
          📝 Registrarse
        </Link>
      </aside>

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
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h1 style={{ fontSize: 32, marginBottom: 8, textAlign: 'center' }}>🎵</h1>
          <h2 style={{ marginBottom: 24, textAlign: 'center' }}>Crear cuenta</h2>
          
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              padding: '10px',
              borderRadius: 8,
              marginBottom: 16,
              fontSize: 14,
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            onClick={signInWithGoogle}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px',
              background: 'white',
              color: 'rgba(0,0,0,0.54)',
              border: '1px solid #dadce0',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: 20
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fillRule="evenodd">
                <path d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z" fill="#EA4335"/>
                <path d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z" fill="#4285F4"/>
                <path d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.3-1.78L.96 4.96A9.34 9.34 0 0 0 0 9c0 1.51.36 2.94.96 4.22l2.92-2.44z" fill="#FBBC05"/>
                <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.85-3.12.85-2.38 0-4.4-1.57-5.12-3.82L.96 13.22C2.44 16.02 5.48 18 9 18z" fill="#34A853"/>
                <path d="M0 0h18v18H0z" fill="none"/>
              </g>
            </svg>
            Registrarse con Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, color: '#666' }}>
            <hr style={{ flex: 1, borderColor: '#333' }} />
            <span>o</span>
            <hr style={{ flex: 1, borderColor: '#333' }} />
          </div>

          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
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
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
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
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
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
              disabled={loadingSubmit}
              style={{
                width: '100%',
                padding: '14px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 'bold',
                cursor: 'pointer',
                opacity: loadingSubmit ? 0.6 : 1
              }}
            >
              {loadingSubmit ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          <div style={{ marginTop: 16, textAlign: 'center', color: '#6b7280', fontSize: 14 }}>
            ¿Ya tienes cuenta? <Link href="/login" style={{ color: '#10b981' }}>Inicia sesión</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
