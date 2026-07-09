"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const { user, loading, signIn, signUp, signInWithGoogle } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // 👈 Si ya está logueado, redirigir al dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password, { full_name: fullName })
      }
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleLogin() {
    try {
      await signInWithGoogle()
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión con Google")
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a0a0a, #0f1a14, #0a0a0a)",
        color: "white",
      }}>
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0a0a0a, #0f1a14, #0a0a0a)",
      fontFamily: "'Inter', sans-serif",
      padding: 20
    }}>
      <div style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(20px)",
        padding: 40,
        borderRadius: 20,
        border: "1px solid rgba(16, 185, 129, 0.15)",
        width: "100%",
        maxWidth: 420,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
      }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <span style={{ fontSize: 48 }}>🎵</span>
          <h1 style={{ 
            color: "white", 
            margin: "10px 0 5px 0", 
            fontSize: 24,
            background: "linear-gradient(135deg, #10b981, #34d399)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            GitHub para Músicos
          </h1>
          <p style={{ color: "#10b981", fontSize: 14, margin: 0 }}>
            {isLogin ? "Inicia sesión en tu cuenta" : "Crea una nueva cuenta"}
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "white",
            color: "#333",
            border: "1px solid #ddd",
            borderRadius: 10,
            cursor: "pointer",
            fontSize: 16,
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            style={{ width: 20, height: 20 }} 
          />
          Continuar con Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1, borderBottom: "1px solid rgba(255,255,255,0.1)" }} />
          <span style={{ color: "#6b7280", fontSize: 12 }}>o con email</span>
          <div style={{ flex: 1, borderBottom: "1px solid rgba(255,255,255,0.1)" }} />
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Nombre completo (opcional)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 10,
                border: "1px solid rgba(16, 185, 129, 0.2)",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                fontSize: 16,
                marginBottom: 12,
                outline: "none",
              }}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 10,
              border: "1px solid rgba(16, 185, 129, 0.2)",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              fontSize: 16,
              marginBottom: 12,
              outline: "none",
            }}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 10,
              border: "1px solid rgba(16, 185, 129, 0.2)",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              fontSize: 16,
              marginBottom: 12,
              outline: "none",
            }}
          />

          {error && (
            <p style={{ color: "#ef4444", fontSize: 14, margin: "10px 0" }}>
              ❌ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: 14,
              background: isLoading ? "#065f46" : "linear-gradient(135deg, #10b981, #059669)",
              color: "white",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 16,
              fontWeight: "bold",
              marginTop: 10,
            }}
          >
            {isLoading ? "Cargando..." : (isLogin ? "Iniciar sesión" : "Crear cuenta")}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: "none",
              border: "none",
              color: "#10b981",
              cursor: "pointer",
              fontSize: 14,
              textDecoration: "underline",
            }}
          >
            {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  )
}
