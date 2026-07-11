"use client"

import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      background: 'rgba(0,0,0,0.8)',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      <Link href="/" style={{ color: 'white', fontSize: 20, fontWeight: 'bold', textDecoration: 'none' }}>
        🎵 Music Collab
      </Link>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ color: '#10b981' }}>👤 {user.email}</span>
            <button
              onClick={signOut}
              style={{
                padding: '8px 16px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer'
              }}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link
            href="/login"
            style={{
              padding: '8px 16px',
              background: '#10b981',
              color: 'white',
              borderRadius: 6,
              textDecoration: 'none'
            }}
          >
            Iniciar sesión
          </Link>
        )}
      </div>
    </nav>
  )
}
