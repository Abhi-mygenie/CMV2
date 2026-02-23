import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { ArrowLeft, Mail } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Note: Backend endpoint for password reset would need to be implemented
      // For now, we'll simulate the request
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSent(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <View className="bg-secondary-100 rounded-full p-6 mb-6">
            <Mail size={48} color="#22c55e" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 text-center">Check your email</Text>
          <Text className="text-gray-600 text-center mt-3 px-4">
            We've sent password reset instructions to {email}
          </Text>
          <TouchableOpacity
            className="bg-primary-500 rounded-lg py-4 px-8 mt-8"
            onPress={() => router.replace('/(auth)/login')}
          >
            <Text className="text-white font-semibold">Back to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <SafeAreaView className="flex-1">
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
              <Text className="text-2xl font-bold text-gray-900">Forgot Password?</Text>
              <Text className="text-gray-600 mt-2">
                Enter your email address and we'll send you instructions to reset your password.
              </Text>
            </View>

            {/* Error Message */}
            {error ? (
              <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <Text className="text-red-600 text-center">{error}</Text>
              </View>
            ) : null}

            {/* Form */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">Email Address</Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-base"
                placeholder="owner@restaurant.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className={`bg-primary-500 rounded-lg py-4 mt-6 ${loading ? 'opacity-70' : ''}`}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text className="text-white text-center font-semibold text-base">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Text>
            </TouchableOpacity>

            {/* Back to Login */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-600">Remember your password? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text className="text-primary-500 font-semibold">Sign in</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
