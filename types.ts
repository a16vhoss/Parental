
export enum AppView {
  LANDING = 'landing',
  DASHBOARD = 'dashboard',
  PROFILE = 'profile', // Represents the Family Hub
  PROFILE_DETAIL = 'profile_detail', // Represents a specific child's details
  USER_PROFILE = 'user_profile',
  SETTINGS = 'settings',
  DIRECTORY = 'directory',
  EMERGENCY = 'emergency',
  ADD_CHILD = 'add_child',
  CHAT = 'chat',
  LOGIN = 'login'
}

export type FamilyRole = 'Hijo/a' | 'Padre/Madre' | 'Abuelo/a' | 'Tío/a' | 'Primo/a' | 'Cuidador/a';

export interface FamilyMember {
  id: string;
  name: string;
  role: FamilyRole;
  age: string;
  status: string;
  avatar: string;
  vitals: {
    weight?: string;
    height?: string;
    bloodGroup?: string;
    dob?: string;
    sex: string;
  };
}

export interface DirectoryItem {
  id: string;
  name: string;
  category: 'Hospital' | 'Pediatra' | 'Guardería' | 'Farmacia';
  status: string;
  rating: number;
  distance: string;
  location: string;
  image: string;
  verified: boolean;
  reviewsCount: number;
}
