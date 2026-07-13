"use client"

import { useAuth } from "@/app/context/AuthContext"
import Link from "next/link"

export default function Home() {
  const { user } = useAuth()

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "black", color: "white" }}>
      <aside style={{ width: 240, padding: "24px 16px", background: "rgba(255,255,255,0.03)", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ padding: "0 8px 16px", fontSize: 20, fontWeight: "bold", color: "#10b981" }}>🎵 Music Collab</div>
        <Link href="/" style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(16,185,129,0.1)", color: "#10b981", textDecoration: "none", display: "block" }}>🏠 Inicio</Link>
        <Link href="/explore" style={{ padding: "10px 12px", borderRadius: 8, color: "#9ca3af", textDecoration: "none", display: "block" }}>🔍 Explorar</Link>
      </aside>
      <main style={{ flex: 1, padding: "40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h1 style={{ fontSize: 48, marginBottom: 8 }}>🎵</h1>
        <h2 style={{ fontSize: 32, marginBottom: 16 }}>GitHub para Músicos</h2>
        <p style={{ color: "#9ca3af", fontSize: 18, marginBottom: 24 }}>{user ? `👋 Bienvenido, ${user.email}` : "Colabora con otros músicos en tiempo real"}</p>
        <Link href="/explore" style={{ padding: "12px 24px", background: "#10b981", color: "white", borderRadius: 8, textDecoration: "none", fontWeight: "bold" }}>Explorar proyectos</Link>
      </main>
    </div>
  )
}
