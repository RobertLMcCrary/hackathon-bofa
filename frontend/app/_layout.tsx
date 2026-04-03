import { Stack, useRouter, useSegments } from 'expo-router'
import { useAuth } from '@/hooks/useAuth'
import { View, ActivityIndicator } from 'react-native'
import { useEffect } from 'react'
import { LocationProvider } from '@/hooks/useLocation'

export default function RootLayout() {
    const { session, loading } = useAuth()
    const segments = useSegments()
    const router = useRouter()

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (session && inAuthGroup) {
            router.replace('/(tabs)');
        } else if (!session && !inAuthGroup) {
            router.replace('/(auth)/login');
        }
    }, [session, loading, segments]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator />
            </View>
        )
    }

    return (
        <LocationProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="match/[id]" options={{ presentation: 'modal' }} />
            </Stack>
        </LocationProvider>
    )
}
