export interface Birthday {
  id: string;
  name: string;
  date: string;
  retirementDate?: string;
  customReminder?: number;
  notes?: string;
  cpfNo?: string;
  designation?: string;
  isMember?: boolean;
  level?: string;
  class?: string;
  billNo?: string;
  subDispText?: string;
  orgUnitText?: string;
  category?: string;
  genderKey?: string;
  statusDom?: string;
  mobileNo?: string;
}

export interface BirthdayFormData {
  name: string;
  date: string;
  retirementDate?: string;
  customReminder?: number;
  notes?: string;
  cpfNo?: string;
  designation?: string;
  isMember?: boolean;
  level?: string;
  class?: string;
  billNo?: string;
  subDispText?: string;
  orgUnitText?: string;
  category?: string;
  genderKey?: string;
  statusDom?: string;
  mobileNo?: string;
}