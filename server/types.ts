export type UserRole = 'CANDIDATE' | 'ADMIN';

export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';

export type ApplicationStatus =
  | 'RECEIVED'
  | 'REVIEWING'
  | 'SHORTLISTED'
  | 'ACCEPTED'
  | 'REJECTED';

export type ExperienceLevel =
  | 'Débutant'
  | 'Moins de 6 mois'
  | '6 mois à 1 an'
  | '1 à 2 ans'
  | 'Plus de 2 ans';

export interface LanguageSkill {
  language: string;
  level: 'Débutant' | 'Intermédiaire' | 'Courant' | 'Bilingue / Natif';
}

export interface User {
  id: string;
  role: UserRole;
  email: string;
  passwordHash: string;
  salt: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  country: string;
  city: string;
  ageRange: string;
  chatterExperience: ExperienceLevel;
  experienceLevel: string;
  languages: LanguageSkill[];
  availability: string;
  timezone: string;
  timeSlots: string;
  workType: string;
  bio: string;
  skills: string[];
  workExperience: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  adminId: string;
  title: string;
  description: string;
  missions: string;
  requiredProfile: string;
  requiredSkills: string[];
  languages: string[];
  requiredExperience: ExperienceLevel;
  beginnerFriendly: boolean;
  availability: string;
  workingHours: string;
  compensation: string;
  compensationPublic: boolean;
  workType: string;
  openingsCount: number;
  additionalInfo: string;
  status: JobStatus;
  isDemo: boolean;
  createdAt: string;
  publishedAt?: string;
  closedAt?: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  motivation: string;
  relevantExperience: string;
  availabilityNote: string;
  additionalNote: string;
  candidateSnapshot: {
    firstName: string;
    lastName: string;
    email: string;
    chatterExperience: string;
    languages: LanguageSkill[];
    country: string;
    city: string;
    availability: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}
