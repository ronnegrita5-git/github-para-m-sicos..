"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"

export default function Sidebar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)
  const closeSidebar = () => setIsOpen(false)

  const handleLogout = async () => {
    await signOut()
    router.push("/")
    closeSidebar()
  }

  const linkStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 16px",
    color: "#d1d5db",
    textDecoration: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 500,
    transition: "all 0.2s ease",
  }

  return (
    <>
      {/* Botón de hamburguesa */}
      <button
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1000,
          background: "rgba(16, 185, 129, 0.15)",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          borderRadius: 10,
          padding: "10px 12px",
          cursor: "pointer",
          color: "white",
          fontSize: 22,
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(16, 185, 129, 0.25)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(16, 185, 129, 0.15)"
        }}
      >
        ☰
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            zIndex: 999,
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 280,
          height: "100%",
          background: "linear-gradient(180deg, #0f1a14 0%, #0a0a0a 100%)",
          borderRight: "1px solid rgba(16, 185, 129, 0.1)",
          zIndex: 1000,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          padding: "20px 0",
          display: "flex",
          flexDirection: "column",
          boxShadow: "4px 0 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* Logo */}
        <div style={{
          padding: "0 24px 20px 24px",
          borderBottom: "1px solid rgba(16, 185, 129, 0.1)",
          marginBottom: 16,
        }}>
          <Link href="/" onClick={closeSidebar} style={{ textDecoration: "none" }}>
            <span style={{ fontSize: 28 }}>🎵</span>
            <h2 style={{
              color: "white",
              fontSize: 18,
              margin: 0,
              marginTop: 4,
              background: "linear-gradient(135deg, #10b981, #34d399)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              GitHub para Músicos
            </h2>
          </Link>
        </div>

        {/* Cerrar */}
        <button
          onClick={closeSidebar}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            color: "#6b7280",
            fontSize: 22,
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        {/* Navegación */}
        <nav style={{ flex: 1, padding: "0 16px" }}>
          <ul style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}>
            <li>
              <Link href="/" onClick={closeSidebar} style={linkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent"
                }}
              >
                🏠 Inicio
              </Link>
            </li>
            <li>
              <Link href="/explore" onClick={closeSidebar} style={linkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent"
                }}
              >
                🌍 Explorar
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <Link href="/dashboard" onClick={closeSidebar} style={linkStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent"
                    }}
                  >
                    🎸 Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/favorites" onClick={closeSidebar} style={linkStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent"
                    }}
                  >
                    ❤️ Favoritos
                  </Link>
                </li>
                <li>
                  <Link href={`/user/${user.id}`} onClick={closeSidebar} style={linkStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent"
                    }}
                  >
                    👤 Mi perfil
                  </Link>
                </li>
                {/* 👈 NUEVO: Enlace a Jam Session */}
                <li>
                  <Link href="/jam" onClick={closeSidebar} style={linkStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(16, 185, 129, 0.15)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent"
                    }}
                  >
                    🎹 Jam Session
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Usuario y acciones */}
        <div style={{
          padding: "16px 24px",
          borderTop: "1px solid rgba(16, 185, 129, 0.1)",
          marginTop: "auto",
        }}>
          {user ? (
            <div>
              <div style={{
                color: "#c4b5fd",
                fontSize: 14,
                marginBottom: 8,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                👤 {user.email}
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  background: "rgba(239, 68, 68, 0.15)",
                  color: "#ef4444",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.25)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)"
                }}
              >
                🚪 Cerrar sesión
              </button>
            </div>
          ) : (
            <Link href="/login" onClick={closeSidebar} style={{
              display: "block",
              width: "100%",
              padding: "10px 16px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "white",
              textAlign: "center",
              textDecoration: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)"
            }}>
              🔑 Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
