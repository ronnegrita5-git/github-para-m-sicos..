"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"

export default function Sidebar() {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
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
        }}
      >
        ☰
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            zIndex: 999,
          }}
        />
      )}

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
        }}
      >
        <div style={{ padding: "0 24px 20px 24px", borderBottom: "1px solid rgba(16, 185, 129, 0.1)" }}>
          <Link href="/" onClick={() => setIsOpen(false)} style={{ textDecoration: "none" }}>
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

        <button
          onClick={() => setIsOpen(false)}
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

        <nav style={{ flex: 1, padding: "0 16px" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            <li>
              <Link href="/" onClick={() => setIsOpen(false)} style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 16px",
                color: "#d1d5db",
                textDecoration: "none",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 500,
              }}>
                🏠 Inicio
              </Link>
            </li>
            <li>
              <Link href="/explore" onClick={() => setIsOpen(false)} style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 16px",
                color: "#d1d5db",
                textDecoration: "none",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 500,
              }}>
                🌍 Explorar
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 16px",
                    color: "#d1d5db",
                    textDecoration: "none",
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 500,
                  }}>
                    🎸 Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/favorites" onClick={() => setIsOpen(false)} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 16px",
                    color: "#d1d5db",
                    textDecoration: "none",
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 500,
                  }}>
                    ❤️ Favoritos
                  </Link>
                </li>
                <li>
                  <Link href={`/user/${user.id}`} onClick={() => setIsOpen(false)} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 16px",
                    color: "#d1d5db",
                    textDecoration: "none",
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 500,
                  }}>
                    👤 Mi perfil
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(16, 185, 129, 0.1)" }}>
          {user ? (
            <div>
              <div style={{ color: "#c4b5fd", fontSize: 14, marginBottom: 8 }}>
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
                }}
              >
                🚪 Cerrar sesión
              </button>
            </div>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)} style={{
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
            }}>
              🔑 Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
