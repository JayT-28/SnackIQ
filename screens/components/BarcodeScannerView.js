import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Camera as CameraIcon, X, ChevronDown } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import styles from '../../styles/LandingScreenStyles';

export default function BarcodeScannerView({
  onScanComplete,
  onToggleToSearch,
  scanning,
  onStartScan,
  onCloseScan
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const isProcessing = useRef(false);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (isProcessing.current) {
      return;
    }

    isProcessing.current = true;

    await onScanComplete(data, 'camera');

    setTimeout(() => {
      isProcessing.current = false;
    }, 1000);
  };

  const handleScanPress = async () => {
    if (!permission) {
      return;
    }

    if (!permission.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        alert('SnackIQ uses your camera to scan product barcodes and look up nutritional information. No photos are taken or stored. Please enable camera access in your device settings to scan barcodes.');
        return;
      }
    }

    isProcessing.current = false;
    onStartScan();
  };

  // Camera Scanner View (when actively scanning)
  if (scanning) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: [
              'ean13',
              'ean8',
              'upc_a',
              'upc_e',
              'code128',
              'code39',
            ],
          }}
        />

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            isProcessing.current = false;
            onCloseScan();
          }}
        >
          <X color="white" size={28} />
        </TouchableOpacity>

        <View style={styles.scannerOverlay}>
          <View style={styles.scannerFrame} />
          <Text style={styles.scannerText}>
            Point camera at barcode
          </Text>
        </View>
      </View>
    );
  }

  // Scan Mode (Default view - not actively scanning)
  return (
    <View style={styles.mainContent}>
      {Platform.OS !== 'web' && (
        <>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={handleScanPress}
            activeOpacity={0.8}
          >
            <CameraIcon color="white" size={64} strokeWidth={2} />
            <Text style={styles.scanButtonText}>Scan Barcode</Text>
          </TouchableOpacity>

          <Text style={styles.helperText}>
            Point your camera at any product barcode
          </Text>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={onToggleToSearch}
          >
            <Text style={styles.toggleText}>Or search by name</Text>
            <ChevronDown color="#22c55e" size={20} />
          </TouchableOpacity>
        </>
      )}
      {Platform.OS === 'web' && (
        <View style={styles.webNotice}>
          <Text style={styles.webNoticeText}>
            📱 Barcode scanning available on mobile app
          </Text>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={onToggleToSearch}
          >
            <Text style={styles.toggleText}>Try "Search by name" instead</Text>
            <ChevronDown color="#22c55e" size={20} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
