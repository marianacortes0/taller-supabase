// src/services/storageService.ts
import { supabase } from '../lib/supabaseClient'

const AVATARS_BUCKET = 'avatars'
const ARCHIVOS_BUCKET = 'archivos-Tareas'

export const storageService = {
  avatars: {
    // Subir avatar - la ruta incluye el userId para respetar RLS
    upload: (userId: string, file: File) => {
      const ext = file.name.split('.').pop()
      const path = `${userId}/avatar.${ext}`
      return supabase.storage
        .from(AVATARS_BUCKET)
        .upload(path, file, { upsert: true, cacheControl: '3600' })
    },
    getPublicUrl: (userId: string, ext = 'jpg') => {
      const { data } = supabase.storage
        .from(AVATARS_BUCKET)
        .getPublicUrl(`${userId}/avatar.${ext}`)
      return data.publicUrl
    },
    delete: (userId: string, ext = 'jpg') =>
      supabase.storage
        .from(AVATARS_BUCKET)
        .remove([`${userId}/avatar.${ext}`]),
  },
  archivos: {
    // Adjuntar archivo a una tarea - ruta: tareaId/timestamp-nombre
    upload: (tareaId: string, file: File) => {
      const path = `${tareaId}/${Date.now()}-${file.name}`
      return supabase.storage.from(ARCHIVOS_BUCKET).upload(path, file)
    },
    list: (tareaId: string) =>
      supabase.storage.from(ARCHIVOS_BUCKET).list(tareaId),
    getSignedUrl: (path: string, expiresIn = 3600) =>
      supabase.storage.from(ARCHIVOS_BUCKET).createSignedUrl(path, expiresIn),
    delete: (path: string) =>
      supabase.storage.from(ARCHIVOS_BUCKET).remove([path]),
  }
}