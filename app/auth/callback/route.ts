import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, hash } = new URL(request.url)
  
  // 1. Intentar obtener el código de autorización
  let code = searchParams.get('code')
  
  // 2. Si no hay código, intentar obtener el token del hash (fragmento)
  let accessToken: string | null = null
  let refreshToken: string | null = null
  
  if (!code && hash) {
    const params = new URLSearchParams(hash.replace('#', '?'))
    accessToken = params.get('access_token')
    refreshToken = params.get('refresh_token')
    console.log('🔑 Token encontrado en el hash:', accessToken ? 'Sí' : 'No')
  }
  
  // 3. Si tenemos un token, establecer la sesión manualmente
  if (accessToken) {
    try {
      console.log('🔄 Estableciendo sesión con token...')
      
      const cookieStore = cookies()
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options: any) {
              cookieStore.set({ name, value, ...options })
            },
            remove(name: string, options: any) {
              cookieStore.set({ name, value: '', ...options })
            },
          },
        }
      )
      
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || '',
      })
      
      if (error) {
        console.error('❌ Error estableciendo sesión:', error)
        return NextResponse.redirect(new URL('/login?error=session', request.url))
      }
      
      console.log('✅ Sesión establecida para:', data.user?.email)
      return NextResponse.redirect(new URL('/dashboard', request.url))
      
    } catch (error) {
      console.error('❌ Error inesperado:', error)
      return NextResponse.redirect(new URL('/login?error=server', request.url))
    }
  }
  
  // 4. Si tenemos código, intercambiarlo por sesión
  if (code) {
    try {
      console.log('🔄 Intercambiando código por sesión...')
      
      const cookieStore = cookies()
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options: any) {
              cookieStore.set({ name, value, ...options })
            },
            remove(name: string, options: any) {
              cookieStore.set({ name, value: '', ...options })
            },
          },
        }
      )
      
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('❌ Error intercambiando código:', error)
        return NextResponse.redirect(new URL('/login?error=auth', request.url))
      }
      
      console.log('✅ Sesión establecida para:', data.user?.email)
      return NextResponse.redirect(new URL('/dashboard', request.url))
      
    } catch (error) {
      console.error('❌ Error inesperado:', error)
      return NextResponse.redirect(new URL('/login?error=server', request.url))
    }
  }
  
  // 5. Si no hay ni código ni token
  console.warn('⚠️ No se recibieron credenciales en el callback')
  return NextResponse.redirect(new URL('/login?error=no-credentials', request.url))
}
