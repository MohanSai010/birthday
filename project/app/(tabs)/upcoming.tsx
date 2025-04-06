import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { getBirthdays } from '../../utils/storage';
import BirthdayList from '../../components/BirthdayList';
import { Birthday } from '../../types/birthday';
import { parseISO, addDays, isBefore, isAfter } from 'date-fns';

export default function UpcomingScreen() {
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<Birthday[]>([]);

  useEffect(() => {
    loadUpcomingBirthdays();
  }, []);

  const loadUpcomingBirthdays = async () => {
    try {
      const allBirthdays = await getBirthdays();
      const today = new Date();
      const nextWeek = addDays(today, 7);

      const upcoming = allBirthdays.filter((birthday) => {
        const date = parseISO(birthday.date);
        return isAfter(date, today) && isBefore(date, nextWeek);
      });

      setUpcomingBirthdays(upcoming);
    } catch (error) {
      console.error('Error loading upcoming birthdays:', error);
    }
  };

  return (
    <View style={styles.container}>
      <BirthdayList birthdays={upcomingBirthdays} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});