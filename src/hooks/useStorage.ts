// src/hooks/useStorage.ts
import { useState } from 'react'
import { storageService } from '../services/storageService'

// ─── Types ────────────────────────────────────────────────

interface UploadState {
  loading: boolean
  error: string | null
  progress: number // 0-100 (simulado, Supabase no expone progreso real)
}

interface ArchivoInfo {
  name: string
  path: string       // tareaId/timestamp-nombre
  signedUrl?: string
}

// ─── Hook ─────────────────────────────────────────────────

export function useStorage() {

  // ── Avatar ──────────────────────────────────────────────

  const [avatarState, setAvatarState] = useState<UploadState>({
    loading: false, error: null, progress: 0,
  })

  const subirAvatar = async (userId: string, file: File): Promise<string | null> => {
    setAvatarState({ loading: true, error: null, progress: 0 })
    try {
      const { error } = await storageService.avatars.upload(userId, file)
      if (error) throw error

      const ext = file.name.split('.').pop() ?? 'jpg'
      const url = storageService.avatars.getPublicUrl(userId, ext)

      setAvatarState({ loading: false, error: null, progress: 100 })
      return url
    } catch (err: any) {
      setAvatarState({ loading: false, error: err.message, progress: 0 })
      return null
    }
  }

  const eliminarAvatar = async (userId: string, ext = 'jpg'): Promise<boolean> => {
    const { error } = await storageService.avatars.delete(userId, ext)
    return !error
  }

  const getAvatarUrl = (userId: string, ext = 'jpg') =>
    storageService.avatars.getPublicUrl(userId, ext)

  // ── Archivos de tarea ────────────────────────────────────

  const [archivoState, setArchivoState] = useState<UploadState>({
    loading: false, error: null, progress: 0,
  })
  const [archivos, setArchivos] = useState<ArchivoInfo[]>([])

  const subirArchivo = async (tareaId: string, file: File): Promise<string | null> => {
    setArchivoState({ loading: true, error: null, progress: 0 })
    try {
      const { data, error } = await storageService.archivos.upload(tareaId, file)
      if (error) throw error

      setArchivoState({ loading: false, error: null, progress: 100 })
      return data?.path ?? null
    } catch (err: any) {
      setArchivoState({ loading: false, error: err.message, progress: 0 })
      return null
    }
  }

  const listarArchivos = async (tareaId: string): Promise<ArchivoInfo[]> => {
    const { data, error } = await storageService.archivos.list(tareaId)
    if (error || !data) return []

    // Obtener signed URLs para cada archivo
    const archivosConUrl = await Promise.all(
      data.map(async (item) => {
        const path = `${tareaId}/${item.name}`
        const { data: signed } = await storageService.archivos.getSignedUrl(path)
        return {
          name: item.name,
          path,
          signedUrl: signed?.signedUrl,
        }
      })
    )

    setArchivos(archivosConUrl)
    return archivosConUrl
  }

  const obtenerUrlArchivo = async (path: string, expiresIn = 3600): Promise<string | null> => {
    const { data, error } = await storageService.archivos.getSignedUrl(path, expiresIn)
    if (error) return null
    return data?.signedUrl ?? null
  }

  const eliminarArchivo = async (path: string): Promise<boolean> => {
    const { error } = await storageService.archivos.delete(path)
    if (!error) {
      setArchivos(prev => prev.filter(a => a.path !== path))
    }
    return !error
  }

  // ── Utils ────────────────────────────────────────────────

  const resetErrors = () => {
    setAvatarState(s => ({ ...s, error: null }))
    setArchivoState(s => ({ ...s, error: null }))
  }

  return {
    // Avatar
    avatar: {
      subir: subirAvatar,
      eliminar: eliminarAvatar,
      getUrl: getAvatarUrl,
      loading: avatarState.loading,
      error: avatarState.error,
    },
    // Archivos de tarea
    archivos: {
      subir: subirArchivo,
      listar: listarArchivos,
      getUrl: obtenerUrlArchivo,
      eliminar: eliminarArchivo,
      lista: archivos,           // estado reactivo con los archivos cargados
      loading: archivoState.loading,
      error: archivoState.error,
    },
    resetErrors,
  }
}