import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/services/auth';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocation } from '@/hooks/useLocation';

export default function SettingsScreen() {
    const { session } = useAuth();
    const { locationDisplay, isFetchingLocation, handleEnableLocation } = useLocation();

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ 
                headerShown: true, 
                title: 'Settings', 
                headerBackTitle: 'Back' 
            }} />
            
            <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Account</ThemedText>
                <View style={styles.item}>
                    <ThemedText>Email: {session?.user?.email || 'N/A'}</ThemedText>
                </View>
                
                {/* Interactive Location Field */}
                {locationDisplay ? (
                    <View style={styles.item}>
                        <ThemedText>Location: {locationDisplay}</ThemedText>
                    </View>
                ) : (
                    <TouchableOpacity 
                        style={styles.item} 
                        onPress={handleEnableLocation}
                        disabled={isFetchingLocation}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <ThemedText>Location: </ThemedText>
                            {isFetchingLocation ? (
                                <ActivityIndicator size="small" style={{ marginLeft: 8 }} />
                            ) : (
                                <ThemedText style={{ color: '#0a7ea4', fontWeight: '500' }}>Tap to Enable</ThemedText>
                            )}
                        </View>
                    </TouchableOpacity>
                )}

                <View style={styles.item}>
                    <ThemedText>Account Status: Active</ThemedText>
                </View>
                <View style={[styles.item, { borderBottomWidth: 0 }]}>
                    <ThemedText>Version: 1.0.0</ThemedText>
                </View>
            </View>

            <View style={styles.section}>
                <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
                    <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    section: {
        marginBottom: 32,
        backgroundColor: '#80808015',
        borderRadius: 16,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        opacity: 0.8,
    },
    item: {
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#80808030',
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
    }
});
