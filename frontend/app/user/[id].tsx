import { View, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { Database } from '@/types/database';

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function UserProfileScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [connectStatus, setConnectStatus] = useState<'Connect' | 'Request Sent'>('Connect');

    useEffect(() => {
        const fetchProfile = async () => {
            if (!id) return;
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) {
                    console.error('Error fetching user profile:', error);
                } else {
                    setProfile(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    const renderField = (label: string, value: string | null | undefined) => {
        if (!value) return null;
        return (
            <View style={styles.fieldContainer}>
                <ThemedText style={styles.fieldLabel}>{label}</ThemedText>
                <ThemedText style={styles.fieldValue}>{value}</ThemedText>
            </View>
        );
    };

    if (loading) {
        return (
            <ThemedView style={styles.centerContainer}>
                <Stack.Screen options={{ title: 'Loading...', headerShown: true }} />
                <ActivityIndicator size="large" />
            </ThemedView>
        );
    }

    if (!profile) {
        return (
            <ThemedView style={styles.centerContainer}>
                <Stack.Screen options={{ title: 'Not Found', headerShown: true }} />
                <ThemedText style={styles.emptyText}>User not found.</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={{ flex: 1 }}>
            <Stack.Screen options={{ 
                title: profile.full_name || 'Profile', 
                headerShown: true, 
                headerBackTitle: 'Back' 
            }} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <ThemedView style={styles.profileCard}>
                    <View style={styles.headerRow}>
                        <ThemedView style={styles.avatarPlaceholder}>
                            <IconSymbol name="person.fill" size={32} color="#A1CEDC" />
                        </ThemedView>
                        <View style={styles.nameContainer}>
                            <ThemedText type="title" style={styles.fullName}>{profile.full_name || "Unknown User"}</ThemedText>
                            {profile.username && <ThemedText style={styles.username}>@{profile.username}</ThemedText>}
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {renderField("Major", profile.major)}
                    {renderField("Clubs", profile.clubs)}
                    {renderField("Internships", profile.internships)}
                    {renderField("Research", profile.research)}
                    {renderField("Actively Looking For", profile.actively_looking_for)}
                    {renderField("Website", profile.website)}

                    <TouchableOpacity
                        style={[styles.connectButton, connectStatus === 'Request Sent' && styles.connectButtonSent]}
                        onPress={() => setConnectStatus('Request Sent')}
                        disabled={connectStatus === 'Request Sent'}
                    >
                        <ThemedText style={[styles.connectButtonText, connectStatus === 'Request Sent' && styles.connectButtonTextSent]}>
                            {connectStatus}
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.demoMatchButton}
                        onPress={() => {
                            Alert.alert(
                                "It's a match!",
                                `You and ${profile.full_name || 'this user'} are close and have similar profiles. Bracelets linked.`,
                            );
                            router.push(`/match/${profile.id}`);
                        }}
                    >
                        <ThemedText style={styles.demoMatchButtonText}>Trigger Demo Match</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 16,
        gap: 16,
    },
    profileCard: {
        backgroundColor: "#80808015",
        padding: 24,
        borderRadius: 20,
        gap: 16,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    avatarPlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#80808030",
        justifyContent: "center",
        alignItems: "center",
    },
    nameContainer: {
        flex: 1,
    },
    fullName: {
        fontSize: 24,
        lineHeight: 28,
    },
    username: {
        fontSize: 16,
        opacity: 0.6,
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: "#80808030",
        marginVertical: 4,
    },
    fieldContainer: {
        gap: 4,
    },
    fieldLabel: {
        fontSize: 12,
        opacity: 0.6,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    fieldValue: {
        fontSize: 16,
        lineHeight: 24,
    },
    emptyText: {
        opacity: 0.6,
    },
    connectButton: {
        backgroundColor: '#0a7ea4',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    connectButtonSent: {
        backgroundColor: '#34C759',
    },
    connectButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    connectButtonTextSent: {
        color: '#fff',
    },
    demoMatchButton: {
        backgroundColor: '#FF9500',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    demoMatchButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
