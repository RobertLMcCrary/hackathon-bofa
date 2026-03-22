import { Stack } from 'expo-router'
import { useAuth } from '@/hooks/useAuth'
import { View, ActivityIndicator } from 'react-native'

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
        </Stack>
    )
}
