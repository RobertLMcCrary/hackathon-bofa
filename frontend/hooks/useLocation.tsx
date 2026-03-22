import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

type LocationContextType = {
    locationDisplay: string | null;
    locationCoords: { latitude: number; longitude: number } | null;
    isFetchingLocation: boolean;
    handleEnableLocation: () => Promise<void>;
};

export const LocationContext = createContext<LocationContextType>({
    locationDisplay: null,
    locationCoords: null,
    isFetchingLocation: false,
    handleEnableLocation: async () => {},
});

export function LocationProvider({ children }: { children: ReactNode }) {
    const [locationDisplay, setLocationDisplay] = useState<string | null>(null);
    const [locationCoords, setLocationCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);

    useEffect(() => {
        const checkLocation = async () => {
            try {
                const { status } = await Location.getForegroundPermissionsAsync();
                if (status === 'granted') {
                    await fetchAndSetLocation(true);
                }
            } catch (error) {
                console.error("Error checking initial location permissions:", error);
            }
        };
        checkLocation();
    }, []);

    const fetchAndSetLocation = async (silent = false) => {
        if (!silent) setIsFetchingLocation(true);
        try {
            const currentPosition = await Location.getCurrentPositionAsync({});
            setLocationCoords({
                latitude: currentPosition.coords.latitude,
                longitude: currentPosition.coords.longitude,
            });
            const geocodeResult = await Location.reverseGeocodeAsync({
                latitude: currentPosition.coords.latitude,
                longitude: currentPosition.coords.longitude,
            });

            if (geocodeResult && geocodeResult.length > 0) {
                const { city, region } = geocodeResult[0];
                setLocationDisplay(city && region ? `${city}, ${region}` : 'Location enabled');
            } else {
                setLocationDisplay(`${currentPosition.coords.latitude.toFixed(2)}, ${currentPosition.coords.longitude.toFixed(2)}`);
            }
        } catch (error) {
            console.error(error);
            if (!silent) Alert.alert("Error", "Could not fetch location.");
        } finally {
            if (!silent) setIsFetchingLocation(false);
        }
    };

    const handleEnableLocation = async () => {
        setIsFetchingLocation(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Denied", "Location permission is required to enable this feature.");
                setIsFetchingLocation(false);
                return;
            }
            await fetchAndSetLocation(false);
        } catch (error) {
            console.error(error);
            setIsFetchingLocation(false);
        }
    };

    return (
        <LocationContext.Provider value={{ locationDisplay, locationCoords, isFetchingLocation, handleEnableLocation }}>
            {children}
        </LocationContext.Provider>
    );
}

export const useLocation = () => useContext(LocationContext);
