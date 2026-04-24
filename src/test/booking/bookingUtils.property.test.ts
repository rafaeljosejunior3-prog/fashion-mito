import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  isDateAvailable,
  getTimeSlots,
  validateName,
  validatePhone,
  validateEmail,
  isBookingSubmittable,
  buildFormspreePayload,
  buildWhatsAppUrl,
} from '../../components/booking/bookingUtils';
import { SERVICES } from '../../components/booking/bookingConstants';
import type { BookingState, PersonalDetails, Service } from '../../components/booking/bookingTypes';

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeDate(offsetDays: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  return d;
}

/** Arbitrary that generates a Date in the past (before today) */
const pastDateArb = fc.integer({ min: 1, max: 3650 }).map(days => makeDate(-days));

/** Arbitrary that generates a future non-Sunday date within 60 days */
const futureAvailableDateArb = fc.integer({ min: 1, max: 59 }).map(days => {
  const d = makeDate(days);
  // If it lands on Sunday, shift to Monday
  if (d.getDay() === 0) {
    d.setDate(d.getDate() + 1);
  }
  return d;
});

/** Arbitrary for a valid Mozambican phone number */
const validPhoneArb = fc.oneof(
  fc.tuple(
    fc.constantFrom('8', '9'),
    fc.stringMatching(/^\d{8}$/)
  ).map(([prefix, digits]) => `+258${prefix}${digits}`),
  fc.tuple(
    fc.constantFrom('8', '9'),
    fc.stringMatching(/^\d{8}$/)
  ).map(([prefix, digits]) => `258${prefix}${digits}`),
  fc.tuple(
    fc.constantFrom('8', '9'),
    fc.stringMatching(/^\d{8}$/)
  ).map(([prefix, digits]) => `${prefix}${digits}`),
);

/** Arbitrary for a valid PersonalDetails object */
const validPersonalDetailsArb: fc.Arbitrary<PersonalDetails> = fc.record({
  name: fc.string({ minLength: 2, maxLength: 100 }),
  phone: validPhoneArb,
  email: fc.constantFrom('', 'test@example.com', 'user@domain.org'),
  notes: fc.string({ maxLength: 500 }),
});

/** Minimal valid Service for testing */
const testService: Service = {
  id: 'test-service',
  name: 'Test Service',
  description: 'A test service',
  duration: '60 min',
  icon: null,
};

// ─── Property 2: Datas passadas e domingos são sempre inválidos ──────────────

describe('Property 2: isDateAvailable — datas passadas e domingos são sempre inválidos', () => {
  /**
   * **Validates: Requirements 3.2, 3.3**
   */
  it('deve retornar false para qualquer data no passado', () => {
    fc.assert(
      fc.property(pastDateArb, (date) => {
        expect(isDateAvailable(date)).toBe(false);
      })
    );
  });

  it('deve retornar false para qualquer domingo futuro dentro do horizonte', () => {
    // Generate Sundays within the next 60 days
    const sundayArb = fc.integer({ min: 0, max: 59 }).map(offset => {
      const d = makeDate(offset);
      // Advance to next Sunday from this date
      const daysUntilSunday = (7 - d.getDay()) % 7;
      const sunday = new Date(d);
      sunday.setDate(sunday.getDate() + daysUntilSunday);
      return sunday;
    });

    fc.assert(
      fc.property(sundayArb, (sunday) => {
        // Only test if the sunday is within 60 days
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const maxDate = new Date(today);
        maxDate.setDate(maxDate.getDate() + 60);
        if (sunday <= maxDate && sunday > today) {
          expect(isDateAvailable(sunday)).toBe(false);
        }
      })
    );
  });
});

// ─── Property 3: Datas futuras dentro do horizonte e em dias úteis são válidas

describe('Property 3: isDateAvailable — datas futuras em dias úteis são válidas', () => {
  /**
   * **Validates: Requirements 3.4, 3.5**
   */
  it('deve retornar true para datas futuras não-domingo dentro de 60 dias', () => {
    fc.assert(
      fc.property(futureAvailableDateArb, (date) => {
        expect(isDateAvailable(date)).toBe(true);
      })
    );
  });
});

// ─── Property 4: Slots de horário excluem o intervalo de almoço ─────────────

describe('Property 4: getTimeSlots — exclui intervalo de almoço [12:30, 14:00[', () => {
  /**
   * **Validates: Requirements 4.2**
   */
  it('nenhum slot deve estar no intervalo [12:30, 14:00[', () => {
    const slots = getTimeSlots();

    fc.assert(
      fc.property(fc.constantFrom(...slots), (slot) => {
        const [hours, minutes] = slot.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;
        const lunchStart = 12 * 60 + 30; // 12:30
        const lunchEnd = 14 * 60;         // 14:00

        const isInLunchBreak = totalMinutes >= lunchStart && totalMinutes < lunchEnd;
        expect(isInLunchBreak).toBe(false);
      })
    );
  });
});

// ─── Property 5: Validação de telefone ──────────────────────────────────────

