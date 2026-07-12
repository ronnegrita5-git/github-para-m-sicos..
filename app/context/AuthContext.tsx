"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { User } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Función para actualizar el estado del usuario
  const updateUser = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      const currentUser = data?.session?.user ?? null
      console.log('👤 Usuario actualizado:', currentUser?.email || 'No hay usuario')
      setUser(currentUser)
    } catch (error) {
      console.error('Error actualizando usuario:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Cargar sesión inicial
    updateUser()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Evento:', event)
      
      // Actualizar el estado del usuario
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null)
        console.log('✅ Usuario logueado:', session?.user?.email)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        console.log('❌ Usuario deslogueado')
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

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
      console.error('❌ Error:', error)
      alert('Error al iniciar sesión con Google')
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    setUser(data.user)
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      console.log('✅ Sesión cerrada')
      window.location.href = '/'
    } catch (error) {
      console.error('Error cerrando sesión:', error)
    }
  }

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) throw error
      setUser(data?.session?.user ?? null)
      console.log('✅ Sesión refrescada')
    } catch (error) {
      console.error('Error refrescando sesión:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
}
