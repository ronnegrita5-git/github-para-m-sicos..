"use client"

"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"  // 👈 Ruta relativa
import { useRouter } from "next/navigation"

// ... resto del código igual

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState("")
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
      router.push("/")
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div style={{ 
      maxWidth: 400, 
      margin: "50px auto", 
      padding: 30,
      fontFamily: "Arial",
      border: "1px solid #ccc",
      borderRadius: 12,
      background: "white"
    }}>
      <h1 style={{ textAlign: "center" }}>
        {isLogin ? "🎵 Iniciar sesión" : "🎵 Crear cuenta"}
      </h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 16,
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
            padding: 10,
            marginBottom: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />

        {error && (
          <p style={{ color: "red", fontSize: 14 }}>{error}</p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 12,
            background: "#2b8a3e",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          {isLogin ? "Iniciar sesión" : "Crear cuenta"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 20 }}>
        {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{
            background: "none",
            border: "none",
            color: "#0d6efd",
            cursor: "pointer",
            fontSize: 16,
            marginLeft: 5,
          }}
        >
          {isLogin ? "Regístrate" : "Inicia sesión"}
        </button>
      </p>
    </div>
  )
}
