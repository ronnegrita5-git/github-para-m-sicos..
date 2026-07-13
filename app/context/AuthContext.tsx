"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    return {
      user: null,
      loading: false,
      signInWithGoogle: async () => {},
      signInWithEmail: async () => {},
      signOut: async () => {},
    } as AuthContextType
  }
  return context
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ✅ Procesar el token si está en el fragmento de la URL
    const processHashToken = async () => {
      if (typeof window !== 'undefined' && window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        
        if (accessToken) {
          console.log('🔑 Token encontrado en el fragmento, estableciendo sesión...')
          try {
            const { data, error } = await supabase!.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            })
            
            if (error) {
              console.error('❌ Error estableciendo sesión:', error)
              // Limpiar el hash de la URL
              window.history.replaceState(null, '', window.location.pathname)
              return
            }
            
            console.log('✅ Sesión establecida para:', data.user?.email)
            setUser(data.user)
            // Limpiar el hash de la URL
            window.history.replaceState(null, '', window.location.pathname)
            // Redirigir a /explore
            window.location.href = '/explore'
          } catch (error) {
            console.error('❌ Error procesando token:', error)
          }
        }
      }
    }

    const loadSession = async () => {
      try {
        const { data, error } = await supabase!.auth.getSession()
        if (error) throw error
        setUser(data?.session?.user ?? null)
        console.log('🔐 Sesión cargada:', data?.session?.user?.email || 'No hay sesión')
      } catch (error) {
        console.error('Error al cargar sesión:', error)
      } finally {
        setLoading(false)
      }
    }

    // Primero procesar el token del hash
    processHashToken()
    // Luego cargar la sesión
    loadSession()

    const { data: { subscription } } = supabase!.auth.onAuthStateChange((event, session) => {
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

  const signInWithGoogle = async () => {
    try {
      const origin = window.location.origin
      const { data, error } = await supabase!.auth.signInWithOAuth({
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
      const { data, error } = await supabase!.auth.signInWithPassword({ email, password })
      if (error) throw error
      setUser(data.user)
    } catch (error) {
      console.error('Error en login con email:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await supabase!.auth.signOut()
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
