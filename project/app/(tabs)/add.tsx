import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getBirthdays, saveBirthdays } from '../../utils/storage';
import { Birthday, BirthdayFormData } from '../../types/birthday';
import { scheduleBirthdayNotification } from '../../utils/notifications';

export default function AddBirthdayScreen() {
  const [formData, setFormData] = useState<BirthdayFormData>({
    name: '',
    date: '',
    customReminder: 1,
    notes: '',
  });

  const params = useLocalSearchParams();
  const router = useRouter();
  const isEditing = !!params.id;

  useEffect(() => {
    if (isEditing) {
      loadBirthday();
    }
  }, [params.id]);

  const loadBirthday = async () => {
    try {
      const birthdays = await getBirthdays();
      const birthday = birthdays.find((b) => b.id === params.id);
      if (birthday) {
        setFormData({
          name: birthday.name,
          date: birthday.date,
          customReminder: birthday.customReminder,
          notes: birthday.notes,
        });
      }
    } catch (error) {
      console.error('Error loading birthday:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const birthdays = await getBirthdays();
      const newBirthday: Birthday = {
        id: isEditing ? params.id as string : Math.random().toString(36).substr(2, 9),
        ...formData,
      };

      let updatedBirthdays: Birthday[];
      if (isEditing) {
        updatedBirthdays = birthdays.map((b) =>
          b.id === params.id ? newBirthday : b
        );
      } else {
        updatedBirthdays = [...birthdays, newBirthday];
      }

      await saveBirthdays(updatedBirthdays);
      if (Platform.OS !== 'web') {
        await scheduleBirthdayNotification(newBirthday);
      }
      router.push('/');
    } catch (error) {
      console.error('Error saving birthday:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Enter name"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            value={formData.date}
            onChangeText={(text) => setFormData({ ...formData, date: text })}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Reminder (days before)</Text>
          <TextInput
            style={styles.input}
            value={formData.customReminder?.toString()}
            onChangeText={(text) =>
              setFormData({ ...formData, customReminder: parseInt(text) || 1 })
            }
            keyboardType="numeric"
            placeholder="1"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            placeholder="Add notes"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {isEditing ? 'Update Birthday' : 'Add Birthday'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});