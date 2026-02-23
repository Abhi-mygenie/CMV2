import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, RefreshControl, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { segmentsAPI } from '../../src/services/api';
import { Plus, X, Users, Filter, ChevronRight, Trash2, Edit2 } from 'lucide-react-native';

// Segment Modal
const SegmentModal = ({ visible, onClose, segment, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    filters: {
      tier: '',
      min_points: '',
      max_points: '',
      min_visits: '',
      inactive_days: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (segment) {
      setFormData({
        name: segment.name || '',
        description: segment.description || '',
        filters: {
          tier: segment.filters?.tier || '',
          min_points: segment.filters?.min_points?.toString() || '',
          max_points: segment.filters?.max_points?.toString() || '',
          min_visits: segment.filters?.min_visits?.toString() || '',
          inactive_days: segment.filters?.inactive_days?.toString() || '',
        },
      });
    } else {
      setFormData({
        name: '',
        description: '',
        filters: {
          tier: '',
          min_points: '',
          max_points: '',
          min_visits: '',
          inactive_days: '',
        },
      });
    }
    setError('');
  }, [segment, visible]);

  const handleSave = async () => {
    if (!formData.name) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const filters = {};
      if (formData.filters.tier) filters.tier = formData.filters.tier;
      if (formData.filters.min_points) filters.min_points = parseInt(formData.filters.min_points);
      if (formData.filters.max_points) filters.max_points = parseInt(formData.filters.max_points);
      if (formData.filters.min_visits) filters.min_visits = parseInt(formData.filters.min_visits);
      if (formData.filters.inactive_days) filters.inactive_days = parseInt(formData.filters.inactive_days);

      const data = {
        name: formData.name,
        description: formData.description,
        filters,
      };

      if (segment) {
        await segmentsAPI.update(segment.id, data);
      } else {
        await segmentsAPI.create(data);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save segment');
    } finally {
      setLoading(false);
    }
  };

  const tierOptions = ['', 'bronze', 'silver', 'gold', 'platinum'];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold">
            {segment ? 'Edit Segment' : 'Create Segment'}
          </Text>
          <TouchableOpacity onPress={handleSave} disabled={loading}>
            <Text className={`text-primary-500 font-semibold ${loading ? 'opacity-50' : ''}`}>
              {loading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4 py-4">
          {error ? (
            <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <Text className="text-red-600 text-center">{error}</Text>
            </View>
          ) : null}

          <View>
            <Text className="text-gray-700 font-medium mb-2">Segment Name *</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
              placeholder="e.g., VIP Customers"
              value={formData.name}
              onChangeText={(v) => setFormData(p => ({ ...p, name: v }))}
            />
          </View>

          <View className="mt-4">
            <Text className="text-gray-700 font-medium mb-2">Description</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
              placeholder="Describe this segment"
              value={formData.description}
              onChangeText={(v) => setFormData(p => ({ ...p, description: v }))}
              multiline
            />
          </View>

          <Text className="text-lg font-semibold text-gray-900 mt-6 mb-3">Filters</Text>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Tier</Text>
            <View className="flex-row flex-wrap">
              {tierOptions.map((tier) => (
                <TouchableOpacity
                  key={tier || 'all'}
                  className={`px-4 py-2 rounded-lg mr-2 mb-2 ${
                    formData.filters.tier === tier ? 'bg-primary-500' : 'bg-gray-100'
                  }`}
                  onPress={() => setFormData(p => ({
                    ...p,
                    filters: { ...p.filters, tier }
                  }))}
                >
                  <Text className={`capitalize ${
                    formData.filters.tier === tier ? 'text-white' : 'text-gray-700'
                  }`}>
                    {tier || 'All Tiers'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="flex-row mt-4">
            <View className="flex-1 mr-2">
              <Text className="text-gray-700 font-medium mb-2">Min Points</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                placeholder="0"
                value={formData.filters.min_points}
                onChangeText={(v) => setFormData(p => ({
                  ...p,
                  filters: { ...p.filters, min_points: v }
                }))}
                keyboardType="number-pad"
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-gray-700 font-medium mb-2">Max Points</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                placeholder="10000"
                value={formData.filters.max_points}
                onChangeText={(v) => setFormData(p => ({
                  ...p,
                  filters: { ...p.filters, max_points: v }
                }))}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View className="flex-row mt-4">
            <View className="flex-1 mr-2">
              <Text className="text-gray-700 font-medium mb-2">Min Visits</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                placeholder="0"
                value={formData.filters.min_visits}
                onChangeText={(v) => setFormData(p => ({
                  ...p,
                  filters: { ...p.filters, min_visits: v }
                }))}
                keyboardType="number-pad"
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-gray-700 font-medium mb-2">Inactive Days</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                placeholder="30"
                value={formData.filters.inactive_days}
                onChangeText={(v) => setFormData(p => ({
                  ...p,
                  filters: { ...p.filters, inactive_days: v }
                }))}
                keyboardType="number-pad"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default function SegmentsScreen() {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editSegment, setEditSegment] = useState(null);

  const fetchSegments = async () => {
    try {
      const response = await segmentsAPI.getAll();
      setSegments(response.data || []);
    } catch (error) {
      console.error('Error fetching segments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSegments();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSegments();
    setRefreshing(false);
  }, []);

  const handleDelete = (segment) => {
    Alert.alert(
      'Delete Segment',
      `Are you sure you want to delete "${segment.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await segmentsAPI.delete(segment.id);
              fetchSegments();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete segment');
            }
          },
        },
      ]
    );
  };

  const handleEdit = (segment) => {
    setEditSegment(segment);
    setShowModal(true);
  };

  const handleSave = () => {
    setEditSegment(null);
    fetchSegments();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditSegment(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-900">Segments</Text>
          <TouchableOpacity
            className="bg-primary-500 px-4 py-2 rounded-lg flex-row items-center"
            onPress={() => setShowModal(true)}
          >
            <Plus size={18} color="#ffffff" />
            <Text className="text-white font-medium ml-1">Create</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" />
        }
      >
        {segments.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Filter size={48} color="#d1d5db" />
            <Text className="text-gray-500 mt-4 text-center">No segments yet</Text>
            <Text className="text-gray-400 text-sm text-center mt-1">
              Create segments to group customers
            </Text>
            <TouchableOpacity
              className="mt-4 bg-primary-500 px-6 py-3 rounded-lg"
              onPress={() => setShowModal(true)}
            >
              <Text className="text-white font-medium">Create First Segment</Text>
            </TouchableOpacity>
          </View>
        ) : (
          segments.map((segment) => (
            <View
              key={segment.id}
              className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold text-lg">{segment.name}</Text>
                  {segment.description && (
                    <Text className="text-gray-500 text-sm mt-1">{segment.description}</Text>
                  )}
                </View>
                <View className="flex-row">
                  <TouchableOpacity
                    className="p-2"
                    onPress={() => handleEdit(segment)}
                  >
                    <Edit2 size={18} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="p-2"
                    onPress={() => handleDelete(segment)}
                  >
                    <Trash2 size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Filters Display */}
              <View className="flex-row flex-wrap mt-3">
                {segment.filters?.tier && (
                  <View className="bg-primary-50 px-2 py-1 rounded mr-2 mb-1">
                    <Text className="text-primary-600 text-xs capitalize">{segment.filters.tier}</Text>
                  </View>
                )}
                {segment.filters?.min_points && (
                  <View className="bg-secondary-50 px-2 py-1 rounded mr-2 mb-1">
                    <Text className="text-secondary-600 text-xs">Min {segment.filters.min_points} pts</Text>
                  </View>
                )}
                {segment.filters?.min_visits && (
                  <View className="bg-blue-50 px-2 py-1 rounded mr-2 mb-1">
                    <Text className="text-blue-600 text-xs">Min {segment.filters.min_visits} visits</Text>
                  </View>
                )}
              </View>

              <View className="flex-row items-center mt-3 pt-3 border-t border-gray-100">
                <Users size={16} color="#9ca3af" />
                <Text className="text-gray-500 text-sm ml-2">
                  {segment.customer_count ?? 0} customers
                </Text>
              </View>
            </View>
          ))
        )}
        <View className="h-8" />
      </ScrollView>

      <SegmentModal
        visible={showModal}
        onClose={handleCloseModal}
        segment={editSegment}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}