describe('Property 5: validatePhone — aceita e rejeita corretamente', () => {
  /**
   * **Validates: Requirements 5.3**
   */
  it('deve aceitar números moçambicanos válidos', () => {
    fc.assert(
      fc.property(validPhoneArb, (phone) => {
        expect(validatePhone(phone)).toBe(true);
      })
    );
  });

  it('deve rejeitar strings que não correspondem ao padrão moçambicano', () => {
    // Generate clearly invalid phones
    const invalidPhoneArb = fc.oneof(
      fc.string({ minLength: 0, maxLength: 5 }),                    // too short
      fc.stringMatching(/^[2-7]\d{8}$/),                            // wrong prefix digit
      fc.stringMatching(/^\+351\d{9}$/),                            // Portuguese number
      fc.constant(''),
      fc.constant('123456789'),
      fc.constant('abc'),
    );

    fc.assert(
      fc.property(invalidPhoneArb, (phone) => {
        expect(validatePhone(phone)).toBe(false);
      })
    );
  });
});

// ─── Property 6: Validação de nome ──────────────────────────────────────────

describe('Property 6: validateName — rejeita strings curtas', () => {
  /**
   * **Validates: Requirements 5.2**
   */
  it('deve retornar false para strings com menos de 2 caracteres', () => {
    const shortStringArb = fc.oneof(
      fc.constant(''),
      fc.string({ minLength: 1, maxLength: 1 }),
    );

    fc.assert(
      fc.property(shortStringArb, (name) => {
        expect(validateName(name)).toBe(false);
      })
    );
  });

  it('deve retornar true para strings com 2 ou mais caracteres', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 2, maxLength: 100 }), (name) => {
        // Only test non-whitespace-only strings (trim must have >= 2 chars)
        if (name.trim().length >= 2) {
          expect(validateName(name)).toBe(true);
        }
      })
    );
  });
});

// ─── Property 7: Payload Formspree contém todos os campos ───────────────────

describe('Property 7: buildFormspreePayload — contém todos os campos obrigatórios', () => {
  /**
   * **Validates: Requirements 6.2**
   */
  it('deve conter os campos: service, date, time, name, phone, email, notes', () => {
    const timeArb = fc.constantFrom('08:00', '09:30', '14:00', '17:30');

    fc.assert(
      fc.property(
        futureAvailableDateArb,
        timeArb,
        validPersonalDetailsArb,
        (date, time, personalDetails) => {
          const payload = buildFormspreePayload(testService, date, time, personalDetails);

          expect(payload).toHaveProperty('service');
          expect(payload).toHaveProperty('date');
          expect(payload).toHaveProperty('time');
          expect(payload).toHaveProperty('name');
          expect(payload).toHaveProperty('phone');
          expect(payload).toHaveProperty('email');
          expect(payload).toHaveProperty('notes');
        }
      )
    );
  });
});

// ─── Property 8: Mensagem WhatsApp contém todos os dados ────────────────────

describe('Property 8: buildWhatsAppUrl — mensagem contém todos os dados do agendamento', () => {
  /**
   * **Validates: Requirements 7.2, 7.3**
   */
  it('deve conter nome do serviço, data (dd/MM/yyyy), hora, nome do cliente e telefone', () => {
    const timeArb = fc.constantFrom('08:00', '09:30', '14:00', '17:30');

    fc.assert(
      fc.property(
        futureAvailableDateArb,
        timeArb,
        validPersonalDetailsArb,
        (date, time, personalDetails) => {
          const url = buildWhatsAppUrl(testService, date, time, personalDetails);
          const decoded = decodeURIComponent(url);

          // Check service name
          expect(decoded).toContain(testService.name);

          // Check date in dd/MM/yyyy format
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          expect(decoded).toContain(`${day}/${month}/${year}`);

          // Check time
          expect(decoded).toContain(time);

          // Check client name
          expect(decoded).toContain(personalDetails.name);

          // Check phone
          expect(decoded).toContain(personalDetails.phone);

          // Check URL starts with wa.me
          expect(url).toContain('https://wa.me/258840218385');
        }
      )
    );
  });
});

// ─── Property 9: isBookingSubmittable — bloqueado com campos inválidos ───────

