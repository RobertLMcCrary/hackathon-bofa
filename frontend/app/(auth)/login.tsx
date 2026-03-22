import { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { signIn } from '@/services/auth';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const colorScheme = useColorScheme() ?? 'light';
    const tintColor = Colors[colorScheme].tint;

    const handleLogin = async () => {
        setErrorMsg('');
        setLoading(true);

        const { error } = await signIn(email, password);

        setLoading(false);
        if (error) {
            setErrorMsg(error.message);
            return;
        }

        router.replace('/');
    };

    return (
        <ThemedView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    <ThemedText type="title" style={styles.title}>Welcome Back</ThemedText>
                    <ThemedText style={styles.subtitle}>Sign in to continue</ThemedText>

                    {errorMsg ? (
                        <View style={styles.errorContainer}>
                            <ThemedText style={styles.errorText}>{errorMsg}</ThemedText>
                        </View>
                    ) : null}

                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#9BA1A6"
                        autoCapitalize="none"
                        onChangeText={setEmail}
                        style={[
                            styles.input,
                            {
                                color: Colors[colorScheme].text,
                                borderColor: Colors[colorScheme].icon,
                                backgroundColor: colorScheme === 'dark' ? '#2A2D30' : '#F2F2F2'
                            }
                        ]}
                    />

                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#9BA1A6"
                        secureTextEntry
                        onChangeText={setPassword}
                        style={[
                            styles.input,
                            {
                                color: Colors[colorScheme].text,
                                borderColor: Colors[colorScheme].icon,
                                backgroundColor: colorScheme === 'dark' ? '#2A2D30' : '#F2F2F2'
                            }
                        ]}
                    />

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: tintColor }]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <ThemedText style={styles.buttonText}>Login</ThemedText>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => router.push('/register')}
                    >
                        <ThemedText style={styles.linkText}>
                            Don't have an account? <ThemedText style={{ color: tintColor, fontWeight: '600' }}>Register</ThemedText>
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'center',
    },
    content: {
        padding: 24,
        gap: 16,
        maxWidth: 500,
        width: '100%',
        alignSelf: 'center',
    },
    title: {
        fontSize: 32,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.7,
        marginBottom: 24,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
    },
    button: {
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    linkButton: {
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    linkText: {
        fontSize: 14,
    },
    errorContainer: {
        backgroundColor: '#FF3B3020',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FF3B3050',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        textAlign: 'center',
    }
});
