import { useEffect, useRef, useState } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';

//change if needed
const TARGET_NAME = 'GhostBracelet';

export function useBLE() {
    const manager = useRef(new BleManager()).current;

    const [device, setDevice] = useState<Device | null>(null);
    const [connected, setConnected] = useState(false);
    const [scanning, setScanning] = useState(false);

    async function requestPermissions() {
        if (Platform.OS === 'android') {
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ]);
        }
    }

    async function connectToDevice(device: Device) {
        try {
            const connectedDevice = await manager.connectToDevice(device.id);
            await connectedDevice.discoverAllServicesAndCharacteristics();

            setDevice(connectedDevice);
            setConnected(true);
            manager.stopDeviceScan();
            setScanning(false);

            console.log('Connected to', connectedDevice.name);
        } catch (err) {
            console.log('Connection error:', err);
        }
    }

    function startScan() {
        setScanning(true);

        manager.startDeviceScan(null, null, (error, scannedDevice) => {
            if (error) {
                console.log(error);
                return;
            }

            if (scannedDevice?.name === TARGET_NAME) {
                console.log('Found target:', scannedDevice.name);
                connectToDevice(scannedDevice);
            }
        });
    }

    function disconnect() {
        if (device) {
            manager.cancelDeviceConnection(device.id);
            setConnected(false);
            setDevice(null);
        }
    }

    useEffect(() => {
        requestPermissions();

        return () => {
            manager.destroy();
        };
    }, []);

    return {
        device,
        connected,
        scanning,
        startScan,
        disconnect,
    };
}
