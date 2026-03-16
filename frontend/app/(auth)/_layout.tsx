import { Redirect, Slot } from 'expo-router'
import { useAuth } from '../../context/AuthProvider'

export default function AuthLayout() {
    const { session, loading } = useAuth()
    if (loading) return null
    if (session) return <Redirect href="/(app)/" />
    return <Slot />
}
