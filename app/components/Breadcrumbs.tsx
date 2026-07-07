"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Breadcrumbs() {
  const pathname = usePathname()
  
  // Si estamos en la página de inicio, no mostramos breadcrumbs
  if (pathname === "/") return null
  
  // Dividir la URL en segmentos
  const segments = pathname.split("/").filter(Boolean)
  
  // Mapear segmentos a nombres legibles
  const getLabel = (segment: string, index: number, segments: string[]) => {
    // Si es un ID (formato UUID), mostrar "Detalle"
    if (segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
      // Si el segmento anterior es "project", es un proyecto
      if (segments[index - 1] === "project") return "Proyecto"
      // Si el segmento anterior es "user", es un usuario
      if (segments[index - 1] === "user") return "Perfil"
      return "Detalle"
    }
    
    // Nombres de las rutas principales
    const labels: Record<string, string> = {
      "dashboard": "Dashboard",
      "explore": "Explorar",
      "project": "Proyectos",
      "user": "Usuarios",
      "login": "Iniciar sesión",
      "profile": "Mi perfil",
      "pr": "Pull Requests",
    }
    
    return labels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
  }
  
  // Construir la ruta para cada segmento
  const buildPath = (index: number) => {
    return "/" + segments.slice(0, index + 1).join("/")
  }
  
  return (
    <nav style={{
      padding: "12px 0",
      fontSize: 14,
      color: "#888",
      maxWidth: 1200,
      margin: "0 auto",
    }}>
      <Link href="/" style={{ color: "#a78bfa", textDecoration: "none" }}>
        Inicio
      </Link>
      
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1
        const label = getLabel(segment, index, segments)
        const path = buildPath(index)
        
        // Si es un ID, mostramos el label sin enlace
        if (segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
          return (
            <span key={index} style={{ display: "inline-flex", alignItems: "center" }}>
              <span style={{ margin: "0 8px", color: "#555" }}>›</span>
              <span style={{ color: isLast ? "white" : "#a78bfa" }}>
                {label}
              </span>
            </span>
          )
        }
        
        return (
          <span key={index} style={{ display: "inline-flex", alignItems: "center" }}>
            <span style={{ margin: "0 8px", color: "#555" }}>›</span>
            {isLast ? (
              <span style={{ color: "white" }}>{label}</span>
            ) : (
              <Link href={path} style={{ color: "#a78bfa", textDecoration: "none" }}>
                {label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
