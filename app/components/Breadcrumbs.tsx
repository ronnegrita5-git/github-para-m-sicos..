"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const breadcrumbMap: Record<string, string> = {
  "login": "Iniciar sesión",
  "dashboard": "Dashboard",
  "jam": "Jam Session",
  "explore": "Explorar",
  "user": "Perfil"
}

export default function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  return (
    <div style={{
      padding: '12px 24px',
      fontSize: 14,
      color: '#888',
      borderBottom: '1px solid rgba(255,255,255,0.05)'
    }}>
      <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Inicio</Link>
      {segments.map((segment, index) => {
        const path = '/' + segments.slice(0, index + 1).join('/')
        const isLast = index === segments.length - 1
        const label = breadcrumbMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
        
        return (
          <span key={path}>
            <span style={{ margin: '0 8px' }}>/</span>
            {isLast ? (
              <span style={{ color: 'white' }}>{label}</span>
            ) : (
              <Link href={path} style={{ color: '#888', textDecoration: 'none' }}>{label}</Link>
            )}
          </span>
        )
      })}
    </div>
  )
}
