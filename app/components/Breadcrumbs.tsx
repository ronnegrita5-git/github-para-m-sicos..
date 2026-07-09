"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Breadcrumbs() {
  const pathname = usePathname()
  
  if (pathname === "/") return null
  
  const segments = pathname.split("/").filter(Boolean)
  
  const getLabel = (segment: string, index: number, segments: string[]) => {
    if (segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
      if (segments[index - 1] === "project") return "Proyecto"
      if (segments[index - 1] === "user") return "Perfil"
      return "Detalle"
    }
    
    const labels: Record<string, string> = {
      "dashboard": "Dashboard",
      "explore": "Explorar",
      "project": "Proyectos",
      "user": "Usuarios",
      "login": "Iniciar sesión",
      "profile": "Mi perfil",
      "pr": "Pull Requests",
      "favorites": "Favoritos",
    }
    
    return labels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
  }
  
  const buildPath = (index: number) => {
    return "/" + segments.slice(0, index + 1).join("/")
  }
  
  return (
    <nav style={{
      padding: "16px 0 12px 70px",  // 👈 Desplazado 70px a la derecha
      fontSize: 14,
      color: "#6b7280",
      maxWidth: 1200,
      margin: "0 auto",
      marginTop: "12px",
    }}>
      <Link href="/" style={{ color: "#10b981", textDecoration: "none" }}>
        Inicio
      </Link>
      
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1
        const label = getLabel(segment, index, segments)
        const path = buildPath(index)
        
        if (segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
          return (
            <span key={index} style={{ display: "inline-flex", alignItems: "center" }}>
              <span style={{ margin: "0 8px", color: "#374151" }}>›</span>
              <span style={{ color: isLast ? "#e5e5e5" : "#10b981" }}>
                {label}
              </span>
            </span>
          )
        }
        
        return (
          <span key={index} style={{ display: "inline-flex", alignItems: "center" }}>
            <span style={{ margin: "0 8px", color: "#374151" }}>›</span>
            {isLast ? (
              <span style={{ color: "#e5e5e5" }}>{label}</span>
            ) : (
              <Link href={path} style={{ color: "#10b981", textDecoration: "none" }}>
                {label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
