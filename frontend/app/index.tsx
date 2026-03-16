import { Redirect } from 'expo-router'
import { useAuth } from '../context/AuthProvider'
import { View, ActivityIndicator } from 'react-native'

export default function Index() {
    const { session, loading } = useAuth()

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAF8' }}>
                <ActivityIndicator color="#1A1A1A" />
            </View>
        )
    }

    return <Redirect href={session ? '/(app)/' : '/(auth)/login'} />
}
