import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  
  // Si hay error, redirigir al login
  if (error) {
    return NextResponse.redirect(new URL('/login?error=' + error, request.url))
  }

  // Si hay código, redirigir al login para que el cliente procese el token
  // El cliente procesará el token desde el fragmento
  if (code) {
    // Redirigir al login, el cliente procesará el token
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si no hay nada, redirigir al login
  return NextResponse.redirect(new URL('/login?error=no-credentials', request.url))
}
