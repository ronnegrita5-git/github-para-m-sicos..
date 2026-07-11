import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (error) {
      console.error('Error intercambiando código:', error)
    }
  }
  
  // ⭐ REDIRIGIR A LA URL DE PRODUCCIÓN ⭐
  return NextResponse.redirect('https://github-para-musicos-v1yk.vercel.app/dashboard')
}
