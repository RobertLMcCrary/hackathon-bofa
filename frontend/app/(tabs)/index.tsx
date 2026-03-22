import { Link } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from '@/hooks/useLocation';
import { supabase } from '@/lib/supabase';
import { signOut } from '@/services/auth';
import type { Database } from '@/types/database';

const MAP_DELTA = { latitudeDelta: 0.01, longitudeDelta: 0.01 };
const MapView: any = Platform.OS === 'web' ? View : require('react-native-maps').default;
const Marker: any = Platform.OS === 'web' ? View : require('react-native-maps').Marker;

const INTENT_TAGS = ['Cofounder', 'Internship', 'Research', 'Study Partner', 'Mentor'];

type Profile = Database['public']['Tables']['profiles']['Row'];

function NearbyCard({ profile }: { profile: Profile }) {
    return (
        <Link href={`/user/${profile.id}`} asChild>
            <TouchableOpacity activeOpacity={0.85} style={styles.nearbyCard}>
                <View style={styles.nearbyAvatar}>
                    <IconSymbol name="person.fill" size={22} color="#A1CEDC" />
                </View>
                <View style={styles.nearbyInfo}>
                    <ThemedText type="defaultSemiBold" numberOfLines={1}>
                        {profile.full_name || 'Unknown'}
                    </ThemedText>
                    {profile.major ? (
                        <ThemedText style={styles.nearbyMeta} numberOfLines={1}>
                            {profile.major}
                        </ThemedText>
                    ) : null}
                    {profile.actively_looking_for ? (
                        <View style={styles.intentPill}>
                            <ThemedText style={styles.intentText} numberOfLines={1}>
                                {profile.actively_looking_for}
                            </ThemedText>
                        </View>
                    ) : null}
                </View>
            </TouchableOpacity>
        </Link>
    );
}

