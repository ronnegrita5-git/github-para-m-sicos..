import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import JSZip from 'jszip'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const projectId = searchParams.get('projectId')

  if (!projectId) {
    return NextResponse.json(
      { error: 'Se requiere un ID de proyecto' },
      { status: 400 }
    )
  }

  try {
    const supabase = await createClient()

    // Obtener proyecto
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (projectError) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }

    // Obtener pistas
    const { data: tracks, error: tracksError } = await supabase
      .from('tracks')
      .select('*')
      .eq('project_id', projectId)

    if (tracksError) {
      return NextResponse.json(
        { error: 'Error al obtener pistas' },
        { status: 500 }
      )
    }

    const zip = new JSZip()

    // Añadir metadatos del proyecto
    const metadata = {
      project: {
        name: project.name,
        description: project.description,
        created_at: project.created_at,
        total_tracks: tracks.length,
      },
      tracks: tracks.map((t) => ({
        name: t.name,
        instrument: t.instrument,
        source: t.source,
        created_at: t.created_at,
      })),
    }

    zip.file('project.json', JSON.stringify(metadata, null, 2))

    // Añadir pistas de audio
    const audioFolder = zip.folder('audio')

    for (const track of tracks) {
      if (track.audio_url) {
        try {
          const response = await fetch(track.audio_url)
          const buffer = await response.arrayBuffer()
          
          const fileName = `${track.name || 'pista'}.mp3`
          audioFolder.file(fileName, Buffer.from(buffer))
        } catch (error) {
          console.error(`Error al descargar pista ${track.id}:`, error)
        }
      }
    }

    // Generar el ZIP
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${project.name || 'proyecto'}.zip"`,
      },
    })
  } catch (error) {
    console.error('Error al descargar proyecto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
