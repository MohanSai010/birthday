import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BirthdayList from '../../components/BirthdayList';
import ExcelOperations from '../../components/ExcelOperations';
import { getBirthdays } from '../../utils/storage';
import { Birthday } from '../../types/birthday';

export default function BirthdaysScreen() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadBirthdays();
  }, []);

  const loadBirthdays = async () => {
    try {
      const data = await getBirthdays();
      setBirthdays(data);
    } catch (error) {
      console.error('Error loading birthdays:', error);
    }
  };

  const filteredBirthdays = birthdays.filter(
    (birthday) =>
      birthday.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      birthday.date.includes(searchQuery) ||
      birthday.orgUnitText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      birthday.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (birthday: Birthday) => {
    router.push({
      pathname: '/add',
      params: { id: birthday.id },
    });
  };

  return (
    <View style={styles.container}>
      <ExcelOperations onImportComplete={loadBirthdays} />
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search birthdays..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <BirthdayList birthdays={filteredBirthdays} onEdit={handleEdit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f5f5f5',
    margin: 8,
    borderRadius: 8,
  },
  searchIcon: {
    marginHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
});