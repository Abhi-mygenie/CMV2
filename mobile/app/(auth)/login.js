import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-6 py-8">
          {/* Logo */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-secondary-500 rounded-full items-center justify-center mb-3">
              <Text className="text-white text-3xl font-bold">M</Text>
            </View>
            <Text className="text-3xl font-bold">
              <Text className="text-secondary-500">my</Text>
              <Text className="text-primary-500">genie</Text>
            </Text>
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
              <Text className="text-gray-700 font-medium mb-2">Email</Text>
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

            <View className="mt-4">
              <Text className="text-gray-700 font-medium mb-2">Password</Text>
              <View className="relative">
                <TextInput
                  className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-base pr-12"
                  placeholder="Enter password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
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

            {/* Forgot Password */}
            <View className="flex-row justify-end mt-2">
              <Link href="/(auth)/forgot-password" asChild>
                <TouchableOpacity>
                  <Text className="text-primary-500 text-sm">Forgot password?</Text>
                </TouchableOpacity>
              </Link>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              className={`bg-primary-500 rounded-lg py-4 mt-6 ${loading ? 'opacity-70' : ''}`}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text className="text-white text-center font-semibold text-base">
                {loading ? 'Signing in...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-600">Don't have an account? </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity>
                  <Text className="text-primary-500 font-semibold">Sign up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
