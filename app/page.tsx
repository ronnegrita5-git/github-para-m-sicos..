"use client"

import Link from "next/link"
import { useAuth } from "./context/AuthContext"

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0a 0%, #0f1a14 30%, #0a0a0a 100%)",
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "40px 20px",
    }}>
      {/* Hero Section */}
      <div style={{
        maxWidth: 900,
        textAlign: "center",
        padding: "60px 0",
        marginTop: 20,
      }}>
        <span style={{ fontSize: 80, display: "block", marginBottom: 20 }}>🎵</span>
        <h1 style={{
          fontSize: 52,
          fontWeight: 800,
          margin: 0,
          background: "linear-gradient(135deg, #10b981, #34d399, #6ee7b7)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1.1,
        }}>
          GitHub para Músicos
        </h1>
        <p style={{
          fontSize: 20,
          color: "#9ca3af",
          marginTop: 16,
          maxWidth: 600,
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          Colabora, comparte y crea música con otros músicos de todo el mundo.
        </p>

        {/* Botones de acción */}
        <div style={{
          display: "flex",
          gap: 16,
          justifyContent: "center",
          marginTop: 40,
          flexWrap: "wrap",
        }}>
          <Link href="/explore">
            <button style={{
              padding: "14px 36px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "white",
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 600,
              transition: "all 0.3s ease",
            }}>
              🌍 Explorar proyectos
            </button>
          </Link>
          {user ? (
            <Link href="/dashboard">
              <button style={{
                padding: "14px 36px",
                background: "rgba(255,255,255,0.08)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 12,
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 500,
              }}>
                🎸 Mis proyectos
              </button>
            </Link>
          ) : (
            <Link href="/login">
              <button style={{
                padding: "14px 36px",
                background: "rgba(255,255,255,0.08)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 12,
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 500,
              }}>
                🔑 Iniciar sesión
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Sección de características */}
      <div style={{
        maxWidth: 1200,
        width: "100%",
        padding: "60px 0",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <h2 style={{
          color: "white",
          fontSize: 32,
          fontWeight: 700,
          textAlign: "center",
          marginBottom: 40,
        }}>
          ¿Qué puedes hacer?
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 24,
        }}>
          {[
            { icon: "📁", title: "Crea proyectos", desc: "Organiza tus canciones y pistas en proyectos colaborativos." },
            { icon: "🎸", title: "Añade pistas", desc: "Sube tus grabaciones, instrumentos y voces." },
            { icon: "🔀", title: "Fork y colabora", desc: "Haz fork de proyectos de otros y aporta tu versión." },
            { icon: "💬", title: "Comunidad activa", desc: "Comenta, da like y sigue a otros músicos." },
          ].map((item) => (
            <div key={item.title} style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: 16,
              padding: 24,
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.05)",
              transition: "all 0.3s ease",
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{item.icon}</div>
              <h3 style={{ color: "white", fontSize: 18, margin: 0 }}>{item.title}</h3>
              <p style={{ color: "#9ca3af", fontSize: 14, marginTop: 8 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pie de página */}
      <div style={{
        width: "100%",
        padding: "30px 0",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        textAlign: "center",
        color: "#6b7280",
        fontSize: 14,
      }}>
        <p>© 2026 GitHub para Músicos · Creado con ❤️ para la comunidad musical</p>
      </div>
    </div>
  )
}
