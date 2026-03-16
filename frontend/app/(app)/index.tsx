import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../context/AuthProvider'
import { supabase } from '../../lib/supabase'

export default function HomeScreen() {
    const { session } = useAuth()

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.wordmark}>myapp</Text>
                <TouchableOpacity style={styles.signOutBtn} onPress={() => supabase.auth.signOut()}>
                    <Text style={styles.signOutText}>Sign out</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.body}>
                <Text style={styles.greeting}>Hey there 👋</Text>
                <Text style={styles.email}>{session?.user.email}</Text>
                <Text style={styles.hint}>You're authenticated. Build something here.</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAFAF8' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EBEBEA',
    },
    wordmark: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', letterSpacing: -0.5 },
    signOutBtn: {
        backgroundColor: '#F3F3F1',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    signOutText: { fontSize: 13, fontWeight: '600', color: '#555' },
    body: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 28 },
    greeting: { fontSize: 32, fontWeight: '700', color: '#1A1A1A', letterSpacing: -0.8, marginBottom: 8 },
    email: { fontSize: 15, color: '#888', marginBottom: 24 },
    hint: { fontSize: 14, color: '#ABABAB', textAlign: 'center' },
})

