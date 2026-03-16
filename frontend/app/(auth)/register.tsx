import { useState } from 'react'
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native'
import { router } from 'expo-router'
import { supabase } from '../../lib/supabase'

export default function RegisterScreen() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleRegister = async () => {
        if (!email || !password || !confirm) return setError('Please fill in all fields.')
        if (password !== confirm) return setError('Passwords do not match.')
        if (password.length < 6) return setError('Password must be at least 6 characters.')
        setLoading(true)
        setError('')
        const { error } = await supabase.auth.signUp({ email, password })
        setLoading(false)
        if (error) return setError(error.message)
        setSuccess(true)
    }

    if (success) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 28 }]}>
                <Text style={{ fontSize: 40, marginBottom: 16 }}>✉️</Text>
                <Text style={styles.heading}>Check your email</Text>
                <Text style={[styles.subheading, { textAlign: 'center' }]}>
                    We sent a confirmation link to {email}
                </Text>
                <TouchableOpacity style={[styles.button, { marginTop: 32, width: '100%' }]} onPress={() => router.replace('/(auth)/login')}>
                    <Text style={styles.buttonText}>Back to sign in</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.inner}>
                <Text style={styles.wordmark}>myapp</Text>
                <Text style={styles.heading}>Create account</Text>
                <Text style={styles.subheading}>Get started for free</Text>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="you@example.com"
                            placeholderTextColor="#ABABAB"
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Min. 6 characters"
                            placeholderTextColor="#ABABAB"
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm password</Text>
                        <TextInput
                            style={styles.input}
                            value={confirm}
                            onChangeText={setConfirm}
                            placeholder="••••••••"
                            placeholderTextColor="#ABABAB"
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                        {loading
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={styles.buttonText}>Create account</Text>
                        }
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.footerLink}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAFAF8' },
    inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
    wordmark: { fontSize: 22, fontWeight: '700', color: '#1A1A1A', letterSpacing: -0.5, marginBottom: 40 },
    heading: { fontSize: 30, fontWeight: '700', color: '#1A1A1A', letterSpacing: -0.8, marginBottom: 6 },
    subheading: { fontSize: 16, color: '#888', marginBottom: 36 },
    error: { backgroundColor: '#FEF2F2', color: '#DC2626', padding: 12, borderRadius: 10, fontSize: 14, marginBottom: 16 },
    form: { gap: 20 },
    inputGroup: { gap: 6 },
    label: { fontSize: 13, fontWeight: '600', color: '#444', letterSpacing: 0.1 },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E5E3',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#1A1A1A',
    },
    button: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 4,
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
    footerText: { color: '#888', fontSize: 14 },
    footerLink: { color: '#1A1A1A', fontSize: 14, fontWeight: '600' },
})
