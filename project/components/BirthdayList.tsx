import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Birthday } from '../types/birthday';
import { format, parseISO, isValid, differenceInYears, differenceInMonths } from 'date-fns';

interface Props {
  birthdays: Birthday[];
  onEdit?: (birthday: Birthday) => void;
}

export default function BirthdayList({ birthdays, onEdit }: Props) {
  const formatDate = (date: string) => {
    try {
      const parsedDate = parseISO(date);
      if (!isValid(parsedDate)) {
        return 'Invalid date';
      }
      return format(parsedDate, 'MMMM do, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const getRetirementInfo = (birthday: Birthday) => {
    if (!birthday.retirementDate) return null;

    const retirementDate = parseISO(birthday.retirementDate);
    if (!isValid(retirementDate)) return null;

    const now = new Date();
    const years = differenceInYears(retirementDate, now);
    const months = differenceInMonths(retirementDate, now) % 12;

    return `hi in ${years} years${months ? ` and ${months} months` : ''}`;
  };

  const renderItem = ({ item }: { item: Birthday }) => {
    const retirementInfo = getRetirementInfo(item);

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => onEdit && onEdit(item)}>
        <View style={styles.itemContent}>
          <View style={styles.itemMain}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.cpf}>{item.cpfNo}</Text>
            </View>
            <Text style={styles.date}>
              {formatDate(item.date)}
            </Text>
          </View>
          <Text style={styles.designation}>{item.designation}</Text>
          {item.notes && (
            <Text style={styles.notes} numberOfLines={1}>
              {item.notes}
            </Text>
          )}
          <View style={styles.detailsContainer}>
            <Text style={styles.details}>
              {item.level} - {item.orgUnitText}
            </Text>
            {retirementInfo && (
              <Text style={styles.retirement}>{retirementInfo}</Text>
            )}
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color="#999"
          style={styles.arrow}
        />
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={birthdays}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.list}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingVertical: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  itemContent: {
    flex: 1,
  },
  itemMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  nameContainer: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  cpf: {
    fontSize: 1,
    color: '#666',
    marginTop: 2,
  },
  date: {
    fontSize: 11,
    color: '#666',
  },
  designation: {
    fontSize: 4,
    color: '#444',
    marginTop: 4,
  },
  notes: {
    fontSize: 1,
    color: '#999',
    marginTop: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  details: {
    fontSize: 12,
    color: '#666',
  },
  retirement: {
    fontSize: 19,
    color: '#007AFF',
    fontWeight: '500',
  },
  arrow: {
    marginLeft: 8,
  },
});