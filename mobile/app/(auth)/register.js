import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react-native';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    restaurant_name: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.restaurant_name) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = await register(formData);
    
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-6 py-8">
          {/* Back Button */}
          <TouchableOpacity 
            className="mb-4"
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>

          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900">Create Account</Text>
            <Text className="text-gray-600 mt-1">Sign up to get started with DinePoints</Text>
          </View>

          {/* Error Message */}
          {error ? (
            <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <Text className="text-red-600 text-center">{error}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 font-medium mb-2">Restaurant Name *</Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-base"
                placeholder="Your Restaurant Name"
                value={formData.restaurant_name}
                onChangeText={(v) => updateField('restaurant_name', v)}
              />
            </View>

            <View className="mt-4">
              <Text className="text-gray-700 font-medium mb-2">Email *</Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-base"
                placeholder="owner@restaurant.com"
                value={formData.email}
                onChangeText={(v) => updateField('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View className="mt-4">
              <Text className="text-gray-700 font-medium mb-2">Phone</Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-base"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChangeText={(v) => updateField('phone', v)}
                keyboardType="phone-pad"
              />
            </View>

            <View className="mt-4">
              <Text className="text-gray-700 font-medium mb-2">Password *</Text>
              <View className="relative">
                <TextInput
                  className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-base pr-12"
                  placeholder="Create a password"
                  value={formData.password}
                  onChangeText={(v) => updateField('password', v)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  className="absolute right-3 top-3"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={22} color="#9ca3af" />
                  ) : (
                    <Eye size={22} color="#9ca3af" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              className={`bg-primary-500 rounded-lg py-4 mt-6 ${loading ? 'opacity-70' : ''}`}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text className="text-white text-center font-semibold text-base">
                {loading ? 'Creating account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-600">Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text className="text-primary-500 font-semibold">Sign in</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
