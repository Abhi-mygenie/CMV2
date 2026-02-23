import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, RefreshControl, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, X, Edit2, Trash2, Settings, ToggleLeft, ToggleRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { whatsappAPI } from '../../src/services/api';

// Available events
const AUTOMATION_EVENTS = [
  { value: 'points_earned', label: 'Points Earned' },
  { value: 'points_redeemed', label: 'Points Redeemed' },
  { value: 'bonus_points', label: 'Bonus Points Awarded' },
  { value: 'wallet_credit', label: 'Wallet Credit' },
  { value: 'wallet_debit', label: 'Wallet Debit' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'first_visit', label: 'First Visit' },
  { value: 'tier_upgrade', label: 'Tier Upgrade' },
  { value: 'coupon_earned', label: 'Coupon Earned' },
  { value: 'points_expiring', label: 'Points Expiring' },
  { value: 'feedback_received', label: 'Feedback Received' },
  { value: 'inactive_reminder', label: 'Inactive Reminder' },
];

// Rule Form Modal
const RuleFormModal = ({ visible, onClose, rule, templates, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    event: '',
    template_id: '',
    delay_minutes: '0',
    enabled: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name || '',
        event: rule.event || '',
        template_id: rule.template_id || '',
        delay_minutes: rule.delay_minutes?.toString() || '0',
        enabled: rule.enabled !== false,
      });
    } else {
      setFormData({
        name: '',
        event: '',
        template_id: '',
        delay_minutes: '0',
        enabled: true,
      });
    }
    setError('');
  }, [rule, visible]);

  const handleSave = async () => {
    if (!formData.name || !formData.event || !formData.template_id) {
      setError('Name, event, and template are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = {
        ...formData,
        delay_minutes: parseInt(formData.delay_minutes) || 0,
      };

      if (rule) {
        await whatsappAPI.updateAutomationRule(rule.id, data);
      } else {
        await whatsappAPI.createAutomationRule(data);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save rule');
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
            {rule ? 'Edit Rule' : 'New Rule'}
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
            <Text className="text-gray-700 font-medium mb-2">Rule Name *</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
              value={formData.name}
              onChangeText={(v) => setFormData(p => ({ ...p, name: v }))}
              placeholder="e.g., Welcome New Customer"
            />
          </View>

          <View className="mt-4">
            <Text className="text-gray-700 font-medium mb-2">Trigger Event *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row">
                {AUTOMATION_EVENTS.map((event) => (
                  <TouchableOpacity
                    key={event.value}
                    className={`px-4 py-2 rounded-lg mr-2 ${
                      formData.event === event.value ? 'bg-primary-500' : 'bg-gray-100'
                    }`}
                    onPress={() => setFormData(p => ({ ...p, event: event.value }))}
                  >
                    <Text className={`${
                      formData.event === event.value ? 'text-white' : 'text-gray-700'
                    }`}>
                      {event.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View className="mt-4">
            <Text className="text-gray-700 font-medium mb-2">Message Template *</Text>
            {templates.length === 0 ? (
              <Text className="text-gray-500 text-sm">No templates available. Create one first.</Text>
            ) : (
              <View className="flex-row flex-wrap">
                {templates.map((template) => (
                  <TouchableOpacity
                    key={template.id}
                    className={`px-4 py-2 rounded-lg mr-2 mb-2 ${
                      formData.template_id === template.id ? 'bg-secondary-500' : 'bg-gray-100'
                    }`}
                    onPress={() => setFormData(p => ({ ...p, template_id: template.id }))}
                  >
                    <Text className={`${
                      formData.template_id === template.id ? 'text-white' : 'text-gray-700'
                    }`}>
                      {template.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View className="mt-4">
            <Text className="text-gray-700 font-medium mb-2">Delay (minutes)</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
              value={formData.delay_minutes}
              onChangeText={(v) => setFormData(p => ({ ...p, delay_minutes: v }))}
              placeholder="0"
              keyboardType="number-pad"
            />
            <Text className="text-gray-400 text-sm mt-1">
              Wait time before sending the message (0 = immediate)
            </Text>
          </View>

          <View className="mt-4 flex-row items-center justify-between">
            <Text className="text-gray-700 font-medium">Enabled</Text>
            <Switch
              value={formData.enabled}
              onValueChange={(v) => setFormData(p => ({ ...p, enabled: v }))}
              trackColor={{ true: '#22c55e' }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default function WhatsAppAutomationScreen() {
  const router = useRouter();
  const [rules, setRules] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editRule, setEditRule] = useState(null);

  const fetchData = async () => {
    try {
      const [rulesRes, templatesRes] = await Promise.all([
        whatsappAPI.getAutomationRules(),
        whatsappAPI.getTemplates(),
      ]);
      setRules(rulesRes.data || []);
      setTemplates(templatesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleToggle = async (rule) => {
    try {
      await whatsappAPI.toggleAutomationRule(rule.id);
      fetchData();
    } catch (error) {
      Alert.alert('Error', 'Failed to toggle rule');
    }
  };

  const handleEdit = (rule) => {
    setEditRule(rule);
    setShowFormModal(true);
  };

  const handleDelete = (rule) => {
    Alert.alert(
      'Delete Rule',
      `Are you sure you want to delete "${rule.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await whatsappAPI.deleteAutomationRule(rule.id);
              fetchData();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete rule');
            }
          },
        },
      ]
    );
  };

  const handleSave = () => {
    setEditRule(null);
    fetchData();
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
    setEditRule(null);
  };

  const getEventLabel = (eventValue) => {
    const event = AUTOMATION_EVENTS.find(e => e.value === eventValue);
    return event?.label || eventValue;
  };

  const getTemplateName = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    return template?.name || 'Unknown';
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 flex-1">Automation Rules</Text>
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
        {rules.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Settings size={48} color="#d1d5db" />
            <Text className="text-gray-500 mt-4">No automation rules yet</Text>
            <Text className="text-gray-400 text-sm text-center mt-1">
              Create rules to automate WhatsApp messages
            </Text>
            <TouchableOpacity
              className="mt-4 bg-primary-500 px-6 py-3 rounded-lg"
              onPress={() => setShowFormModal(true)}
            >
              <Text className="text-white font-medium">Create First Rule</Text>
            </TouchableOpacity>
          </View>
        ) : (
          rules.map((rule) => (
            <View
              key={rule.id}
              className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold">{rule.name}</Text>
                  <View className="flex-row flex-wrap mt-2">
                    <View className="bg-primary-50 px-2 py-1 rounded mr-2 mb-1">
                      <Text className="text-primary-600 text-xs">{getEventLabel(rule.event)}</Text>
                    </View>
                    <View className="bg-secondary-50 px-2 py-1 rounded mr-2 mb-1">
                      <Text className="text-secondary-600 text-xs">{getTemplateName(rule.template_id)}</Text>
                    </View>
                    {rule.delay_minutes > 0 && (
                      <View className="bg-gray-100 px-2 py-1 rounded mb-1">
                        <Text className="text-gray-600 text-xs">{rule.delay_minutes}min delay</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View className="flex-row items-center">
                  <TouchableOpacity onPress={() => handleToggle(rule)} className="mr-2">
                    {rule.enabled ? (
                      <ToggleRight size={28} color="#22c55e" />
                    ) : (
                      <ToggleLeft size={28} color="#9ca3af" />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity className="p-2" onPress={() => handleEdit(rule)}>
                    <Edit2 size={18} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity className="p-2" onPress={() => handleDelete(rule)}>
                    <Trash2 size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <RuleFormModal
        visible={showFormModal}
        onClose={handleCloseModal}
        rule={editRule}
        templates={templates}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}
