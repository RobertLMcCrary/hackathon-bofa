import { Tabs, Link } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
                headerShown: true,
                headerTitle: '',
                headerStyle: {
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                },
                headerShadowVisible: false,
                headerLeft: () => (
                    <Text style={{
                        fontFamily: Fonts.rounded,
                        fontSize: 28,
                        fontWeight: 'bold',
                        marginLeft: 20,
                        color: Colors[colorScheme ?? 'light'].text
                    }}>
                        Bumply
                    </Text>
                ),
                headerRight: () => (
                    <Link href="/settings" asChild>
                        <TouchableOpacity style={{ marginRight: 20 }}>
                            <IconSymbol name="gearshape.fill" size={24} color={Colors[colorScheme ?? 'light'].text} />
                        </TouchableOpacity>
                    </Link>
                ),
                tabBarButton: HapticTab,
                tabBarStyle: {
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.crop.circle.fill" color={color} />,
                }}
            />
        </Tabs>
    );
}
