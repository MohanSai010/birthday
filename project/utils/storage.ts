import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import { Birthday } from '../types/birthday';

const STORAGE_KEY = '@birthdays';

export const saveBirthdays = async (birthdays: Birthday[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(birthdays));
  } catch (error) {
    console.error('Error saving birthdays:', error);
    throw error;
  }
};

export const getBirthdays = async (): Promise<Birthday[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting birthdays:', error);
    throw error;
  }
};

export const importFromExcel = async (uri: string): Promise<Birthday[]> => {
  try {
    const content = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    const workbook = XLSX.read(content, { type: 'base64' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    return data.map((row: any) => {
      const dateOfBirth = row['DATE OF BIRTH'];
      const dateOfRetirement = row['DATE OF RETIREMENT'];
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: row['NAME'] || '',
        date: dateOfBirth ? formatDate(dateOfBirth.toString()) : '',
        retirementDate: dateOfRetirement ? formatDate(dateOfRetirement.toString()) : '',
        cpfNo: row['CPF NO'] || '',
        designation: row['DESIGNATION TEXT'] || '',
        isMember: row['Member'] === 'YES',
        level: row['LEVEL'] || '',
        class: row['CLASS'] || '',
        billNo: row['Bill No.'] || '',
        subDispText: row['SUB DISP TEXT'] || '',
        orgUnitText: row['ORG.UNIT TEXT'] || '',
        category: row['CATEGORY'] || '',
        genderKey: row['GENDER KEY'] || '',
        statusDom: row['STATUS_DOM'] || '',
        mobileNo: row['Mobile No'] || '',
        notes: `${row['DESIGNATION TEXT'] || ''} - ${row['ORG.UNIT TEXT'] || ''}`
      };
    }).filter(birthday => birthday.date && birthday.name);
  } catch (error) {
    console.error('Error importing Excel file:', error);
    throw error;
  }
};

export const exportToExcel = async (birthdays: Birthday[]): Promise<string> => {
  try {
    const excelData = birthdays.map(birthday => ({
      'CPF NO': birthday.cpfNo || '',
      'NAME': birthday.name || '',
      'DESIGNATION TEXT': birthday.designation || '',
      'Member': birthday.isMember ? 'YES' : 'NO',
      'LEVEL': birthday.level || '',
      'CLASS': birthday.class || '',
      'Bill No.': birthday.billNo || '',
      'SUB DISP TEXT': birthday.subDispText || '',
      'ORG.UNIT TEXT': birthday.orgUnitText || '',
      'CATEGORY': birthday.category || '',
      'GENDER KEY': birthday.genderKey || '',
      'STATUS_DOM': birthday.statusDom || '',
      'DATE OF BIRTH': formatDateForExcel(birthday.date),
      'DATE OF RETIREMENT': formatDateForExcel(birthday.retirementDate || ''),
      'Mobile No': birthday.mobileNo || ''
    }));
    
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Birthdays');
    
    const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
    const uri = FileSystem.documentDirectory + 'birthdays.xlsx';
    
    await FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    return uri;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};

const formatDate = (dateString: string): string => {
  try {
    if (!dateString) return '';
    
    // Clean the date string
    dateString = dateString.replace(/\s+/g, '');
    
    let day, month, year;
    
    // Try DD-MM-YYYY format
    if (dateString.includes('-')) {
      [day, month, year] = dateString.split('-');
    }
    // Try DD/MM/YYYY format
    else if (dateString.includes('/')) {
      [day, month, year] = dateString.split('/');
    }
    // Invalid format
    else {
      console.error('Invalid date format:', dateString);
      return '';
    }
    
    // Validate date parts
    if (!day || !month || !year) {
      console.error('Invalid date parts:', { day, month, year });
      return '';
    }
    
    // Ensure year has 4 digits
    if (year.length === 2) {
      year = '19' + year;
    }
    
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

const formatDateForExcel = (dateString: string): string => {
  try {
    if (!dateString) return '';
    
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error('Error formatting date for Excel:', error);
    return dateString;
  }
};