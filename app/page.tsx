import Link from 'next/link'

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'black',
      color: 'white',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: 48, marginBottom: 8 }}>🎵</h1>
      <h2>GitHub para Músicos</h2>
      <p style={{ color: '#888', marginBottom: 30 }}>Colabora con otros músicos en tiempo real</p>
      <Link href="/login" style={{
        padding: '14px 32px',
        background: '#10b981',
        color: 'white',
        borderRadius: 8,
        textDecoration: 'none',
        fontSize: 18,
        fontWeight: 'bold'
      }}>
        🔑 Iniciar sesión
      </Link>
    </div>
  )
}
