"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ExplorePage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        setProjects(data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) return <div style={{ padding: 40, color: 'white' }}>Cargando...</div>
  if (error) return <div style={{ padding: 40, color: 'red' }}>Error: {error}</div>

  return (
    <div style={{ padding: 40, color: 'white' }}>
      <h1>Proyectos ({projects.length})</h1>
      {projects.length === 0 ? (
        <p>No hay proyectos públicos</p>
      ) : (
        <ul>
          {projects.map((p) => (
            <li key={p.id} style={{ marginBottom: 16 }}>
              <strong>{String(p.title || 'Sin título')}</strong>
              <p>{String(p.description || '')}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
