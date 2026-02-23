import { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Camera as CameraIcon } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function QRScannerModal({ visible, onClose, onScan }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (visible) {
      setScanned(false);
    }
  }, [visible]);

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return;
    setScanned(true);
    
    // Parse the QR data to extract customer info
    try {
      // Assuming QR contains customer ID or registration data
      onScan(data);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Invalid QR code');
      setScanned(false);
    }
  };

  if (!permission) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-white">Scan Customer QR</Text>
          <View style={{ width: 24 }} />
        </View>

        {!permission.granted ? (
          <View className="flex-1 items-center justify-center px-6">
            <CameraIcon size={64} color="#6b7280" />
            <Text className="text-white text-center mt-4 mb-6">
              Camera permission is required to scan QR codes
            </Text>
            <TouchableOpacity
              className="bg-primary-500 px-6 py-3 rounded-lg"
              onPress={requestPermission}
            >
              <Text className="text-white font-medium">Grant Permission</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-1">
            <CameraView
              style={StyleSheet.absoluteFillObject}
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
            
            {/* Overlay */}
            <View className="flex-1 items-center justify-center">
              <View className="w-64 h-64 border-2 border-white rounded-2xl" />
              <Text className="text-white text-center mt-4">
                Position QR code within the frame
              </Text>
            </View>

            {scanned && (
              <View className="absolute bottom-10 left-0 right-0 items-center">
                <TouchableOpacity
                  className="bg-primary-500 px-6 py-3 rounded-lg"
                  onPress={() => setScanned(false)}
                >
                  <Text className="text-white font-medium">Scan Again</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}
