export type BusinessType = 'LIBRARY' | 'GYM';

export interface BusinessOption {
  id: BusinessType;
  label: string;
  description: string;
}

export const BUSINESS_OPTIONS: BusinessOption[] = [
  {
    id: 'LIBRARY',
    label: 'Library Management',
    description: 'Manage your library, books, members, and borrowing system'
  },
  {
    id: 'GYM',
    label: 'Gym Management',
    description: 'Manage your gym, members, equipment, and schedules'
  }
];