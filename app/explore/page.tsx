"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Project {
  id: string
  title: string | null
  description: string | null
  is_public: boolean
  created_at: string
  user_id: string
  // Si hay otros campos, se ignoran
}

export default function ExplorePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('🔍 Cargando proyectos...')
        
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('❌ Error:', error)
          setError(error.message)
        } else {
          // ✅ Asegurar que los datos son seguros para renderizar
          const safeData = (data || []).map((project: any) => ({
            id: String(project.id || ''),
            title: String(project.title || 'Proyecto sin título'),
            description: String(project.description || 'Sin descripción'),
            is_public: Boolean(project.is_public),
            created_at: String(project.created_at || ''),
            user_id: String(project.user_id || ''),
          }))
          setProjects(safeData)
        }
      } catch (err) {
        console.error('❌ Error inesperado:', err)
        setError('Error inesperado al cargar proyectos')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', color: 'white' }}>
        <div style={{ padding: '40px' }}>⏳ Cargando proyectos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', color: 'white' }}>
        <div style={{ padding: '40px' }}>
          <p>❌ Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: 16,
              padding: '8px 20px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#0a0a0a',
      color: 'white'
    }}>
      {/* Barra lateral */}
      <aside style={{
        width: 240,
        padding: '24px 16px',
        background: 'rgba(255,255,255,0.03)',
        borderRight: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ padding: '0 8px 16px', fontSize: 20, fontWeight: 'bold', color: '#10b981' }}>
          🎵 Music Collab
        </div>
        <Link href="/" style={{
          padding: '10px 12px',
          borderRadius: 8,
          color: '#9ca3af',
          textDecoration: 'none',
          display: 'block'
        }}>
          🏠 Inicio
        </Link>
        <Link href="/explore" style={{
          padding: '10px 12px',
          borderRadius: 8,
          background: 'rgba(16, 185, 129, 0.1)',
          color: '#10b981',
          textDecoration: 'none',
          display: 'block'
        }}>
          🔍 Explorar
        </Link>
        <Link href="/jam" style={{
          padding: '10px 12px',
          borderRadius: 8,
          color: '#9ca3af',
          textDecoration: 'none',
          display: 'block'
        }}>
          🎹 Jam Session
        </Link>
      </aside>

      {/* Contenido principal */}
      <main style={{
        flex: 1,
        padding: '40px'
      }}>
        <h1 style={{ fontSize: 32, marginBottom: 24 }}>🔍 Explorar proyectos</h1>
        
        {projects.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6b7280'
          }}>
            <p style={{ fontSize: 18, marginBottom: 8 }}>📭 No hay proyectos públicos aún</p>
            <p style={{ fontSize: 14 }}>Sé el primero en compartir un proyecto musical</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {projects.map((project) => (
              <div key={project.id} style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 12,
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.2s'
              }}>
                <h3 style={{ margin: 0, marginBottom: 8 }}>{project.title}</h3>
                <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 12 }}>
                  {project.description}
                </p>
                <Link href={`/project/${project.id}`} style={{
                  color: '#10b981',
                  textDecoration: 'none',
                  fontSize: 14
                }}>
                  Ver proyecto →
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
