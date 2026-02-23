import { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import {
  registerForPushNotificationsAsync,
  addNotificationListeners,
} from '../services/notifications';

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Register for push notifications
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    // Set up notification listeners
    const cleanup = addNotificationListeners({
      onNotificationReceived: (notification) => {
        console.log('Notification received:', notification);
        setNotification(notification);
      },
      onNotificationResponse: (response) => {
        console.log('Notification response:', response);
        // Handle notification tap - navigate to appropriate screen
        const data = response.notification.request.content.data;
        handleNotificationNavigation(data);
      },
    });

    return cleanup;
  }, []);

  const handleNotificationNavigation = (data) => {
    // Handle navigation based on notification type
    switch (data?.type) {
      case 'points_earned':
      case 'points_redeemed':
      case 'tier_upgrade':
        // Navigate to customers screen
        break;
      case 'feedback_request':
        // Navigate to feedback screen
        break;
      case 'new_coupon':
        // Navigate to coupons/settings
        break;
      default:
        // Navigate to home
        break;
    }
  };

  return {
    expoPushToken,
    notification,
  };
}
