import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch, RefreshControl, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/contexts/AuthContext';
import { loyaltyAPI, couponsAPI, whatsappAPI } from '../../src/services/api';
import { Settings as SettingsIcon, Award, Ticket, MessageCircle, ChevronRight, X, LogOut, User, Plus, Trash2, Edit2, ToggleLeft, ToggleRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Loyalty Settings Modal
const LoyaltySettingsModal = ({ visible, onClose }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchSettings();
    }
  }, [visible]);

  const fetchSettings = async () => {
    try {
      const response = await loyaltyAPI.getSettings();
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await loyaltyAPI.updateSettings(settings);
      Alert.alert('Success', 'Settings saved successfully');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!settings) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold">Loyalty Settings</Text>
          <TouchableOpacity onPress={handleSave} disabled={saving}>
            <Text className={`text-primary-500 font-semibold ${saving ? 'opacity-50' : ''}`}>
              {saving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4 py-4">
          {/* Points Earning */}
          <Text className="text-lg font-semibold text-gray-900 mb-3">Points Earning</Text>
          
          <View className="bg-gray-50 rounded-xl p-4 mb-4">
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Minimum Order Value</Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-lg px-4 py-3"
                value={settings.min_order_value?.toString()}
                onChangeText={(v) => updateSetting('min_order_value', parseFloat(v) || 0)}
                keyboardType="decimal-pad"
              />
            </View>

            <View className="flex-row mb-3">
              <View className="flex-1 mr-2">
                <Text className="text-gray-600 text-sm mb-1">Bronze %</Text>
                <TextInput
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2"
                  value={settings.bronze_earn_percent?.toString()}
                  onChangeText={(v) => updateSetting('bronze_earn_percent', parseFloat(v) || 0)}
                  keyboardType="decimal-pad"
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-gray-600 text-sm mb-1">Silver %</Text>
                <TextInput
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2"
                  value={settings.silver_earn_percent?.toString()}
                  onChangeText={(v) => updateSetting('silver_earn_percent', parseFloat(v) || 0)}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View className="flex-row">
              <View className="flex-1 mr-2">
                <Text className="text-gray-600 text-sm mb-1">Gold %</Text>
                <TextInput
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2"
                  value={settings.gold_earn_percent?.toString()}
                  onChangeText={(v) => updateSetting('gold_earn_percent', parseFloat(v) || 0)}
                  keyboardType="decimal-pad"
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-gray-600 text-sm mb-1">Platinum %</Text>
                <TextInput
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2"
                  value={settings.platinum_earn_percent?.toString()}
                  onChangeText={(v) => updateSetting('platinum_earn_percent', parseFloat(v) || 0)}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          </View>

          {/* Tier Thresholds */}
          <Text className="text-lg font-semibold text-gray-900 mb-3">Tier Thresholds</Text>
          
          <View className="bg-gray-50 rounded-xl p-4 mb-4">
            <View className="flex-row mb-3">
              <View className="flex-1 mr-2">
                <Text className="text-gray-600 text-sm mb-1">Silver Min Points</Text>
                <TextInput
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2"
                  value={settings.tier_silver_min?.toString()}
                  onChangeText={(v) => updateSetting('tier_silver_min', parseInt(v) || 0)}
                  keyboardType="number-pad"
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-gray-600 text-sm mb-1">Gold Min Points</Text>
                <TextInput
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2"
                  value={settings.tier_gold_min?.toString()}
                  onChangeText={(v) => updateSetting('tier_gold_min', parseInt(v) || 0)}
                  keyboardType="number-pad"
                />
              </View>
            </View>
            <View>
              <Text className="text-gray-600 text-sm mb-1">Platinum Min Points</Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-lg px-3 py-2"
                value={settings.tier_platinum_min?.toString()}
                onChangeText={(v) => updateSetting('tier_platinum_min', parseInt(v) || 0)}
                keyboardType="number-pad"
              />
            </View>
          </View>

          {/* Bonuses */}
          <Text className="text-lg font-semibold text-gray-900 mb-3">Bonuses</Text>
          
          <View className="bg-gray-50 rounded-xl p-4 mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-700">Birthday Bonus</Text>
              <Switch
                value={settings.birthday_bonus_enabled}
                onValueChange={(v) => updateSetting('birthday_bonus_enabled', v)}
                trackColor={{ true: '#22c55e' }}
              />
            </View>
            {settings.birthday_bonus_enabled && (
              <TextInput
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 mb-4"
                value={settings.birthday_bonus_points?.toString()}
                onChangeText={(v) => updateSetting('birthday_bonus_points', parseInt(v) || 0)}
                keyboardType="number-pad"
                placeholder="Bonus points"
              />
            )}

            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-700">Anniversary Bonus</Text>
              <Switch
                value={settings.anniversary_bonus_enabled}
                onValueChange={(v) => updateSetting('anniversary_bonus_enabled', v)}
                trackColor={{ true: '#22c55e' }}
              />
            </View>
            {settings.anniversary_bonus_enabled && (
              <TextInput
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 mb-4"
                value={settings.anniversary_bonus_points?.toString()}
                onChangeText={(v) => updateSetting('anniversary_bonus_points', parseInt(v) || 0)}
                keyboardType="number-pad"
                placeholder="Bonus points"
              />
            )}

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-700">First Visit Bonus</Text>
              <Switch
                value={settings.first_visit_bonus_enabled}
                onValueChange={(v) => updateSetting('first_visit_bonus_enabled', v)}
                trackColor={{ true: '#22c55e' }}
              />
            </View>
            {settings.first_visit_bonus_enabled && (
              <TextInput
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 mt-2"
                value={settings.first_visit_bonus_points?.toString()}
                onChangeText={(v) => updateSetting('first_visit_bonus_points', parseInt(v) || 0)}
                keyboardType="number-pad"
                placeholder="Bonus points"
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Coupons Modal
const CouponsModal = ({ visible, onClose }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    min_order_value: '',
    max_uses: '',
    description: '',
  });

  useEffect(() => {
    if (visible) {
      fetchCoupons();
    }
  }, [visible]);

  const fetchCoupons = async () => {
    try {
      const response = await couponsAPI.getAll();
      setCoupons(response.data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const data = {
        ...formData,
        discount_value: parseFloat(formData.discount_value) || 0,
        min_order_value: parseFloat(formData.min_order_value) || 0,
        max_uses: parseInt(formData.max_uses) || null,
      };

      if (editCoupon) {
        await couponsAPI.update(editCoupon.id, data);
      } else {
        await couponsAPI.create(data);
      }
      
      setShowForm(false);
      setEditCoupon(null);
      setFormData({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        min_order_value: '',
        max_uses: '',
        description: '',
      });
      fetchCoupons();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to save coupon');
    }
  };

  const handleDelete = async (coupon) => {
    Alert.alert(
      'Delete Coupon',
      `Are you sure you want to delete "${coupon.code}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await couponsAPI.delete(coupon.id);
              fetchCoupons();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete coupon');
            }
          },
        },
      ]
    );
  };

  const handleEdit = (coupon) => {
    setEditCoupon(coupon);
    setFormData({
      code: coupon.code || '',
      discount_type: coupon.discount_type || 'percentage',
      discount_value: coupon.discount_value?.toString() || '',
      min_order_value: coupon.min_order_value?.toString() || '',
      max_uses: coupon.max_uses?.toString() || '',
      description: coupon.description || '',
    });
    setShowForm(true);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
          <TouchableOpacity onPress={showForm ? () => { setShowForm(false); setEditCoupon(null); } : onClose}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold">
            {showForm ? (editCoupon ? 'Edit Coupon' : 'New Coupon') : 'Coupons'}
          </Text>
          {showForm ? (
            <TouchableOpacity onPress={handleSave}>
              <Text className="text-primary-500 font-semibold">Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setShowForm(true)}>
              <Plus size={24} color="#f97316" />
            </TouchableOpacity>
          )}
        </View>

        {showForm ? (
          <ScrollView className="flex-1 px-4 py-4">
            <View>
              <Text className="text-gray-700 font-medium mb-2">Coupon Code *</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                value={formData.code}
                onChangeText={(v) => setFormData(p => ({ ...p, code: v.toUpperCase() }))}
                placeholder="SUMMER20"
                autoCapitalize="characters"
              />
            </View>

            <View className="mt-4">
              <Text className="text-gray-700 font-medium mb-2">Discount Type</Text>
              <View className="flex-row">
                <TouchableOpacity
                  className={`flex-1 py-3 rounded-lg mr-2 ${formData.discount_type === 'percentage' ? 'bg-primary-500' : 'bg-gray-100'}`}
                  onPress={() => setFormData(p => ({ ...p, discount_type: 'percentage' }))}
                >
                  <Text className={`text-center font-medium ${formData.discount_type === 'percentage' ? 'text-white' : 'text-gray-700'}`}>
                    Percentage
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 py-3 rounded-lg ml-2 ${formData.discount_type === 'fixed' ? 'bg-primary-500' : 'bg-gray-100'}`}
                  onPress={() => setFormData(p => ({ ...p, discount_type: 'fixed' }))}
                >
                  <Text className={`text-center font-medium ${formData.discount_type === 'fixed' ? 'text-white' : 'text-gray-700'}`}>
                    Fixed Amount
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="mt-4">
              <Text className="text-gray-700 font-medium mb-2">
                Discount Value {formData.discount_type === 'percentage' ? '(%)' : '($)'}
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                value={formData.discount_value}
                onChangeText={(v) => setFormData(p => ({ ...p, discount_value: v }))}
                keyboardType="decimal-pad"
                placeholder="20"
              />
            </View>

            <View className="mt-4">
              <Text className="text-gray-700 font-medium mb-2">Minimum Order Value ($)</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                value={formData.min_order_value}
                onChangeText={(v) => setFormData(p => ({ ...p, min_order_value: v }))}
                keyboardType="decimal-pad"
                placeholder="50"
              />
            </View>

            <View className="mt-4">
              <Text className="text-gray-700 font-medium mb-2">Max Uses (leave empty for unlimited)</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                value={formData.max_uses}
                onChangeText={(v) => setFormData(p => ({ ...p, max_uses: v }))}
                keyboardType="number-pad"
                placeholder="100"
              />
            </View>

            <View className="mt-4">
              <Text className="text-gray-700 font-medium mb-2">Description</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                value={formData.description}
                onChangeText={(v) => setFormData(p => ({ ...p, description: v }))}
                placeholder="Summer sale discount"
                multiline
              />
            </View>
          </ScrollView>
        ) : (
          <ScrollView className="flex-1 px-4 py-4">
            {coupons.length === 0 ? (
              <View className="items-center justify-center py-12">
                <Ticket size={48} color="#d1d5db" />
                <Text className="text-gray-500 mt-4">No coupons yet</Text>
                <TouchableOpacity
                  className="mt-4 bg-primary-500 px-6 py-3 rounded-lg"
                  onPress={() => setShowForm(true)}
                >
                  <Text className="text-white font-medium">Create Coupon</Text>
                </TouchableOpacity>
              </View>
            ) : (
              coupons.map((coupon) => (
                <View
                  key={coupon.id}
                  className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-100"
                >
                  <View className="flex-row items-start justify-between">
                    <View>
                      <Text className="text-primary-500 font-bold text-lg">{coupon.code}</Text>
                      <Text className="text-gray-600 mt-1">
                        {coupon.discount_type === 'percentage' 
                          ? `${coupon.discount_value}% off`
                          : `$${coupon.discount_value} off`
                        }
                      </Text>
                      {coupon.description && (
                        <Text className="text-gray-500 text-sm mt-1">{coupon.description}</Text>
                      )}
                    </View>
                    <View className="flex-row">
                      <TouchableOpacity className="p-2" onPress={() => handleEdit(coupon)}>
                        <Edit2 size={18} color="#6b7280" />
                      </TouchableOpacity>
                      <TouchableOpacity className="p-2" onPress={() => handleDelete(coupon)}>
                        <Trash2 size={18} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View className="flex-row mt-2">
                    {coupon.min_order_value > 0 && (
                      <View className="bg-white px-2 py-1 rounded mr-2">
                        <Text className="text-gray-600 text-xs">Min ${coupon.min_order_value}</Text>
                      </View>
                    )}
                    <View className="bg-white px-2 py-1 rounded">
                      <Text className="text-gray-600 text-xs">
                        {coupon.uses_count ?? 0}/{coupon.max_uses || '∞'} uses
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
};

// WhatsApp Modal
const WhatsAppModal = ({ visible, onClose }) => {
  const [templates, setTemplates] = useState([]);
  const [automationRules, setAutomationRules] = useState([]);
  const [activeTab, setActiveTab] = useState('templates');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [visible]);

  const fetchData = async () => {
    try {
      const [templatesRes, rulesRes] = await Promise.all([
        whatsappAPI.getTemplates(),
        whatsappAPI.getAutomationRules(),
      ]);
      setTemplates(templatesRes.data || []);
      setAutomationRules(rulesRes.data || []);
    } catch (error) {
      console.error('Error fetching WhatsApp data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRule = async (rule) => {
    try {
      await whatsappAPI.toggleAutomationRule(rule.id);
      fetchData();
    } catch (error) {
      Alert.alert('Error', 'Failed to toggle rule');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold">WhatsApp Automation</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Tabs */}
        <View className="flex-row bg-gray-100 mx-4 mt-4 rounded-lg p-1">
          <TouchableOpacity
            className={`flex-1 py-2 rounded-md ${activeTab === 'templates' ? 'bg-white shadow-sm' : ''}`}
            onPress={() => setActiveTab('templates')}
          >
            <Text className={`text-center font-medium ${activeTab === 'templates' ? 'text-primary-500' : 'text-gray-500'}`}>
              Templates
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 rounded-md ${activeTab === 'rules' ? 'bg-white shadow-sm' : ''}`}
            onPress={() => setActiveTab('rules')}
          >
            <Text className={`text-center font-medium ${activeTab === 'rules' ? 'text-primary-500' : 'text-gray-500'}`}>
              Automation Rules
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4 py-4">
          {activeTab === 'templates' ? (
            templates.length === 0 ? (
              <View className="items-center justify-center py-12">
                <MessageCircle size={48} color="#d1d5db" />
                <Text className="text-gray-500 mt-4">No templates yet</Text>
              </View>
            ) : (
              templates.map((template) => (
                <View
                  key={template.id}
                  className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-100"
                >
                  <Text className="text-gray-900 font-semibold">{template.name}</Text>
                  <Text className="text-gray-600 text-sm mt-2" numberOfLines={3}>
                    {template.content}
                  </Text>
                </View>
              ))
            )
          ) : (
            automationRules.length === 0 ? (
              <View className="items-center justify-center py-12">
                <SettingsIcon size={48} color="#d1d5db" />
                <Text className="text-gray-500 mt-4">No automation rules yet</Text>
              </View>
            ) : (
              automationRules.map((rule) => (
                <View
                  key={rule.id}
                  className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-100"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-gray-900 font-semibold">{rule.name}</Text>
                      <Text className="text-gray-500 text-sm mt-1">Event: {rule.event}</Text>
                    </View>
                    <TouchableOpacity onPress={() => toggleRule(rule)}>
                      {rule.enabled ? (
                        <ToggleRight size={32} color="#22c55e" />
                      ) : (
                        <ToggleLeft size={32} color="#9ca3af" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Main Settings Screen
export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showLoyaltyModal, setShowLoyaltyModal] = useState(false);
  const [showCouponsModal, setShowCouponsModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const MenuItem = ({ icon: Icon, title, subtitle, onPress, destructive }) => (
    <TouchableOpacity
      className="flex-row items-center bg-white p-4 border-b border-gray-100"
      onPress={onPress}
    >
      <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${destructive ? 'bg-red-50' : 'bg-gray-100'}`}>
        <Icon size={20} color={destructive ? '#ef4444' : '#6b7280'} />
      </View>
      <View className="flex-1">
        <Text className={`font-medium ${destructive ? 'text-red-500' : 'text-gray-900'}`}>{title}</Text>
        {subtitle && <Text className="text-gray-500 text-sm">{subtitle}</Text>}
      </View>
      {!destructive && <ChevronRight size={20} color="#d1d5db" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 py-3 bg-white border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">Settings</Text>
        </View>

        {/* User Info */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center">
            <View className="w-14 h-14 bg-primary-100 rounded-full items-center justify-center mr-4">
              <Text className="text-primary-600 text-xl font-bold">
                {user?.restaurant_name?.charAt(0)?.toUpperCase() || 'R'}
              </Text>
            </View>
            <View>
              <Text className="text-gray-900 font-semibold text-lg">{user?.restaurant_name}</Text>
              <Text className="text-gray-500">{user?.email}</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View className="mt-6">
          <Text className="text-gray-500 text-sm font-medium px-4 mb-2">LOYALTY PROGRAM</Text>
          <View className="bg-white rounded-xl mx-4 overflow-hidden">
            <MenuItem
              icon={Award}
              title="Loyalty Settings"
              subtitle="Points earning, tiers, bonuses"
              onPress={() => setShowLoyaltyModal(true)}
            />
            <MenuItem
              icon={Ticket}
              title="Coupons"
              subtitle="Manage discount coupons"
              onPress={() => setShowCouponsModal(true)}
            />
          </View>
        </View>

        <View className="mt-6">
          <Text className="text-gray-500 text-sm font-medium px-4 mb-2">AUTOMATION</Text>
          <View className="bg-white rounded-xl mx-4 overflow-hidden">
            <MenuItem
              icon={MessageCircle}
              title="WhatsApp Templates"
              subtitle="Create message templates"
              onPress={() => router.push('/(tabs)/whatsapp-templates')}
            />
            <MenuItem
              icon={SettingsIcon}
              title="Automation Rules"
              subtitle="Configure auto-messaging"
              onPress={() => router.push('/(tabs)/whatsapp-automation')}
            />
          </View>
        </View>

        <View className="mt-6">
          <Text className="text-gray-500 text-sm font-medium px-4 mb-2">ACCOUNT</Text>
          <View className="bg-white rounded-xl mx-4 overflow-hidden">
            <MenuItem
              icon={User}
              title="Profile"
              subtitle="Edit your profile"
              onPress={() => router.push('/(tabs)/profile')}
            />
            <MenuItem
              icon={LogOut}
              title="Logout"
              onPress={handleLogout}
              destructive
            />
          </View>
        </View>

        <View className="h-8" />
      </ScrollView>

      {/* Modals */}
      <LoyaltySettingsModal
        visible={showLoyaltyModal}
        onClose={() => setShowLoyaltyModal(false)}
      />

      <CouponsModal
        visible={showCouponsModal}
        onClose={() => setShowCouponsModal(false)}
      />

      <WhatsAppModal
        visible={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
      />
    </SafeAreaView>
  );
}