export default function HomeScreen() {
    const { session, loading } = useAuth();
    const { locationDisplay, locationCoords, isFetchingLocation, handleEnableLocation } = useLocation();
    const [myProfile, setMyProfile] = useState<Profile | null>(null);
    const [nearbyProfiles, setNearbyProfiles] = useState<Profile[]>([]);
    const [loadingProfiles, setLoadingProfiles] = useState(true);
    const [isMapInteracting, setIsMapInteracting] = useState(false);
    const user = session?.user;

    const mapRegion = useMemo(() => {
        if (!locationCoords) return null;
        return {
            latitude: locationCoords.latitude,
            longitude: locationCoords.longitude,
            ...MAP_DELTA,
        };
    }, [locationCoords]);

    useEffect(() => {
        let active = true;

        const fetchProfiles = async () => {
            if (!session?.user?.id) return;
            setLoadingProfiles(true);

            const [{ data: me }, { data: others }] = await Promise.all([
                supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single(),
                supabase
                    .from('profiles')
                    .select('*')
                    .neq('id', session.user.id)
                    .order('updated_at', { ascending: false })
                    .limit(8),
            ]);

            if (!active) return;
            setMyProfile(me ?? null);
            setNearbyProfiles(others ?? []);
            setLoadingProfiles(false);
        };

        fetchProfiles();

        return () => {
            active = false;
        };
    }, [session?.user?.id]);

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                scrollEnabled={!isMapInteracting}
            >
                <View style={styles.heroCard}>
                    <View style={styles.heroBackdrop} />
                    <View style={styles.heroTopRow}>
                        <ThemedText type="title" style={styles.heroTitle}>Ready to connect</ThemedText>
                        <HelloWave />
                    </View>
                    <ThemedText style={styles.heroSubtitle}>
                        Build real connections on campus or at your next event.
                    </ThemedText>
                    <View style={styles.heroPills}>
                        <View style={[styles.pill, { backgroundColor: '#0a7ea420' }]}
                        >
                            <ThemedText style={styles.pillText}>Match Live</ThemedText>
                        </View>
                        <View style={[styles.pill, { backgroundColor: '#11181C10' }]}
                        >
                            <ThemedText style={styles.pillText}>Safe + Verified</ThemedText>
                        </View>
                        <View style={[styles.pill, { backgroundColor: '#34C75920' }]}
                        >
                            <ThemedText style={styles.pillText}>Meet Spots</ThemedText>
                        </View>
                        <View style={[styles.pill, { backgroundColor: '#34C75920' }]}
                        >
                            <ThemedText style={styles.pillText}>Coffee Chats</ThemedText>
                        </View>

                    </View>
                </View>

                <View style={styles.intentCard}>
                    <View style={styles.intentHeader}>
                        <View>
                            <ThemedText type="subtitle" style={styles.sectionTitle}>Match intent</ThemedText>
                            <ThemedText style={styles.sectionMeta}>
                                {myProfile?.actively_looking_for
                                    ? `Looking for: ${myProfile.actively_looking_for}`
                                    : 'Tell us what you want to find'}
                            </ThemedText>
                        </View>
                        <Link href="/profile" asChild>
                            <TouchableOpacity style={styles.intentButton}>
                                <ThemedText style={styles.intentButtonText}>Update</ThemedText>
                            </TouchableOpacity>
                        </Link>
                    </View>
                    <View style={styles.intentTags}>
                        {INTENT_TAGS.map((tag) => (
                            <View key={tag} style={styles.intentTag}>
                                <ThemedText style={styles.intentTagText}>{tag}</ThemedText>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.mapCard}>
                    <View style={styles.mapHeader}>
                        <ThemedText type="subtitle" style={styles.sectionTitle}>Your map</ThemedText>
                        {locationDisplay ? (
                            <ThemedText style={styles.sectionMeta}>{locationDisplay}</ThemedText>
                        ) : null}
                    </View>

                    {isFetchingLocation ? (
                        <View style={styles.mapLoading}>
                            <ActivityIndicator size="large" />
                            <ThemedText style={styles.mapLoadingText}>Finding your location...</ThemedText>
                        </View>
                    ) : !locationCoords ? (
                        <TouchableOpacity style={styles.mapEnable} onPress={handleEnableLocation} activeOpacity={0.8}>
                            <ThemedText type="defaultSemiBold" style={styles.mapEnableTitle}>Enable location</ThemedText>
                            <ThemedText style={styles.mapEnableSub}>Tap to show your live position on the map.</ThemedText>
                        </TouchableOpacity>
                    ) : Platform.OS === 'web' ? (
                        <View style={styles.mapWebFallback}>
                            <ThemedText type="defaultSemiBold">Map preview is not available on web.</ThemedText>
                            <ThemedText style={styles.mapEnableSub}>Run on iOS or Android to see live maps.</ThemedText>
                        </View>
                    ) : (
                        <View
                            style={styles.mapContainer}
                            onTouchStart={() => setIsMapInteracting(true)}
                            onTouchEnd={() => setIsMapInteracting(false)}
                            onTouchCancel={() => setIsMapInteracting(false)}
                        >
                            <MapView
                                style={styles.map}
                                initialRegion={mapRegion ?? undefined}
                                showsUserLocation
                                followsUserLocation
                                showsMyLocationButton
                                showsCompass={false}
                                onPanDrag={() => setIsMapInteracting(true)}
                                onRegionChangeComplete={() => setIsMapInteracting(false)}
                            >
                                <Marker coordinate={locationCoords} title="You" />
                            </MapView>
                            <View style={styles.mapOverlay}>
                                <View style={styles.mapDot} />
                                <ThemedText style={styles.mapOverlayText}>Live now</ThemedText>
                            </View>
                        </View>
                    )}
                </View>

                <View style={styles.sectionHeader}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>People nearby</ThemedText>
                    <Link href="/explore" asChild>
                        <TouchableOpacity>
                            <ThemedText style={styles.sectionLink}>See all</ThemedText>
                        </TouchableOpacity>
                    </Link>
                </View>

                {loadingProfiles ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" />
                    </View>
                ) : nearbyProfiles.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <ThemedText style={styles.emptyText}>No nearby profiles yet. Check back soon.</ThemedText>
                    </View>
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.nearbyList}>
                        {nearbyProfiles.map((profile) => (
                            <NearbyCard key={profile.id} profile={profile} />
                        ))}
                    </ScrollView>
                )}

                <View style={styles.matchFlowCard}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>How matches work</ThemedText>
                    <View style={styles.flowRow}>
                        <View style={styles.flowIcon}>
                            <IconSymbol name="bolt.fill" size={16} color="#0a7ea4" />
                        </View>
                        <View style={styles.flowTextWrap}>
                            <ThemedText type="defaultSemiBold">Intent aligned</ThemedText>
                            <ThemedText style={styles.flowText}>We match you with people looking for the same thing.</ThemedText>
                        </View>
                    </View>
                    <View style={styles.flowRow}>
                        <View style={styles.flowIcon}>
                            <IconSymbol name="location.fill" size={16} color="#34C759" />
                        </View>
                        <View style={styles.flowTextWrap}>
                            <ThemedText type="defaultSemiBold">Close by</ThemedText>
                            <ThemedText style={styles.flowText}>Only connect when you are within range.</ThemedText>
                        </View>
                    </View>
                    <View style={styles.flowRow}>
                        <View style={styles.flowIcon}>
                            <IconSymbol name="mappin.and.ellipse" size={16} color="#FF9500" />
                        </View>
                        <View style={styles.flowTextWrap}>
                            <ThemedText type="defaultSemiBold">Meet spot</ThemedText>
                            <ThemedText style={styles.flowText}>We send a safe, convenient place to meet.</ThemedText>
                        </View>
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
        backgroundColor: '#0a7ea40f',
        overflow: 'hidden',
    },
    heroBackdrop: {
        position: 'absolute',
        right: -40,
        top: -20,
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: '#0a7ea420',
    },
    heroTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    heroTitle: {
        fontFamily: Fonts.rounded,
        fontSize: 30,
    },
    heroSubtitle: {
        marginTop: 8,
        opacity: 0.7,
    },
    heroPills: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 12,
    },
    pill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },
    pillText: {
        fontSize: 12,
        letterSpacing: 0.4,
    },
    intentCard: {
        backgroundColor: '#11181C08',
        borderRadius: 20,
        padding: 16,
        gap: 12,
    },
    intentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
    },
    intentButton: {
        backgroundColor: '#0a7ea4',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 14,
    },
    intentButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },
    intentTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    intentTag: {
        backgroundColor: '#0a7ea410',
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    intentTagText: {
        fontSize: 12,
        opacity: 0.7,
    },
    mapCard: {
        backgroundColor: '#80808010',
        borderRadius: 20,
        padding: 16,
        gap: 12,
    },
    mapHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontFamily: Fonts.rounded,
    },
    sectionMeta: {
        opacity: 0.6,
        fontSize: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    sectionLink: {
        fontSize: 12,
        color: '#0a7ea4',
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
    nearbyList: {
        paddingVertical: 4,
        paddingBottom: 8,
        gap: 12,
    },
    nearbyCard: {
        width: 180,
        borderRadius: 18,
        padding: 14,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#11181C10',
        gap: 12,
    },
    nearbyAvatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#80808030',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nearbyInfo: {
        gap: 6,
    },
    nearbyMeta: {
        fontSize: 12,
        opacity: 0.6,
    },
    intentPill: {
        alignSelf: 'flex-start',
        backgroundColor: '#0a7ea410',
        borderRadius: 999,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    intentText: {
        fontSize: 11,
        opacity: 0.7,
    },
    emptyCard: {
        backgroundColor: '#80808010',
        borderRadius: 18,
        padding: 16,
        alignItems: 'center',
    },
    emptyText: {
        opacity: 0.6,
        textAlign: 'center',
    },
    matchFlowCard: {
        backgroundColor: '#11181C08',
        borderRadius: 20,
        padding: 16,
        gap: 12,
    },
    flowRow: {
        flexDirection: 'row',
        gap: 12,
    },
    flowIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#11181C10',
    },
    flowTextWrap: {
        flex: 1,
        gap: 4,
    },
    flowText: {
        opacity: 0.6,
        fontSize: 13,
    },
    profileCard: {
        backgroundColor: '#80808015',
        padding: 20,
        borderRadius: 16,
        gap: 12,
    },
    profileContent: {
        gap: 12,
    },
    loadingContainer: {
        padding: 24,
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        opacity: 0.6,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
    },
    signOutButton: {
        backgroundColor: '#FF3B3020',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FF3B3050',
    },
    signOutText: {
        color: '#FF3B30',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
