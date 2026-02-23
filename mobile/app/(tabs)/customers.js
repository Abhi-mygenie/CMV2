import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, RefreshControl, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { customersAPI, pointsAPI, walletAPI } from '../../src/services/api';
import { Search, Plus, X, Phone, Mail, Calendar, Award, Wallet, Edit2, Trash2, ChevronRight } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Tier badge component
const TierBadge = ({ tier }) => {
  const colors = {
    bronze: 'bg-amber-100 text-amber-700',
    silver: 'bg-gray-200 text-gray-700',
    gold: 'bg-yellow-100 text-yellow-700',
    platinum: 'bg-purple-100 text-purple-700',
  };
  const colorClass = colors[tier?.toLowerCase()] || colors.bronze;
  
  return (
    <View className={`px-2 py-1 rounded-full ${colorClass.split(' ')[0]}`}>
      <Text className={`text-xs font-medium capitalize ${colorClass.split(' ')[1]}`}>
        {tier || 'Bronze'}
      </Text>
    </View>
  );
};

// Add/Edit Customer Modal
const CustomerModal = ({ visible, onClose, customer, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    birthday: '',
    anniversary: '',
    allergies: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        birthday: customer.birthday || '',
        anniversary: customer.anniversary || '',
        allergies: customer.allergies?.join(', ') || '',
        notes: customer.notes || '',
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        birthday: '',
        anniversary: '',
        allergies: '',
        notes: '',
      });
    }
    setError('');
  }, [customer, visible]);

  const handleSave = async () => {
    if (!formData.name || !formData.phone) {
      setError('Name and phone are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = {
        ...formData,
        allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [],
      };

      if (customer) {
        await customersAPI.update(customer.id, data);
      } else {
        await customersAPI.create(data);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save customer');
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
            {customer ? 'Edit Customer' : 'Add Customer'}
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

          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 font-medium mb-2">Name *</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                placeholder="Customer name"
                value={formData.name}
                onChangeText={(v) => setFormData(p => ({ ...p, name: v }))}
              />
            </View>

            <View className="mt-4">
              <Text className="text-gray-700 font-medium mb-2">Phone *</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChangeText={(v) => setFormData(p => ({ ...p, phone: v }))}
                keyboardType="phone-pad"
              />
            </View>

            <View className="mt-4">
              <Text className="text-gray-700 font-medium mb-2">Email</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                placeholder="customer@email.com"
                value={formData.email}
                onChangeText={(v) => setFormData(p => ({ ...p, email: v }))}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="mt-4">
              <Text className="text-gray-700 font-medium mb-2">Birthday (YYYY-MM-DD)</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                placeholder="1990-01-15"
                value={formData.birthday}
                onChangeText={(v) => setFormData(p => ({ ...p, birthday: v }))}
              />
            </View>

            <View className="mt-4">
              <Text className="text-gray-700 font-medium mb-2">Anniversary (YYYY-MM-DD)</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                placeholder="2020-06-20"
                value={formData.anniversary}
                onChangeText={(v) => setFormData(p => ({ ...p, anniversary: v }))}
              />
            </View>

            <View className="mt-4">
              <Text className="text-gray-700 font-medium mb-2">Allergies (comma separated)</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                placeholder="peanuts, shellfish"
                value={formData.allergies}
                onChangeText={(v) => setFormData(p => ({ ...p, allergies: v }))}
              />
            </View>

            <View className="mt-4">
              <Text className="text-gray-700 font-medium mb-2">Notes</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 h-24"
                placeholder="Additional notes..."
                value={formData.notes}
                onChangeText={(v) => setFormData(p => ({ ...p, notes: v }))}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Points Modal
const PointsModal = ({ visible, onClose, customer, onSuccess }) => {
  const [mode, setMode] = useState('issue'); // 'issue' or 'redeem'
  const [amount, setAmount] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      if (mode === 'issue') {
        await pointsAPI.issue(customer.id, {
          bill_amount: parseFloat(billAmount) || 0,
          notes,
        });
      } else {
        await pointsAPI.redeem(customer.id, {
          points: parseInt(amount) || 0,
          notes,
        });
      }
      onSuccess();
      onClose();
      setAmount('');
      setBillAmount('');
      setNotes('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Operation failed');
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
          <Text className="text-lg font-semibold">Manage Points</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView className="flex-1 px-4 py-4">
          {/* Customer Info */}
          <View className="bg-gray-50 rounded-xl p-4 mb-4">
            <Text className="text-gray-900 font-semibold">{customer?.name}</Text>
            <Text className="text-secondary-600 font-bold text-xl mt-1">
              {customer?.points_balance ?? 0} points
            </Text>
          </View>

          {/* Mode Toggle */}
          <View className="flex-row bg-gray-100 rounded-lg p-1 mb-4">
            <TouchableOpacity
              className={`flex-1 py-2 rounded-md ${mode === 'issue' ? 'bg-white shadow-sm' : ''}`}
              onPress={() => setMode('issue')}
            >
              <Text className={`text-center font-medium ${mode === 'issue' ? 'text-primary-500' : 'text-gray-500'}`}>
                Issue Points
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-2 rounded-md ${mode === 'redeem' ? 'bg-white shadow-sm' : ''}`}
              onPress={() => setMode('redeem')}
            >
              <Text className={`text-center font-medium ${mode === 'redeem' ? 'text-primary-500' : 'text-gray-500'}`}>
                Redeem Points
              </Text>
            </TouchableOpacity>
          </View>

          {error ? (
            <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <Text className="text-red-600 text-center">{error}</Text>
            </View>
          ) : null}

          {mode === 'issue' ? (
            <View>
              <Text className="text-gray-700 font-medium mb-2">Bill Amount</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                placeholder="Enter bill amount"
                value={billAmount}
                onChangeText={setBillAmount}
                keyboardType="decimal-pad"
              />
            </View>
          ) : (
            <View>
              <Text className="text-gray-700 font-medium mb-2">Points to Redeem</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                placeholder="Enter points"
                value={amount}
                onChangeText={setAmount}
                keyboardType="number-pad"
              />
            </View>
          )}

          <View className="mt-4">
            <Text className="text-gray-700 font-medium mb-2">Notes</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
              placeholder="Optional notes"
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          <TouchableOpacity
            className={`mt-6 py-4 rounded-lg ${mode === 'issue' ? 'bg-secondary-500' : 'bg-primary-500'} ${loading ? 'opacity-70' : ''}`}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold">
              {loading ? 'Processing...' : mode === 'issue' ? 'Issue Points' : 'Redeem Points'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Wallet Modal
const WalletModal = ({ visible, onClose, customer, onSuccess }) => {
  const [mode, setMode] = useState('credit');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = {
        amount: parseFloat(amount),
        notes,
      };

      if (mode === 'credit') {
        await walletAPI.credit(customer.id, data);
      } else {
        await walletAPI.debit(customer.id, data);
      }
      onSuccess();
      onClose();
      setAmount('');
      setNotes('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Operation failed');
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
          <Text className="text-lg font-semibold">Manage Wallet</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView className="flex-1 px-4 py-4">
          {/* Customer Info */}
          <View className="bg-gray-50 rounded-xl p-4 mb-4">
            <Text className="text-gray-900 font-semibold">{customer?.name}</Text>
            <Text className="text-primary-600 font-bold text-xl mt-1">
              ${(customer?.wallet_balance ?? 0).toFixed(2)} balance
            </Text>
          </View>

          {/* Mode Toggle */}
          <View className="flex-row bg-gray-100 rounded-lg p-1 mb-4">
            <TouchableOpacity
              className={`flex-1 py-2 rounded-md ${mode === 'credit' ? 'bg-white shadow-sm' : ''}`}
              onPress={() => setMode('credit')}
            >
              <Text className={`text-center font-medium ${mode === 'credit' ? 'text-secondary-500' : 'text-gray-500'}`}>
                Add Money
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-2 rounded-md ${mode === 'debit' ? 'bg-white shadow-sm' : ''}`}
              onPress={() => setMode('debit')}
            >
              <Text className={`text-center font-medium ${mode === 'debit' ? 'text-primary-500' : 'text-gray-500'}`}>
                Use Balance
              </Text>
            </TouchableOpacity>
          </View>

          {error ? (
            <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <Text className="text-red-600 text-center">{error}</Text>
            </View>
          ) : null}

          <View>
            <Text className="text-gray-700 font-medium mb-2">Amount ($)</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>

          <View className="mt-4">
            <Text className="text-gray-700 font-medium mb-2">Notes</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
              placeholder="Optional notes"
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          <TouchableOpacity
            className={`mt-6 py-4 rounded-lg ${mode === 'credit' ? 'bg-secondary-500' : 'bg-primary-500'} ${loading ? 'opacity-70' : ''}`}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold">
              {loading ? 'Processing...' : mode === 'credit' ? 'Add Money' : 'Use Balance'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Customer Detail Modal
const CustomerDetailModal = ({ visible, onClose, customer, onEdit, onDelete, onRefresh }) => {
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  if (!customer) return null;

  const handleDelete = () => {
    Alert.alert(
      'Delete Customer',
      `Are you sure you want to delete ${customer.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold">Customer Details</Text>
          <View className="flex-row">
            <TouchableOpacity onPress={onEdit} className="mr-3">
              <Edit2 size={20} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Trash2 size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1">
          {/* Header Card */}
          <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center">
              <View className="w-16 h-16 bg-primary-100 rounded-full items-center justify-center mr-4">
                <Text className="text-primary-600 text-2xl font-bold">
                  {customer.name?.charAt(0)?.toUpperCase() || '?'}
                </Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="text-xl font-bold text-gray-900 mr-2">{customer.name}</Text>
                  <TierBadge tier={customer.tier} />
                </View>
                <Text className="text-gray-500 mt-1">{customer.phone}</Text>
                {customer.email && (
                  <Text className="text-gray-400 text-sm">{customer.email}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Stats Cards */}
          <View className="flex-row mx-4 mt-4">
            <View className="flex-1 bg-secondary-50 rounded-xl p-4 mr-2">
              <Text className="text-secondary-600 text-xs font-medium">POINTS</Text>
              <Text className="text-secondary-700 text-2xl font-bold mt-1">
                {customer.points_balance ?? 0}
              </Text>
            </View>
            <View className="flex-1 bg-primary-50 rounded-xl p-4 ml-2">
              <Text className="text-primary-600 text-xs font-medium">WALLET</Text>
              <Text className="text-primary-700 text-2xl font-bold mt-1">
                ${(customer.wallet_balance ?? 0).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row mx-4 mt-4">
            <TouchableOpacity
              className="flex-1 bg-secondary-500 rounded-xl py-3 mr-2 flex-row items-center justify-center"
              onPress={() => setShowPointsModal(true)}
            >
              <Award size={18} color="#ffffff" />
              <Text className="text-white font-semibold ml-2">Points</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-primary-500 rounded-xl py-3 ml-2 flex-row items-center justify-center"
              onPress={() => setShowWalletModal(true)}
            >
              <Wallet size={18} color="#ffffff" />
              <Text className="text-white font-semibold ml-2">Wallet</Text>
            </TouchableOpacity>
          </View>

          {/* Details */}
          <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm mb-8">
            <Text className="text-gray-900 font-semibold mb-3">Details</Text>
            
            <View className="flex-row items-center py-2 border-b border-gray-100">
              <Phone size={16} color="#9ca3af" />
              <Text className="text-gray-600 ml-3 flex-1">Phone</Text>
              <Text className="text-gray-900">{customer.phone || '-'}</Text>
            </View>
            
            <View className="flex-row items-center py-2 border-b border-gray-100">
              <Mail size={16} color="#9ca3af" />
              <Text className="text-gray-600 ml-3 flex-1">Email</Text>
              <Text className="text-gray-900">{customer.email || '-'}</Text>
            </View>
            
            <View className="flex-row items-center py-2 border-b border-gray-100">
              <Calendar size={16} color="#9ca3af" />
              <Text className="text-gray-600 ml-3 flex-1">Birthday</Text>
              <Text className="text-gray-900">{customer.birthday || '-'}</Text>
            </View>
            
            <View className="flex-row items-center py-2 border-b border-gray-100">
              <Calendar size={16} color="#9ca3af" />
              <Text className="text-gray-600 ml-3 flex-1">Anniversary</Text>
              <Text className="text-gray-900">{customer.anniversary || '-'}</Text>
            </View>
            
            <View className="flex-row items-center py-2">
              <Users size={16} color="#9ca3af" />
              <Text className="text-gray-600 ml-3 flex-1">Total Visits</Text>
              <Text className="text-gray-900">{customer.visit_count ?? 0}</Text>
            </View>

            {customer.allergies?.length > 0 && (
              <View className="mt-3 pt-3 border-t border-gray-100">
                <Text className="text-gray-600 mb-2">Allergies</Text>
                <View className="flex-row flex-wrap">
                  {customer.allergies.map((allergy, index) => (
                    <View key={index} className="bg-red-50 px-2 py-1 rounded mr-2 mb-1">
                      <Text className="text-red-600 text-sm">{allergy}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <PointsModal
          visible={showPointsModal}
          onClose={() => setShowPointsModal(false)}
          customer={customer}
          onSuccess={onRefresh}
        />

        <WalletModal
          visible={showWalletModal}
          onClose={() => setShowWalletModal(false)}
          customer={customer}
          onSuccess={onRefresh}
        />
      </SafeAreaView>
    </Modal>
  );
};

// Import Users icon
import { Users } from 'lucide-react-native';

// Main Customers Screen
export default function CustomersScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);

  const fetchCustomers = async () => {
    try {
      const response = await customersAPI.getAll({ search: searchQuery });
      setCustomers(response.data.customers || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [searchQuery]);

  useEffect(() => {
    if (params.action === 'add') {
      setShowAddModal(true);
    }
    if (params.id) {
      const customer = customers.find(c => c.id === params.id);
      if (customer) {
        setSelectedCustomer(customer);
        setShowDetailModal(true);
      }
    }
  }, [params, customers]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCustomers();
    setRefreshing(false);
  }, [searchQuery]);

  const handleCustomerPress = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  };

  const handleEdit = () => {
    setEditCustomer(selectedCustomer);
    setShowDetailModal(false);
    setShowAddModal(true);
  };

  const handleDelete = async () => {
    try {
      await customersAPI.delete(selectedCustomer.id);
      setShowDetailModal(false);
      setSelectedCustomer(null);
      fetchCustomers();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete customer');
    }
  };

  const handleSaveCustomer = () => {
    setEditCustomer(null);
    fetchCustomers();
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setEditCustomer(null);
  };

  const refreshCustomerDetail = async () => {
    if (selectedCustomer) {
      try {
        const response = await customersAPI.getById(selectedCustomer.id);
        setSelectedCustomer(response.data);
        fetchCustomers();
      } catch (error) {
        console.error('Error refreshing customer:', error);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-2xl font-bold text-gray-900">Customers</Text>
          <TouchableOpacity
            className="bg-primary-500 px-4 py-2 rounded-lg flex-row items-center"
            onPress={() => setShowAddModal(true)}
          >
            <Plus size={18} color="#ffffff" />
            <Text className="text-white font-medium ml-1">Add</Text>
          </TouchableOpacity>
        </View>
        
        {/* Search */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search size={18} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="Search customers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color="#9ca3af" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Customer List */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" />
        }
      >
        {customers.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Users size={48} color="#d1d5db" />
            <Text className="text-gray-500 mt-4 text-center">
              {searchQuery ? 'No customers found' : 'No customers yet'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                className="mt-4 bg-primary-500 px-6 py-3 rounded-lg"
                onPress={() => setShowAddModal(true)}
              >
                <Text className="text-white font-medium">Add First Customer</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          customers.map((customer) => (
            <TouchableOpacity
              key={customer.id}
              className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm border border-gray-100"
              onPress={() => handleCustomerPress(customer)}
            >
              <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center mr-3">
                <Text className="text-primary-600 font-bold text-lg">
                  {customer.name?.charAt(0)?.toUpperCase() || '?'}
                </Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="text-gray-900 font-semibold mr-2">{customer.name}</Text>
                  <TierBadge tier={customer.tier} />
                </View>
                <Text className="text-gray-500 text-sm mt-0.5">{customer.phone}</Text>
              </View>
              <View className="items-end mr-2">
                <Text className="text-secondary-600 font-semibold">{customer.points_balance ?? 0} pts</Text>
                <Text className="text-gray-400 text-xs">${(customer.wallet_balance ?? 0).toFixed(2)}</Text>
              </View>
              <ChevronRight size={20} color="#d1d5db" />
            </TouchableOpacity>
          ))
        )}
        <View className="h-8" />
      </ScrollView>

      {/* Modals */}
      <CustomerModal
        visible={showAddModal}
        onClose={handleCloseAddModal}
        customer={editCustomer}
        onSave={handleSaveCustomer}
      />

      <CustomerDetailModal
        visible={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={refreshCustomerDetail}
      />
    </SafeAreaView>
  );
}
