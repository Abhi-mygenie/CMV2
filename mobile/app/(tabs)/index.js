import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/contexts/AuthContext';
import { analyticsAPI, customersAPI } from '../../src/services/api';
import { Plus, QrCode, TrendingUp, TrendingDown, Users, Star, ScanLine } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import QRCodeModal from '../../src/components/QRCodeModal';
import QRScannerModal from '../../src/components/QRScannerModal';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);

  const fetchData = async () => {
    try {
      const [analyticsRes, customersRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        customersAPI.getAll({ limit: 5, sort: '-created_at' }),
      ]);
      setAnalytics(analyticsRes.data);
      setRecentCustomers(customersRes.data.customers || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <View className={`bg-white rounded-xl p-4 flex-1 mx-1 shadow-sm border border-gray-100`}>
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-gray-500 text-xs font-medium uppercase">{title}</Text>
        {trend && (
          trend > 0 ? 
            <TrendingUp size={14} color="#22c55e" /> : 
            <TrendingDown size={14} color="#ef4444" />
        )}
      </View>
      <Text className="text-2xl font-bold text-gray-900">
        {value ?? 'N/A'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" />
        }
      >
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-gray-500 text-sm">Welcome back</Text>
          <Text className="text-2xl font-bold text-gray-900">{user?.restaurant_name || 'Restaurant'}</Text>
        </View>

        {/* Main Stats Card */}
        <View className="mx-4 mt-4">
          <View className="bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl p-5" style={{ backgroundColor: '#22c55e' }}>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white/80 text-sm">Total Customers</Text>
                <Text className="text-white text-4xl font-bold mt-1">
                  {analytics?.total_customers ?? 0}
                </Text>
                <Text className="text-white/80 text-sm mt-1">
                  +{analytics?.customers_this_week ?? 0} this week
                </Text>
              </View>
              <View className="bg-white/20 rounded-full p-4">
                <Users size={32} color="#ffffff" />
              </View>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View className="flex-row px-3 mt-4">
          <StatCard 
            title="Points Issued" 
            value={analytics?.total_points_issued ?? 0}
            trend={1}
          />
          <StatCard 
            title="Redeemed" 
            value={analytics?.total_points_redeemed ?? 0}
          />
        </View>

        <View className="flex-row px-3 mt-2">
          <StatCard 
            title="Active (30d)" 
            value={analytics?.active_customers ?? 0}
          />
          <StatCard 
            title="Avg Rating" 
            value={analytics?.average_rating ? analytics.average_rating.toFixed(1) : 'N/A'}
          />
        </View>

        {/* Quick Actions */}
        <View className="px-4 mt-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</Text>
          <View className="flex-row">
            <TouchableOpacity 
              className="flex-1 bg-white rounded-xl p-4 mr-2 items-center shadow-sm border border-gray-100"
              onPress={() => router.push('/(tabs)/customers?action=add')}
            >
              <View className="bg-primary-100 rounded-full p-3 mb-2">
                <Plus size={24} color="#f97316" />
              </View>
              <Text className="text-gray-700 font-medium">Add Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 bg-white rounded-xl p-4 ml-2 items-center shadow-sm border border-gray-100"
              onPress={() => {}}
            >
              <View className="bg-secondary-100 rounded-full p-3 mb-2">
                <QrCode size={24} color="#22c55e" />
              </View>
              <Text className="text-gray-700 font-medium">Show QR</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Customers */}
        <View className="px-4 mt-6 mb-8">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-gray-900">Recent Customers</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/customers')}>
              <Text className="text-primary-500 font-medium">View all</Text>
            </TouchableOpacity>
          </View>
          
          {recentCustomers.length === 0 ? (
            <View className="bg-white rounded-xl p-6 items-center">
              <Text className="text-gray-500">No customers yet</Text>
              <TouchableOpacity 
                className="mt-3 bg-primary-500 px-4 py-2 rounded-lg"
                onPress={() => router.push('/(tabs)/customers?action=add')}
              >
                <Text className="text-white font-medium">Add First Customer</Text>
              </TouchableOpacity>
            </View>
          ) : (
            recentCustomers.map((customer) => (
              <TouchableOpacity 
                key={customer.id}
                className="bg-white rounded-xl p-4 mb-2 flex-row items-center shadow-sm border border-gray-100"
                onPress={() => router.push(`/(tabs)/customers?id=${customer.id}`)}
              >
                <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-primary-600 font-semibold">
                    {customer.name?.charAt(0)?.toUpperCase() || '?'}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-medium">{customer.name}</Text>
                  <Text className="text-gray-500 text-sm">{customer.phone}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-secondary-600 font-semibold">{customer.points_balance ?? 0} pts</Text>
                  <Text className="text-gray-400 text-xs capitalize">{customer.tier || 'Bronze'}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