describe('Property 9: isBookingSubmittable — retorna false com campos obrigatórios inválidos', () => {
  /**
   * **Validates: Requirements 5.7**
   */
  it('deve retornar false quando selectedService é null', () => {
    const stateArb: fc.Arbitrary<BookingState> = fc.record({
      currentStep: fc.constantFrom(4 as const),
      selectedService: fc.constant(null),
      selectedDate: futureAvailableDateArb,
      selectedTime: fc.constantFrom('09:00'),
      personalDetails: validPersonalDetailsArb,
      submissionStatus: fc.constantFrom('idle' as const),
    });

    fc.assert(
      fc.property(stateArb, (state) => {
        expect(isBookingSubmittable(state)).toBe(false);
      })
    );
  });

  it('deve retornar false quando selectedDate é null', () => {
    const stateArb: fc.Arbitrary<BookingState> = fc.record({
      currentStep: fc.constantFrom(4 as const),
      selectedService: fc.constant(testService),
      selectedDate: fc.constant(null),
      selectedTime: fc.constantFrom('09:00'),
      personalDetails: validPersonalDetailsArb,
      submissionStatus: fc.constantFrom('idle' as const),
    });

    fc.assert(
      fc.property(stateArb, (state) => {
        expect(isBookingSubmittable(state)).toBe(false);
      })
    );
  });

  it('deve retornar false quando selectedTime é null', () => {
    const stateArb: fc.Arbitrary<BookingState> = fc.record({
      currentStep: fc.constantFrom(4 as const),
      selectedService: fc.constant(testService),
      selectedDate: futureAvailableDateArb,
      selectedTime: fc.constant(null),
      personalDetails: validPersonalDetailsArb,
      submissionStatus: fc.constantFrom('idle' as const),
    });

    fc.assert(
      fc.property(stateArb, (state) => {
        expect(isBookingSubmittable(state)).toBe(false);
      })
    );
  });

  it('deve retornar false quando personalDetails é null', () => {
    const stateArb: fc.Arbitrary<BookingState> = fc.record({
      currentStep: fc.constantFrom(4 as const),
      selectedService: fc.constant(testService),
      selectedDate: futureAvailableDateArb,
      selectedTime: fc.constantFrom('09:00'),
      personalDetails: fc.constant(null),
      submissionStatus: fc.constantFrom('idle' as const),
    });

    fc.assert(
      fc.property(stateArb, (state) => {
        expect(isBookingSubmittable(state)).toBe(false);
      })
    );
  });

  it('deve retornar false quando o nome é inválido (menos de 2 chars)', () => {
    const invalidNameDetailsArb: fc.Arbitrary<PersonalDetails> = fc.record({
      name: fc.oneof(fc.constant(''), fc.string({ minLength: 1, maxLength: 1 })),
      phone: validPhoneArb,
      email: fc.constant(''),
      notes: fc.constant(''),
    });

    const stateArb: fc.Arbitrary<BookingState> = fc.record({
      currentStep: fc.constantFrom(4 as const),
      selectedService: fc.constant(testService),
      selectedDate: futureAvailableDateArb,
      selectedTime: fc.constantFrom('09:00'),
      personalDetails: invalidNameDetailsArb,
      submissionStatus: fc.constantFrom('idle' as const),
    });

    fc.assert(
      fc.property(stateArb, (state) => {
        expect(isBookingSubmittable(state)).toBe(false);
      })
    );
  });

  it('deve retornar false quando o telefone é inválido', () => {
    const invalidPhoneDetailsArb: fc.Arbitrary<PersonalDetails> = fc.record({
      name: fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length >= 2),
      phone: fc.constant('invalid-phone'),
      email: fc.constant(''),
      notes: fc.constant(''),
    });

    const stateArb: fc.Arbitrary<BookingState> = fc.record({
      currentStep: fc.constantFrom(4 as const),
      selectedService: fc.constant(testService),
      selectedDate: futureAvailableDateArb,
      selectedTime: fc.constantFrom('09:00'),
      personalDetails: invalidPhoneDetailsArb,
      submissionStatus: fc.constantFrom('idle' as const),
    });

    fc.assert(
      fc.property(stateArb, (state) => {
        expect(isBookingSubmittable(state)).toBe(false);
      })
    );
  });
});

// ─── Property 10: Cada serviço contém todos os campos obrigatórios ───────────

describe('Property 10: SERVICES — cada serviço contém todos os campos obrigatórios', () => {
  /**
   * **Validates: Requirements 2.4**
   */
  it('cada serviço deve conter: id, name, description, duration, icon', () => {
    fc.assert(
      fc.property(fc.constantFrom(...SERVICES), (service) => {
        expect(service).toHaveProperty('id');
        expect(service).toHaveProperty('name');
        expect(service).toHaveProperty('description');
        expect(service).toHaveProperty('duration');
        expect(service).toHaveProperty('icon');

        expect(typeof service.id).toBe('string');
        expect(service.id.length).toBeGreaterThan(0);

        expect(typeof service.name).toBe('string');
        expect(service.name.length).toBeGreaterThan(0);

        expect(typeof service.description).toBe('string');
        expect(service.description.length).toBeGreaterThan(0);

        expect(typeof service.duration).toBe('string');
        expect(service.duration.length).toBeGreaterThan(0);
      })
    );
  });

  it('deve conter exactamente 4 serviços', () => {
    expect(SERVICES).toHaveLength(4);
  });

  it('deve conter os IDs esperados', () => {
    const ids = SERVICES.map(s => s.id);
    expect(ids).toContain('fatos-medida');
    expect(ids).toContain('ajustes');
    expect(ids).toContain('uniformes');
    expect(ids).toContain('tradicional');
  });
});
