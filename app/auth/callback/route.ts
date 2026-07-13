import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  
  // Si hay error en la URL
  if (error) {
    console.error('❌ Error en callback:', error)
    return NextResponse.redirect(new URL(`/login?error=${error}`, request.url))
  }

  // Si no hay código, intentar extraer el token del fragmento
  if (!code) {
    // El token viene en el fragmento (#), no en los searchParams
    const hashParams = new URLSearchParams(url.hash.replace('#', '?'))
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')
    const expiresIn = hashParams.get('expires_in')
    
    if (accessToken) {
      console.log('🔑 Token encontrado en el fragmento, estableciendo sesión...')
      
      try {
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
        return NextResponse.redirect(new URL('/explore', request.url))
        
      } catch (error) {
        console.error('❌ Error procesando token:', error)
        return NextResponse.redirect(new URL('/login?error=token', request.url))
      }
    }
    
    // Si no hay ni código ni token
    console.warn('⚠️ No se recibieron credenciales en el callback')
    return NextResponse.redirect(new URL('/login?error=no-credentials', request.url))
  }

  // Flujo normal con código
  try {
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
      console.error('❌ Error intercambiando código:', error.message)
      return NextResponse.redirect(new URL('/login?error=auth', request.url))
    }

    console.log('✅ Sesión establecida para:', data.user?.email)
    return NextResponse.redirect(new URL('/explore', request.url))

  } catch (error) {
    console.error('❌ Error inesperado:', error)
    return NextResponse.redirect(new URL('/login?error=server', request.url))
  }
}
