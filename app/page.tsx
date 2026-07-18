"use client"

import { useAuth } from "@/app/context/AuthContext"
import Link from "next/link"

export default function Home() {
  const { user } = useAuth()

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "black",
      color: "white"
    }}>
      {/* Menú lateral */}
      <aside style={{
        width: 240,
        padding: "24px 16px",
        background: "rgba(255,255,255,0.03)",
        borderRight: "1px solid rgba(255,255,255,0.1)"
      }}>
        <div style={{
          padding: "0 8px 16px",
          fontSize: 20,
          fontWeight: "bold",
          color: "#10b981"
        }}>
          🎵 Music Collab
        </div>
        <Link href="/" style={{
          padding: "10px 12px",
          borderRadius: 8,
          background: "rgba(16, 185, 129, 0.1)",
          color: "#10b981",
          textDecoration: "none",
          display: "block"
        }}>
          🏠 Inicio
        </Link>
        <Link href="/explore" style={{
          padding: "10px 12px",
          borderRadius: 8,
          color: "#9ca3af",
          textDecoration: "none",
          display: "block"
        }}>
          📁 Proyectos
        </Link>
        <Link href="/jam-web" style={{
          padding: "10px 12px",
          borderRadius: 8,
          color: "#9ca3af",
          textDecoration: "none",
          display: "block"
        }}>
          🎵 Jam Web
        </Link>
        {user && (
          <Link href="/profile" style={{
            padding: "10px 12px",
            borderRadius: 8,
            color: "#9ca3af",
            textDecoration: "none",
            display: "block"
          }}>
            👤 Mi perfil
          </Link>
        )}
        {user && (
          <Link href="/admin" style={{
            padding: "10px 12px",
            borderRadius: 8,
            color: "#9ca3af",
            textDecoration: "none",
            display: "block"
          }}>
            🛡️ Admin
          </Link>
        )}
        {!user && (
          <Link href="/login" style={{
            padding: "10px 12px",
            borderRadius: 8,
            background: "#10b981",
            color: "white",
            textDecoration: "none",
            display: "block",
            textAlign: "center",
            marginTop: "auto",
            fontWeight: "bold"
          }}>
            🔑 Iniciar sesión
          </Link>
        )}
      </aside>

      {/* Contenido principal */}
      <main style={{
        flex: 1,
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <h1 style={{ fontSize: 48, marginBottom: 8 }}>🎵</h1>
        <h2 style={{ fontSize: 32, marginBottom: 16 }}>GitHub para Músicos</h2>
        <p style={{ color: "#9ca3af", fontSize: 18, marginBottom: 24 }}>
          {user ? `👋 Bienvenido, ${user.email}` : "Colabora con otros músicos en tiempo real"}
        </p>
        
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/explore" style={{
            padding: "12px 24px",
            background: "#10b981",
            color: "white",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: "bold"
          }}>
            📁 Explorar proyectos
          </Link>
          
          {/* 🎵 BOTÓN DE JAM WEB */}
          <Link href="/jam-web" style={{
            padding: "12px 24px",
            background: "rgba(16, 185, 129, 0.15)",
            color: "#10b981",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: "bold",
            border: "1px solid rgba(16, 185, 129, 0.3)"
          }}>
            🎵 Jam Session Web
          </Link>
          
          {!user && (
            <Link href="/login" style={{
              padding: "12px 24px",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              borderRadius: 8,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              🔑 Iniciar sesión
            </Link>
          )}
        </div>
        
        <p style={{ color: "#6b7280", fontSize: 14, marginTop: 24 }}>
          🎸 Crea proyectos, colabora y haz música en vivo
        </p>
      </main>
    </div>
  )
}
