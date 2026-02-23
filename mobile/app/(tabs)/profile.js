import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/contexts/AuthContext';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import api from '../../src/services/api';

export default function ProfileScreen() {
  const { user, checkAuth } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    restaurant_name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        restaurant_name: user.restaurant_name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!formData.restaurant_name || !formData.email) {
      setError('Restaurant name and email are required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.put('/auth/profile', formData);
      setSuccess('Profile updated successfully');
      await checkAuth(); // Refresh user data
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Edit Profile</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Avatar */}
        <View className="items-center mb-6">
          <View className="relative">
            <View className="w-24 h-24 bg-primary-100 rounded-full items-center justify-center">
              <Text className="text-primary-600 text-3xl font-bold">
                {formData.restaurant_name?.charAt(0)?.toUpperCase() || 'R'}
              </Text>
            </View>
            <TouchableOpacity className="absolute bottom-0 right-0 bg-primary-500 rounded-full p-2">
              <Camera size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        {error ? (
          <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <Text className="text-red-600 text-center">{error}</Text>
          </View>
        ) : null}

        {success ? (
          <View className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <Text className="text-green-600 text-center">{success}</Text>
          </View>
        ) : null}

        {/* Form */}
        <View className="bg-white rounded-xl p-4 shadow-sm">
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Restaurant Name *</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
              value={formData.restaurant_name}
              onChangeText={(v) => setFormData(p => ({ ...p, restaurant_name: v }))}
              placeholder="Your Restaurant Name"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Email *</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
              value={formData.email}
              onChangeText={(v) => setFormData(p => ({ ...p, email: v }))}
              placeholder="owner@restaurant.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Phone</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
              value={formData.phone}
              onChangeText={(v) => setFormData(p => ({ ...p, phone: v }))}
              placeholder="+1 234 567 8900"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          className={`bg-primary-500 rounded-lg py-4 mt-6 ${loading ? 'opacity-70' : ''}`}
          onPress={handleSave}
          disabled={loading}
        >
          <Text className="text-white text-center font-semibold">
            {loading ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>

        {/* Change Password Section */}
        <View className="bg-white rounded-xl p-4 shadow-sm mt-6">
          <Text className="text-gray-900 font-semibold mb-3">Security</Text>
          <TouchableOpacity
            className="flex-row items-center justify-between py-3 border-t border-gray-100"
            onPress={() => Alert.alert('Coming Soon', 'Change password feature will be available soon')}
          >
            <Text className="text-gray-700">Change Password</Text>
            <Text className="text-primary-500">Update</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
