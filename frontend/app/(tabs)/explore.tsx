import { Link } from 'expo-router';
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

function ProfileCard({ item }: { item: Profile }) {
    const [connectStatus, setConnectStatus] = useState<'Connect' | 'Request Sent'>('Connect');

    return (
        <ThemedView style={styles.profileCard}>
            <Link href={`/user/${item.id}`} asChild>
                <TouchableOpacity activeOpacity={0.7}>
                    <View style={styles.profileHeader}>
                        <ThemedView style={styles.avatarPlaceholder}>
                            <IconSymbol name="person.fill" size={24} color="#A1CEDC" />
                        </ThemedView>
                        <View style={styles.profileInfo}>
                            <ThemedText type="defaultSemiBold">{item.full_name || "Unknown User"}</ThemedText>
                            {item.username && <ThemedText style={styles.username}>@{item.username}</ThemedText>}
                        </View>
                    </View>

                    {item.major && (
                        <ThemedText style={styles.detailText}>
                            <ThemedText type="defaultSemiBold" style={styles.detailLabel}>Major: </ThemedText>
                            {item.major}
                        </ThemedText>
                    )}
                    {item.clubs && (
                        <ThemedText style={styles.detailText} numberOfLines={1}>
                            <ThemedText type="defaultSemiBold" style={styles.detailLabel}>Clubs: </ThemedText>
                            {item.clubs}
                        </ThemedText>
                    )}
                    {item.actively_looking_for && (
                        <ThemedText style={styles.detailText} numberOfLines={1}>
                            <ThemedText type="defaultSemiBold" style={styles.detailLabel}>Looking for: </ThemedText>
                            {item.actively_looking_for}
                        </ThemedText>
                    )}
                </TouchableOpacity>
            </Link>

            <TouchableOpacity
                style={[styles.connectButton, connectStatus === 'Request Sent' && styles.connectButtonSent]}
                onPress={() => setConnectStatus('Request Sent')}
                disabled={connectStatus === 'Request Sent'}
            >
                <ThemedText style={[styles.connectButtonText, connectStatus === 'Request Sent' && styles.connectButtonTextSent]}>
                    {connectStatus}
                </ThemedText>
            </TouchableOpacity>
        </ThemedView>
    );
}

export default function TabTwoScreen() {
    const { session } = useAuth();
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                if (!session?.user?.id) return;

                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .neq("id", session.user.id);

                if (error) {
                    console.error("Error fetching profiles:", error);
                } else {
                    setProfiles(data || []);
                }
            } catch (error) {
                console.error("Error fetching profiles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, [session?.user?.id]);

    return (
        <ThemedView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
                {/*
            <ThemedView style={styles.titleContainer}>
                <ThemedText
                    type="title"
                    style={{
                        fontFamily: Fonts.rounded,
                    }}
                >
                    Explore
                </ThemedText>
            </ThemedView>
            */}
                <ThemedText>
                    Discover other users and their profiles!
                </ThemedText>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" />
                    </View>
                ) : profiles.length === 0 ? (
                    <ThemedText style={styles.emptyText}>No other profiles found.</ThemedText>
                ) : (
                    <View style={styles.listContainer}>
                        {profiles.map(profile => (
                            <View key={profile.id}><ProfileCard item={profile} /></View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: "#808080",
        bottom: -90,
        left: -35,
        position: "absolute",
    },
    titleContainer: {
        flexDirection: "row",
        gap: 8,
    },
    loadingContainer: {
        padding: 40,
        alignItems: "center",
    },
    listContainer: {
        gap: 16,
        paddingBottom: 20,
    },
    profileCard: {
        backgroundColor: "#80808015",
        padding: 16,
        borderRadius: 16,
        gap: 8,
    },
    profileHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 8,
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#80808030",
        justifyContent: "center",
        alignItems: "center",
    },
    profileInfo: {
        flex: 1,
    },
    username: {
        fontSize: 14,
        opacity: 0.6,
    },
    detailText: {
        fontSize: 14,
        lineHeight: 20,
    },
    detailLabel: {
        fontSize: 14,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 40,
        opacity: 0.6,
    },
    connectButton: {
        backgroundColor: '#0a7ea4',
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    connectButtonSent: {
        backgroundColor: '#34C759',
    },
    connectButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    connectButtonTextSent: {
        color: '#fff',
    },
});
