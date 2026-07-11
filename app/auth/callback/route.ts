import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }
  
  return NextResponse.redirect('https://github-para-musicos-jet.vercel.app/dashboard')
}
