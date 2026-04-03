import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useLocation } from '@/hooks/useLocation';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

const MAP_DELTA = { latitudeDelta: 0.01, longitudeDelta: 0.01 };
const MapView: any = Platform.OS === 'web' ? View : require('react-native-maps').default;
const Marker: any = Platform.OS === 'web' ? View : require('react-native-maps').Marker;

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function MatchScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { locationCoords, locationDisplay, isFetchingLocation, handleEnableLocation } = useLocation();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const mapRegion = useMemo(() => {
        if (!locationCoords) return null;
        return {
            latitude: locationCoords.latitude,
            longitude: locationCoords.longitude,
            ...MAP_DELTA,
        };
    }, [locationCoords]);

    const meetSpot = useMemo(() => {
        if (!locationCoords) return null;
        return {
            latitude: locationCoords.latitude + 0.0006,
            longitude: locationCoords.longitude + 0.0004,
        };
    }, [locationCoords]);

    useEffect(() => {
        let active = true;
        const fetchProfile = async () => {
            if (!id) return;
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single();
            if (!active) return;
            setProfile(data ?? null);
            setLoading(false);
        };
        fetchProfile();
        return () => {
            active = false;
        };
    }, [id]);

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.heroCard}>
                <View style={styles.heroHeader}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                        <ThemedText style={styles.closeButtonText}>Close</ThemedText>
                    </TouchableOpacity>
                </View>
                    <ThemedText type="title" style={styles.heroTitle}>It’s a match</ThemedText>
                    <ThemedText style={styles.heroSubtitle}>
                        {loading ? 'Loading match...' : `You and ${profile?.full_name || 'this user'} are close and aligned.`}
                    </ThemedText>
                    <View style={styles.badgeRow}>
                        <View style={[styles.badge, { backgroundColor: '#34C75920' }]}>
                            <ThemedText style={styles.badgeText}>Profiles Similar</ThemedText>
                        </View>
                        <View style={[styles.badge, { backgroundColor: '#FF950020' }]}>
                            <ThemedText style={styles.badgeText}>Bracelets Linked</ThemedText>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>Meet spot</ThemedText>
                    {locationDisplay ? (
                        <ThemedText style={styles.sectionMeta}>{locationDisplay}</ThemedText>
                    ) : null}

                    {isFetchingLocation ? (
                        <View style={styles.mapLoading}>
                            <ActivityIndicator size="large" />
                            <ThemedText style={styles.mapLoadingText}>Finding your location...</ThemedText>
                        </View>
                    ) : !locationCoords ? (
                        <TouchableOpacity style={styles.mapEnable} onPress={handleEnableLocation} activeOpacity={0.8}>
                            <ThemedText type="defaultSemiBold" style={styles.mapEnableTitle}>Enable location</ThemedText>
                            <ThemedText style={styles.mapEnableSub}>Tap to show a meet spot near you.</ThemedText>
                        </TouchableOpacity>
                    ) : Platform.OS === 'web' ? (
                        <View style={styles.mapWebFallback}>
                            <ThemedText type="defaultSemiBold">Map preview is not available on web.</ThemedText>
                            <ThemedText style={styles.mapEnableSub}>Run on iOS or Android to see live maps.</ThemedText>
                        </View>
                    ) : (
                        <View style={styles.mapContainer}>
                            <MapView
                                style={styles.map}
                                initialRegion={mapRegion ?? undefined}
                                showsUserLocation
                                showsMyLocationButton
                                showsCompass={false}
                            >
                                {locationCoords ? <Marker coordinate={locationCoords} title="You" /> : null}
                                {meetSpot ? <Marker coordinate={meetSpot} title="Meet here" /> : null}
                            </MapView>
                            <View style={styles.mapOverlay}>
                                <View style={styles.mapDot} />
                                <ThemedText style={styles.mapOverlayText}>Meet right next to you</ThemedText>
                            </View>
                        </View>
                    )}
                </View>

                <View style={styles.card}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>What happens next</ThemedText>
                    <View style={styles.stepRow}>
                        <View style={styles.stepIcon}>
                            <IconSymbol name="bolt.fill" size={16} color="#0a7ea4" />
                        </View>
                        <ThemedText style={styles.stepText}>Your bracelets are paired for this match.</ThemedText>
                    </View>
                    <View style={styles.stepRow}>
                        <View style={styles.stepIcon}>
                            <IconSymbol name="message.fill" size={16} color="#34C759" />
                        </View>
                        <ThemedText style={styles.stepText}>Send a quick hello and head to the meet spot.</ThemedText>
                    </View>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
        gap: 16,
        paddingBottom: 32,
    },
    heroCard: {
        borderRadius: 24,
        padding: 20,
        backgroundColor: '#FF950012',
        overflow: 'hidden',
        gap: 10,
    },
    heroHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    closeButton: {
        width: 60,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#11181C10',
    },
    closeButtonText: {
        fontSize: 10,
        fontWeight: '600',
    },
    heroTitle: {
        fontFamily: Fonts.rounded,
        fontSize: 30,
    },
    heroSubtitle: {
        opacity: 0.7,
    },
    badgeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 4,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },
    badgeText: {
        fontSize: 12,
        letterSpacing: 0.4,
    },
    card: {
        backgroundColor: '#11181C08',
        borderRadius: 20,
        padding: 16,
        gap: 12,
    },
    sectionTitle: {
        fontFamily: Fonts.rounded,
    },
    sectionMeta: {
        opacity: 0.6,
        fontSize: 12,
    },
    mapContainer: {
        height: 220,
        borderRadius: 18,
        overflow: 'hidden',
    },
    map: {
        flex: 1,
    },
    mapOverlay: {
        position: 'absolute',
        left: 12,
        bottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#11181Caa',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
    },
    mapDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#34C759',
    },
    mapOverlayText: {
        color: '#fff',
        fontSize: 12,
    },
    mapLoading: {
        height: 220,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: '#80808012',
    },
    mapLoadingText: {
        opacity: 0.6,
    },
    mapEnable: {
        height: 220,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#0a7ea410',
    },
    mapEnableTitle: {
        fontSize: 16,
    },
    mapEnableSub: {
        fontSize: 13,
        opacity: 0.6,
        textAlign: 'center',
        maxWidth: 240,
    },
    mapWebFallback: {
        height: 220,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#80808012',
        paddingHorizontal: 24,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    stepIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#11181C10',
    },
    stepText: {
        flex: 1,
        opacity: 0.7,
    },
});
