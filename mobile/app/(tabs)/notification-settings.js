import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, BellOff, Smartphone, Info } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useNotificationContext } from '../../src/contexts/NotificationContext';
import { registerForPushNotificationsAsync, scheduleLocalNotification } from '../../src/services/notifications';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const { expoPushToken, permissionGranted } = useNotificationContext();
  
  const [settings, setSettings] = useState({
    pointsNotifications: true,
    tierNotifications: true,
    feedbackNotifications: true,
    promotionalNotifications: false,
    walletNotifications: true,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
    // In a real app, you'd save this to backend/storage
  };

  const handleRequestPermission = async () => {
    const token = await registerForPushNotificationsAsync();
    if (!token) {
      Alert.alert(
        'Permission Required',
        'Please enable notifications in your device settings to receive updates.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  const handleTestNotification = async () => {
    await scheduleLocalNotification({
      title: 'Test Notification 🔔',
      body: 'Push notifications are working correctly!',
      data: { type: 'test' },
    });
    Alert.alert('Success', 'Test notification sent!');
  };

  const SettingRow = ({ title, subtitle, value, onToggle }) => (
    <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
      <View className="flex-1 pr-4">
        <Text className="text-gray-900 font-medium">{title}</Text>
        {subtitle && <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ true: '#22c55e' }}
        disabled={!permissionGranted}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Notifications</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Permission Status */}
        <View className="mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center">
            {permissionGranted ? (
              <>
                <View className="bg-green-100 rounded-full p-2 mr-3">
                  <Bell size={24} color="#22c55e" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold">Notifications Enabled</Text>
                  <Text className="text-gray-500 text-sm">You'll receive updates about your loyalty program</Text>
                </View>
              </>
            ) : (
              <>
                <View className="bg-gray-100 rounded-full p-2 mr-3">
                  <BellOff size={24} color="#9ca3af" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold">Notifications Disabled</Text>
                  <Text className="text-gray-500 text-sm">Enable to receive important updates</Text>
                </View>
              </>
            )}
          </View>
          
          {!permissionGranted && (
            <TouchableOpacity
              className="bg-primary-500 rounded-lg py-3 mt-4"
              onPress={handleRequestPermission}
            >
              <Text className="text-white text-center font-semibold">Enable Notifications</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notification Types */}
        <View className="mx-4 mt-6">
          <Text className="text-gray-500 text-sm font-medium mb-2">NOTIFICATION TYPES</Text>
          <View className="bg-white rounded-xl px-4 shadow-sm">
            <SettingRow
              title="Points Updates"
              subtitle="When customers earn or redeem points"
              value={settings.pointsNotifications}
              onToggle={() => toggleSetting('pointsNotifications')}
            />
            <SettingRow
              title="Tier Changes"
              subtitle="When customers upgrade their tier"
              value={settings.tierNotifications}
              onToggle={() => toggleSetting('tierNotifications')}
            />
            <SettingRow
              title="Feedback Alerts"
              subtitle="When customers leave feedback"
              value={settings.feedbackNotifications}
              onToggle={() => toggleSetting('feedbackNotifications')}
            />
            <SettingRow
              title="Wallet Updates"
              subtitle="When wallet balance changes"
              value={settings.walletNotifications}
              onToggle={() => toggleSetting('walletNotifications')}
            />
            <SettingRow
              title="Promotions"
              subtitle="Special offers and marketing"
              value={settings.promotionalNotifications}
              onToggle={() => toggleSetting('promotionalNotifications')}
            />
          </View>
        </View>

        {/* Test & Info */}
        {permissionGranted && (
          <View className="mx-4 mt-6">
            <Text className="text-gray-500 text-sm font-medium mb-2">TESTING</Text>
            <TouchableOpacity
              className="bg-white rounded-xl p-4 shadow-sm flex-row items-center"
              onPress={handleTestNotification}
            >
              <View className="bg-primary-100 rounded-full p-2 mr-3">
                <Smartphone size={20} color="#f97316" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">Send Test Notification</Text>
                <Text className="text-gray-500 text-sm">Verify notifications are working</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Push Token Info (for debugging) */}
        {expoPushToken && (
          <View className="mx-4 mt-6 mb-8">
            <View className="bg-gray-100 rounded-xl p-4">
              <View className="flex-row items-center mb-2">
                <Info size={16} color="#9ca3af" />
                <Text className="text-gray-500 text-sm ml-2">Device Token</Text>
              </View>
              <Text className="text-gray-600 text-xs font-mono" numberOfLines={2}>
                {expoPushToken}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
