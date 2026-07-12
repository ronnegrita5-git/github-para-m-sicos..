"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@supabase/supabase-js'
import { User } from '@supabase/supabase-js'

// Cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Tipo del contexto
interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | null>(null)

// Hook personalizado (SIN use())
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}

// Proveedor
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Cargar sesión al montar
  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        setUser(data?.session?.user ?? null)
      } catch (error) {
        console.error('Error al cargar sesión:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSession()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Evento de auth:', event)
      if (event === 'SIGNED_OUT') {
        setUser(null)
      } else if (session) {
        setUser(session.user)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Funciones de autenticación
  const signInWithGoogle = async () => {
    try {
      const origin = window.location.origin
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`
        }
      })
      if (error) throw error
      if (data?.url) window.location.href = data.url
    } catch (error) {
      console.error('Error en login con Google:', error)
      alert('Error al iniciar sesión con Google')
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      setUser(data.user)
    } catch (error) {
      console.error('Error en login con email:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
