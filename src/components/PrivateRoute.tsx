// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

export function PrivateRoute() {
    const { user, loading } = useAuthContext()
    if (loading) return <div>Cargando...</div>
    return user ? <Outlet /> : <Navigate to='/login' replace />
}