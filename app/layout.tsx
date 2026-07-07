import type { Metadata } from "next"
import { AuthProvider } from "./context/AuthContext"
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
    <html lang="es" data-scroll-behavior="smooth">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
