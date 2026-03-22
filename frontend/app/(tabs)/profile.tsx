import { StyleSheet, ActivityIndicator, View, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useEffect, useState } from "react";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import type { Database } from "@/types/database";
import { useColorScheme } from "@/hooks/use-color-scheme";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function ProfileScreen() {
    const { session } = useAuth();
    const colorScheme = useColorScheme() ?? 'light';
    const isDark = colorScheme === 'dark';
    
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Editing state
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState<Partial<Profile>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!session?.user?.id) return;
                
                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", session.user.id)
                    .single();

                if (error) {
                    console.error("Error fetching profile:", error);
                } else {
                    setProfile(data);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [session?.user?.id]);

    const handleEdit = () => {
        setEditedProfile(profile || {});
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditedProfile({});
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            if (!session?.user?.id) return;
            setSaving(true);
            
            const { error } = await supabase
                .from("profiles")
                .update(editedProfile)
                .eq("id", session.user.id);

            if (error) {
                console.error("Error updating profile:", error);
                Alert.alert("Error", "Failed to update profile.");
            } else {
                setProfile({ ...profile, ...editedProfile } as Profile);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            Alert.alert("Error", "An unexpected error occurred.");
        } finally {
            setSaving(false);
        }
    };

    const renderField = (fieldKey: keyof Profile, label: string) => {
        const value = isEditing ? editedProfile[fieldKey] : profile?.[fieldKey];
        
        // If not editing and no value, don't show the field
        if (!isEditing && !value) return null;

        return (
            <View style={styles.fieldContainer}>
                <ThemedText style={styles.fieldLabel}>{label}</ThemedText>
                {isEditing ? (
                    <TextInput
                        style={[
                            styles.input,
                            { 
                                color: isDark ? '#fff' : '#000',
                                backgroundColor: isDark ? '#ffffff10' : '#00000005',
                                borderColor: isDark ? '#ffffff30' : '#00000020'
                            }
                        ]}
                        value={(value as string) || ''}
                        onChangeText={(text) => setEditedProfile({ ...editedProfile, [fieldKey]: text })}
                        placeholder={`Enter your ${label.toLowerCase()}`}
                        placeholderTextColor={isDark ? '#ffffff60' : '#00000060'}
                    />
                ) : (
                    <ThemedText style={styles.fieldValue}>{String(value)}</ThemedText>
                )}
            </View>
        );
    };

    return (
        <ThemedView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
            <View style={styles.titleContainer}>
                <ThemedText
                    type="title"
                    style={{ fontFamily: Fonts.rounded, flex: 1 }}
                >
                    My Profile
                </ThemedText>
                
                {!loading && profile && !isEditing && (
                    <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                        <ThemedText style={styles.editButtonText}>Edit</ThemedText>
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" />
                </View>
            ) : profile ? (
                <ThemedView style={styles.profileCard}>
                    <View style={styles.headerRow}>
                        <ThemedView style={styles.avatarPlaceholder}>
                            <IconSymbol name="person.fill" size={32} color="#A1CEDC" />
                        </ThemedView>
                        <View style={styles.nameContainer}>
                            {isEditing ? (
                                <>
                                    <TextInput
                                        style={[
                                            styles.input, 
                                            styles.nameInput,
                                            { 
                                                color: isDark ? '#fff' : '#000',
                                                backgroundColor: isDark ? '#ffffff10' : '#00000005',
                                                borderColor: isDark ? '#ffffff30' : '#00000020'
                                            }
                                        ]}
                                        value={editedProfile.full_name || ''}
                                        onChangeText={(text) => setEditedProfile({ ...editedProfile, full_name: text })}
                                        placeholder="Full Name"
                                        placeholderTextColor={isDark ? '#ffffff60' : '#00000060'}
                                    />
                                    <TextInput
                                        style={[
                                            styles.input,
                                            { 
                                                color: isDark ? '#fff' : '#000',
                                                backgroundColor: isDark ? '#ffffff10' : '#00000005',
                                                borderColor: isDark ? '#ffffff30' : '#00000020',
                                                marginTop: 8
                                            }
                                        ]}
                                        value={editedProfile.username || ''}
                                        onChangeText={(text) => setEditedProfile({ ...editedProfile, username: text })}
                                        placeholder="Username"
                                        placeholderTextColor={isDark ? '#ffffff60' : '#00000060'}
                                        autoCapitalize="none"
                                    />
                                </>
                            ) : (
                                <>
                                    <ThemedText type="title" style={styles.fullName}>{profile.full_name || "No name set"}</ThemedText>
                                    {profile.username && <ThemedText style={styles.username}>@{profile.username}</ThemedText>}
                                </>
                            )}
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {renderField("major", "Major")}
                    {renderField("clubs", "Clubs")}
                    {renderField("internships", "Internships")}
                    {renderField("research", "Research")}
                    {renderField("actively_looking_for", "Actively Looking For")}
                    {renderField("website", "Website")}
                    
                    {isEditing && (
                        <View style={styles.actionButtons}>
                            <TouchableOpacity 
                                onPress={handleCancel} 
                                style={[styles.actionButton, styles.cancelButton]}
                                disabled={saving}
                            >
                                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={handleSave} 
                                style={[styles.actionButton, styles.saveButton]}
                                disabled={saving}
                            >
                                {saving ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <ThemedText style={styles.saveButtonText}>Save</ThemedText>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </ThemedView>
            ) : (
                <View style={styles.emptyContainer}>
                    <ThemedText style={styles.emptyText}>Profile not found. Please complete your profile setup.</ThemedText>
                    {/* Add an ability to create an empty profile row here later if needed */}
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
        alignItems: "center",
        marginBottom: 16,
    },
    editButton: {
        backgroundColor: '#0a7ea4',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
    },
    editButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    loadingContainer: {
        padding: 40,
        alignItems: "center",
    },
    profileCard: {
        backgroundColor: "#80808015",
        padding: 24,
        borderRadius: 20,
        gap: 16,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "flex-start",
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
        justifyContent: "center",
        marginTop: 4,
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
        gap: 8,
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
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    nameInput: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    actionButtons: {
        flexDirection: "row",
        gap: 12,
        marginTop: 16,
    },
    actionButton: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelButton: {
        backgroundColor: '#FF3B3020',
        borderWidth: 1,
        borderColor: '#FF3B3050',
    },
    cancelButtonText: {
        color: '#FF3B30',
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#34C759',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: "center",
        marginTop: 40,
    },
    emptyText: {
        textAlign: "center",
        opacity: 0.6,
        marginBottom: 16,
    },
});
