import { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Download, Share2 } from 'lucide-react-native';
import { qrAPI } from '../services/api';
import QRCode from 'react-native-qrcode-svg';

export default function QRCodeModal({ visible, onClose }) {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      fetchQRCode();
    }
  }, [visible]);

  const fetchQRCode = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await qrAPI.generate();
      setQrData(response.data);
    } catch (err) {
      console.error('Error generating QR:', err);
      setError('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold">Customer Registration QR</Text>
          <View style={{ width: 24 }} />
        </View>

        <View className="flex-1 items-center justify-center px-6">
          {loading ? (
            <ActivityIndicator size="large" color="#f97316" />
          ) : error ? (
            <View className="items-center">
              <Text className="text-red-500 text-center mb-4">{error}</Text>
              <TouchableOpacity
                className="bg-primary-500 px-6 py-3 rounded-lg"
                onPress={fetchQRCode}
              >
                <Text className="text-white font-medium">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : qrData ? (
            <View className="items-center">
              <View className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <QRCode
                  value={qrData.registration_url || qrData.qr_data || 'https://dinepoints.app/register'}
                  size={220}
                  color="#111827"
                  backgroundColor="#ffffff"
                />
              </View>
              
              <Text className="text-gray-600 text-center mt-6 px-4">
                Customers can scan this QR code to register for your loyalty program
              </Text>

              <View className="flex-row mt-6">
                <TouchableOpacity className="bg-gray-100 px-6 py-3 rounded-lg mr-3 flex-row items-center">
                  <Download size={18} color="#6b7280" />
                  <Text className="text-gray-700 font-medium ml-2">Save</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-primary-500 px-6 py-3 rounded-lg flex-row items-center">
                  <Share2 size={18} color="#ffffff" />
                  <Text className="text-white font-medium ml-2">Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
