import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { feedbackAPI } from '../../src/services/api';
import { Star, MessageSquare, TrendingUp } from 'lucide-react-native';

const StarRating = ({ rating, size = 16 }) => {
  return (
    <View className="flex-row">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          color={star <= rating ? '#fbbf24' : '#e5e7eb'}
          fill={star <= rating ? '#fbbf24' : 'transparent'}
        />
      ))}
    </View>
  );
};

export default function FeedbackScreen() {
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState({ average: 0, total: 0, distribution: {} });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFeedback = async () => {
    try {
      const response = await feedbackAPI.getAll({ limit: 50 });
      const data = response.data.feedback || response.data || [];
      setFeedback(data);

      // Calculate stats
      if (data.length > 0) {
        const total = data.length;
        const sum = data.reduce((acc, f) => acc + (f.rating || 0), 0);
        const average = sum / total;
        
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        data.forEach(f => {
          if (f.rating >= 1 && f.rating <= 5) {
            distribution[f.rating]++;
          }
        });

        setStats({ average, total, distribution });
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFeedback();
    setRefreshing(false);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Feedback</Text>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" />
        }
      >
        {/* Stats Card */}
        <View className="mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-500 text-sm">Average Rating</Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-3xl font-bold text-gray-900">
                  {stats.average.toFixed(1)}
                </Text>
                <View className="ml-2">
                  <StarRating rating={Math.round(stats.average)} size={18} />
                </View>
              </View>
              <Text className="text-gray-400 text-sm mt-1">
                Based on {stats.total} reviews
              </Text>
            </View>
            <View className="bg-primary-50 rounded-full p-3">
              <TrendingUp size={28} color="#f97316" />
            </View>
          </View>

          {/* Rating Distribution */}
          <View className="mt-4 pt-4 border-t border-gray-100">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.distribution[rating] || 0;
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              
              return (
                <View key={rating} className="flex-row items-center mb-2">
                  <Text className="w-4 text-gray-600 text-sm">{rating}</Text>
                  <Star size={12} color="#fbbf24" fill="#fbbf24" />
                  <View className="flex-1 h-2 bg-gray-100 rounded-full mx-2">
                    <View
                      className="h-2 bg-yellow-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </View>
                  <Text className="w-8 text-gray-500 text-xs text-right">{count}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Feedback List */}
        <View className="px-4 mt-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Recent Feedback</Text>
          
          {feedback.length === 0 ? (
            <View className="items-center justify-center py-12 bg-white rounded-xl">
              <MessageSquare size={48} color="#d1d5db" />
              <Text className="text-gray-500 mt-4">No feedback yet</Text>
            </View>
          ) : (
            feedback.map((item) => (
              <View
                key={item.id}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="text-gray-900 font-semibold">
                      {item.customer_name || 'Anonymous'}
                    </Text>
                    <StarRating rating={item.rating} size={14} />
                  </View>
                  <Text className="text-gray-400 text-xs">
                    {formatDate(item.created_at)}
                  </Text>
                </View>
                {item.comment && (
                  <Text className="text-gray-600 mt-2">{item.comment}</Text>
                )}
              </View>
            ))
          )}
        </View>
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
