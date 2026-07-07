"use client"

import Link from "next/link"
import { useAuth } from "../context/AuthContext"
import NotificationBell from "./NotificationBell"

export default function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 0",
      borderBottom: "1px solid rgba(16, 185, 129, 0.15)",
      flexWrap: "wrap",
      gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 28 }}>🎵</span>
        <Link href="/" style={{ 
          color: "white", 
          textDecoration: "none", 
          fontSize: 20, 
          fontWeight: 700 
        }}>
          <span style={{ background: "linear-gradient(135deg, #10b981, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            GitHub para Músicos
          </span>
        </Link>
      </div>
      
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <Link href="/explore" style={{ color: "#10b981", textDecoration: "none", fontSize: 14 }}>
          🌍 Explorar
        </Link>
        
        {user && (
          <>
            <Link href="/favorites" style={{ color: "#10b981", textDecoration: "none", fontSize: 14 }}>
              ❤️ Favoritos
            </Link>
            <Link href={`/user/${user.id}`} style={{ color: "#10b981", textDecoration: "none", fontSize: 14 }}>
              👤 Perfil
            </Link>
            <NotificationBell />
            <span style={{ color: "#6b7280", fontSize: 14 }}>
              {user.email}
            </span>
            <button
              onClick={signOut}
              style={{
                padding: "6px 16px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Cerrar sesión
            </button>
          </>
        )}
        
        {!user && (
          <Link href="/login">
            <button style={{
              padding: "10px 24px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "white",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
            }}>
              Iniciar sesión
            </button>
          </Link>
        )}
      </div>
    </nav>
  )
}
