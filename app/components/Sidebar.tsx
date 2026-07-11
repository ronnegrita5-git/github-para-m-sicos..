"use client"

import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { user } = useAuth()

  return (
    <aside style={{
      width: 200,
      padding: 20,
      background: 'rgba(0,0,0,0.5)',
      borderRight: '1px solid rgba(255,255,255,0.1)',
      minHeight: '100vh'
    }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>🏠 Inicio</Link>
        <Link href="/jam" style={{ color: 'white', textDecoration: 'none' }}>🎹 Jam Session</Link>
        <Link href="/explore" style={{ color: 'white', textDecoration: 'none' }}>🔍 Explorar</Link>
        {!user && (
          <Link href="/login" style={{
            color: '#10b981',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            🔑 Iniciar sesión
          </Link>
        )}
      </nav>
    </aside>
  )
}
