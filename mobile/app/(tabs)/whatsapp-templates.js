import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, X, Edit2, Trash2, MessageCircle, Copy } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { whatsappAPI } from '../../src/services/api';

// Available variables for templates
const TEMPLATE_VARIABLES = [
  '{{customer_name}}',
  '{{points_earned}}',
  '{{points_balance}}',
  '{{wallet_balance}}',
  '{{amount}}',
  '{{tier}}',
  '{{restaurant_name}}',
  '{{coupon_code}}',
  '{{expiry_date}}',
];

// Template Form Modal
const TemplateFormModal = ({ visible, onClose, template, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || '',
        content: template.content || '',
      });
    } else {
      setFormData({ name: '', content: '' });
    }
    setError('');
  }, [template, visible]);

  const insertVariable = (variable) => {
    setFormData(p => ({
      ...p,
      content: p.content + variable,
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.content) {
      setError('Name and content are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (template) {
        await whatsappAPI.updateTemplate(template.id, formData);
      } else {
        await whatsappAPI.createTemplate(formData);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save template');
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
          <Text className="text-lg font-semibold">
            {template ? 'Edit Template' : 'New Template'}
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
            <Text className="text-gray-700 font-medium mb-2">Template Name *</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
              value={formData.name}
              onChangeText={(v) => setFormData(p => ({ ...p, name: v }))}
              placeholder="e.g., Welcome Message"
            />
          </View>

          <View className="mt-4">
            <Text className="text-gray-700 font-medium mb-2">Message Content *</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 h-32"
              value={formData.content}
              onChangeText={(v) => setFormData(p => ({ ...p, content: v }))}
              placeholder="Type your message here..."
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Variables */}
          <View className="mt-4">
            <Text className="text-gray-700 font-medium mb-2">Insert Variables</Text>
            <View className="flex-row flex-wrap">
              {TEMPLATE_VARIABLES.map((variable) => (
                <TouchableOpacity
                  key={variable}
                  className="bg-primary-50 px-3 py-2 rounded-lg mr-2 mb-2"
                  onPress={() => insertVariable(variable)}
                >
                  <Text className="text-primary-600 text-sm">{variable}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preview */}
          {formData.content ? (
            <View className="mt-6">
              <Text className="text-gray-700 font-medium mb-2">Preview</Text>
              <View className="bg-green-50 rounded-lg p-4 border border-green-200">
                <Text className="text-gray-800">
                  {formData.content
                    .replace('{{customer_name}}', 'John Doe')
                    .replace('{{points_earned}}', '50')
                    .replace('{{points_balance}}', '500')
                    .replace('{{wallet_balance}}', '$25.00')
                    .replace('{{amount}}', '$100.00')
                    .replace('{{tier}}', 'Gold')
                    .replace('{{restaurant_name}}', 'Demo Restaurant')
                    .replace('{{coupon_code}}', 'SAVE20')
                    .replace('{{expiry_date}}', '2026-03-31')}
                </Text>
              </View>
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default function WhatsAppTemplatesScreen() {
  const router = useRouter();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null);

  const fetchTemplates = async () => {
    try {
      const response = await whatsappAPI.getTemplates();
      setTemplates(response.data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTemplates();
    setRefreshing(false);
  };

  const handleEdit = (template) => {
    setEditTemplate(template);
    setShowFormModal(true);
  };

  const handleDelete = (template) => {
    Alert.alert(
      'Delete Template',
      `Are you sure you want to delete "${template.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await whatsappAPI.deleteTemplate(template.id);
              fetchTemplates();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete template');
            }
          },
        },
      ]
    );
  };

  const handleSave = () => {
    setEditTemplate(null);
    fetchTemplates();
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
    setEditTemplate(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 flex-1">WhatsApp Templates</Text>
        <TouchableOpacity
          className="bg-primary-500 px-3 py-2 rounded-lg flex-row items-center"
          onPress={() => setShowFormModal(true)}
        >
          <Plus size={18} color="#ffffff" />
          <Text className="text-white font-medium ml-1">New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" />
        }
      >
        {templates.length === 0 ? (
          <View className="items-center justify-center py-12">
            <MessageCircle size={48} color="#d1d5db" />
            <Text className="text-gray-500 mt-4">No templates yet</Text>
            <Text className="text-gray-400 text-sm text-center mt-1">
              Create templates for automated messages
            </Text>
            <TouchableOpacity
              className="mt-4 bg-primary-500 px-6 py-3 rounded-lg"
              onPress={() => setShowFormModal(true)}
            >
              <Text className="text-white font-medium">Create First Template</Text>
            </TouchableOpacity>
          </View>
        ) : (
          templates.map((template) => (
            <View
              key={template.id}
              className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold">{template.name}</Text>
                  <Text className="text-gray-600 text-sm mt-2" numberOfLines={3}>
                    {template.content}
                  </Text>
                </View>
                <View className="flex-row ml-2">
                  <TouchableOpacity
                    className="p-2"
                    onPress={() => handleEdit(template)}
                  >
                    <Edit2 size={18} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="p-2"
                    onPress={() => handleDelete(template)}
                  >
                    <Trash2 size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TemplateFormModal
        visible={showFormModal}
        onClose={handleCloseModal}
        template={editTemplate}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}
