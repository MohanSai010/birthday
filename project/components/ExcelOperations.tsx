import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { importFromExcel, exportToExcel, saveBirthdays, getBirthdays } from '../utils/storage';

interface Props {
  onImportComplete: () => void;
}

export default function ExcelOperations({ onImportComplete }: Props) {
  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      if (result.assets && result.assets[0]) {
        const uri = result.assets[0].uri;
        const importedBirthdays = await importFromExcel(uri);
        await saveBirthdays(importedBirthdays);
        onImportComplete();
      }
    } catch (error) {
      console.error('Error importing file:', error);
    }
  };

  const handleExport = async () => {
    try {
      const birthdays = await getBirthdays();
      const fileUri = await exportToExcel(birthdays);

      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        link.href = fileUri;
        link.download = 'birthdays.xlsx';
        link.click();
      } else {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Download Birthdays Excel',
        });
      }
    } catch (error) {
      console.error('Error exporting file:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleImport}>
        <Text style={styles.buttonText}>Import Excel</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleExport}>
        <Text style={styles.buttonText}>Export Excel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});