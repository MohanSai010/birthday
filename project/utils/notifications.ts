import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Birthday } from '../types/birthday';
import { parseISO, addDays, isBefore } from 'date-fns';

export const setupNotifications = async () => {
  if (Platform.OS === 'web') return;

  await Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
};

export const scheduleBirthdayNotification = async (birthday: Birthday) => {
  if (Platform.OS === 'web') return;

  const birthdayDate = parseISO(birthday.date);
  const notificationDate = birthday.customReminder
    ? addDays(birthdayDate, -birthday.customReminder)
    : addDays(birthdayDate, -1);

  if (isBefore(notificationDate, new Date())) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Birthday Reminder! 🎉',
      body: `${birthday.name}'s birthday is ${
        birthday.customReminder ? `in ${birthday.customReminder} days` : 'tomorrow'
      }!`,
    },
    trigger: {
      date: notificationDate,
    },
  });
};

export const cancelAllNotifications = async () => {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
};