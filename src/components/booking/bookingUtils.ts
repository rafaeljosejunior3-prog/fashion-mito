import type { BookingState, PersonalDetails, Service } from './bookingTypes';

// Constants
const AVAILABLE_DAYS = [1, 2, 3, 4, 5, 6]; // Monday to Saturday (0=Sunday, 6=Saturday)
const BOOKING_HORIZON_DAYS = 60;
const WHATSAPP_NUMBER = '258840218385';

/**
 * Check if a date is available for booking
 * - Must be in the future
 * - Must not be a Sunday
 * - Must be within 60 days from today
 */
export function isDateAvailable(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  // Check if date is in the past
  if (checkDate < today) {
    return false;
  }
  
  // Check if date is a Sunday (0)
  if (checkDate.getDay() === 0) {
    return false;
  }
  
  // Check if date is within booking horizon
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + BOOKING_HORIZON_DAYS);
  
  if (checkDate > maxDate) {
    return false;
  }
  
  return true;
}

/**
 * Get available time slots for booking
 * Slots are 30 minutes apart from 08:00 to 17:30
 * Excludes lunch break (12:30 - 14:00)
 */
export function getTimeSlots(): string[] {
  const slots: string[] = [];
  
  // Morning slots: 08:00 - 12:00
  for (let hour = 8; hour < 12; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  
  // Add 12:00 but not 12:30
  slots.push('12:00');
  
  // Afternoon slots: 14:00 - 17:30 (excluding 12:30 and 13:30)
  for (let hour = 14; hour <= 17; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 17 || hour === 17) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  
  return slots;
}

/**
 * Validate name field
 * Must be at least 2 characters
 */
export function validateName(name: string): boolean {
  return name.trim().length >= 2;
}

/**
 * Validate phone field
 * Must match Mozambican phone format:
 * - +258 followed by 8 or 9 and 8 digits
 * - 258 followed by 8 or 9 and 8 digits
 * - 8 or 9 followed by 8 digits
 */
export function validatePhone(phone: string): boolean {
  const patterns = [
    /^\+258[89]\d{8}$/,  // +258 8/9 + 8 digits
    /^258[89]\d{8}$/,    // 258 8/9 + 8 digits
    /^[89]\d{8}$/,       // 8/9 + 8 digits
  ];
  
  const cleanPhone = phone.trim();
  return patterns.some(pattern => pattern.test(cleanPhone));
}

/**
 * Validate email field
 * Basic email format validation
 */
export function validateEmail(email: string): boolean {
  if (email.trim() === '') {
    return true; // Email is optional
  }
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email.trim());
}

/**
 * Check if booking is submittable
 * All required fields must be present and valid
 */
export function isBookingSubmittable(state: BookingState): boolean {
  if (!state.selectedService || !state.selectedDate || !state.selectedTime) {
    return false;
  }
  
  if (!state.personalDetails) {
    return false;
  }
  
  const { name, phone, email } = state.personalDetails;
  
  if (!validateName(name)) {
    return false;
  }
  
  if (!validatePhone(phone)) {
    return false;
  }
  
  if (!validateEmail(email)) {
    return false;
  }
  
  return true;
}

/**
 * Build payload for Formspree submission
 */
export function buildFormspreePayload(
  service: Service,
  date: Date,
  time: string,
  personalDetails: PersonalDetails
): Record<string, string> {
  const formatDate = (d: Date): string => {
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  return {
    service: service.name,
    date: formatDate(date),
    time: time,
    name: personalDetails.name,
    phone: personalDetails.phone,
    email: personalDetails.email,
    notes: personalDetails.notes,
  };
}

/**
 * Build WhatsApp URL with pre-filled message
 */
export function buildWhatsAppUrl(
  service: Service,
  date: Date,
  time: string,
  personalDetails: PersonalDetails
): string {
  const formatDate = (d: Date): string => {
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  const message = 
    `Olá Fashion Mito! Gostaria de agendar:\n\n` +
    `📋 Serviço: ${service.name}\n` +
    `📅 Data: ${formatDate(date)}\n` +
    `🕐 Hora: ${time}\n` +
    `👤 Nome: ${personalDetails.name}\n` +
    `📞 Telefone: ${personalDetails.phone}\n` +
    `📧 Email: ${personalDetails.email}\n` +
    `📝 Notas: ${personalDetails.notes || 'Nenhuma'}`;
  
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
