"use client"

import Link from "next/link"
import { useAuth } from "../context/AuthContext"

export default function Footer() {
  const { user } = useAuth()
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{
      background: "rgba(10,10,10,0.8)",
      borderTop: "1px solid rgba(16, 185, 129, 0.1)",
      padding: "40px 20px",
      marginTop: "auto",
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 32,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 24 }}>🎵</span>
            <h3 style={{
              color: "white",
              fontSize: 18,
              margin: 0,
              background: "linear-gradient(135deg, #10b981, #34d399)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              GitHub para Músicos
            </h3>
          </div>
          <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>
            La plataforma colaborativa para músicos.
          </p>
        </div>

        <div>
          <h4 style={{ color: "white", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Navegación</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ marginBottom: 8 }}>
              <Link href="/" style={{ color: "#9ca3af", textDecoration: "none", fontSize: 14 }}>🏠 Inicio</Link>
            </li>
            <li style={{ marginBottom: 8 }}>
              <Link href="/explore" style={{ color: "#9ca3af", textDecoration: "none", fontSize: 14 }}>🌍 Explorar</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: "white", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Estado</h4>
          <div style={{
            padding: "10px 16px",
            background: "rgba(255,255,255,0.03)",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.05)",
          }}>
            <p style={{ color: "#9ca3af", fontSize: 14, margin: 0 }}>
              {user ? <>✅ Conectado como <span style={{ color: "#10b981" }}>{user.email}</span></> : <>🔴 No conectado</>}
            </p>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: 1200,
        margin: "32px auto 0",
        paddingTop: 20,
        borderTop: "1px solid rgba(255,255,255,0.05)",
        textAlign: "center",
        color: "#6b7280",
        fontSize: 13,
      }}>
        <p style={{ margin: 0 }}>© {currentYear} GitHub para Músicos · Hecho con ❤️ y 🎵</p>
      </div>
    </footer>
  )
}
