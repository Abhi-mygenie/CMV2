import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Register for push notifications
export async function registerForPushNotificationsAsync() {
  let token;

  // Must be a physical device for push notifications
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  // Check existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request permissions if not already granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Push notification permission not granted');
    return null;
  }

  try {
    // Get Expo push token
    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    
    if (projectId) {
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    } else {
      // Fallback for development
      token = (await Notifications.getExpoPushTokenAsync()).data;
    }
    
    console.log('Push token:', token);
  } catch (error) {
    console.error('Error getting push token:', error);
  }

  // Android-specific channel configuration
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#22c55e',
    });

    // Channel for loyalty notifications
    await Notifications.setNotificationChannelAsync('loyalty', {
      name: 'Loyalty Program',
      description: 'Points, rewards, and tier updates',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      lightColor: '#f97316',
    });

    // Channel for promotional notifications
    await Notifications.setNotificationChannelAsync('promotions', {
      name: 'Promotions',
      description: 'Special offers and discounts',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });
  }

  return token;
}

// Schedule a local notification
export async function scheduleLocalNotification({
  title,
  body,
  data = {},
  trigger = null, // null = immediate, or { seconds: 5 } for delay
  channelId = 'default',
}) {
  const notificationContent = {
    title,
    body,
    data,
    sound: 'default',
  };

  if (Platform.OS === 'android') {
    notificationContent.channelId = channelId;
  }

  const identifier = await Notifications.scheduleNotificationAsync({
    content: notificationContent,
    trigger,
  });

  return identifier;
}

// Cancel a scheduled notification
export async function cancelNotification(identifier) {
  await Notifications.cancelScheduledNotificationAsync(identifier);
}

// Cancel all scheduled notifications
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Get all scheduled notifications
export async function getScheduledNotifications() {
  return await Notifications.getAllScheduledNotificationsAsync();
}

// Set badge count (iOS)
export async function setBadgeCount(count) {
  await Notifications.setBadgeCountAsync(count);
}

// Get badge count
export async function getBadgeCount() {
  return await Notifications.getBadgeCountAsync();
}

// Dismiss all notifications from notification center
export async function dismissAllNotifications() {
  await Notifications.dismissAllNotificationsAsync();
}

// Add notification listeners
export function addNotificationListeners({
  onNotificationReceived,
  onNotificationResponse,
}) {
  const receivedSubscription = Notifications.addNotificationReceivedListener(
    onNotificationReceived
  );

  const responseSubscription = Notifications.addNotificationResponseReceivedListener(
    onNotificationResponse
  );

  // Return cleanup function
  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
}

// Notification types for the app
export const NotificationTypes = {
  POINTS_EARNED: 'points_earned',
  POINTS_REDEEMED: 'points_redeemed',
  TIER_UPGRADE: 'tier_upgrade',
  BIRTHDAY_BONUS: 'birthday_bonus',
  ANNIVERSARY_BONUS: 'anniversary_bonus',
  NEW_COUPON: 'new_coupon',
  WALLET_CREDIT: 'wallet_credit',
  FEEDBACK_REQUEST: 'feedback_request',
  PROMOTIONAL: 'promotional',
};

// Send common notification types
export const sendNotification = {
  pointsEarned: (customerName, points) =>
    scheduleLocalNotification({
      title: 'Points Earned! 🎉',
      body: `${customerName} just earned ${points} points`,
      data: { type: NotificationTypes.POINTS_EARNED },
      channelId: 'loyalty',
    }),

  tierUpgrade: (customerName, newTier) =>
    scheduleLocalNotification({
      title: 'Tier Upgrade! ⭐',
      body: `${customerName} is now a ${newTier} member`,
      data: { type: NotificationTypes.TIER_UPGRADE },
      channelId: 'loyalty',
    }),

  newCustomer: (customerName) =>
    scheduleLocalNotification({
      title: 'New Customer! 👋',
      body: `${customerName} just joined your loyalty program`,
      data: { type: 'new_customer' },
      channelId: 'default',
    }),

  feedbackReceived: (customerName, rating) =>
    scheduleLocalNotification({
      title: 'New Feedback! 📝',
      body: `${customerName} left a ${rating}-star review`,
      data: { type: NotificationTypes.FEEDBACK_REQUEST },
      channelId: 'default',
    }),
};
