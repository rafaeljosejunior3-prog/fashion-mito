import type { ReactNode } from 'react';

export type BookingStep = 1 | 2 | 3 | 4;

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: string; // ex: "60 min"
  icon: ReactNode;
}

export interface PersonalDetails {
  name: string;
  phone: string;
  email: string;
  notes: string;
}

export interface BookingState {
  currentStep: BookingStep;
  selectedService: Service | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  personalDetails: PersonalDetails | null;
  submissionStatus: 'idle' | 'submitting' | 'success' | 'error';
}
