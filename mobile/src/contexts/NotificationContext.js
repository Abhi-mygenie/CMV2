import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import {
  registerForPushNotificationsAsync,
  addNotificationListeners,
  setBadgeCount,
  getBadgeCount,
} from '../services/notifications';
import { useRouter } from 'expo-router';

const NotificationContext = createContext(null);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const router = useRouter();
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [badgeCount, setBadge] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    // Register for push notifications
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
        setPermissionGranted(true);
      }
    });

    // Get initial badge count
    getBadgeCount().then(setBadge);

    // Set up notification listeners
    const cleanup = addNotificationListeners({
      onNotificationReceived: (notification) => {
        console.log('Notification received:', notification);
        setNotification(notification);
        // Update badge count
        getBadgeCount().then(setBadge);
      },
      onNotificationResponse: (response) => {
        console.log('Notification response:', response);
        handleNotificationTap(response.notification.request.content.data);
      },
    });

    return cleanup;
  }, []);

  const handleNotificationTap = (data) => {
    if (!data?.type) return;

    switch (data.type) {
      case 'points_earned':
      case 'points_redeemed':
      case 'tier_upgrade':
      case 'new_customer':
        router.push('/(tabs)/customers');
        break;
      case 'feedback_request':
        router.push('/(tabs)/feedback');
        break;
      case 'new_coupon':
      case 'promotional':
        router.push('/(tabs)/settings');
        break;
      default:
        router.push('/(tabs)');
        break;
    }
  };

  const updateBadgeCount = async (count) => {
    await setBadgeCount(count);
    setBadge(count);
  };

  const clearBadge = async () => {
    await setBadgeCount(0);
    setBadge(0);
  };

  const value = {
    expoPushToken,
    notification,
    badgeCount,
    permissionGranted,
    updateBadgeCount,
    clearBadge,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
