import type { Metadata } from "next"
import { AuthProvider } from "./context/AuthContext"
import Sidebar from "./components/Sidebar"
import Footer from "./components/Footer"
import "./globals.css"

export const metadata: Metadata = {
  title: "GitHub para Músicos",
  description: "Plataforma colaborativa para músicos",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <div style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}>
            <Sidebar />
            <main style={{ flex: 1 }}>
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
