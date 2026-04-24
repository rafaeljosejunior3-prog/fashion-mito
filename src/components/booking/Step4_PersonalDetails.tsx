import { useState } from 'react';
import { motion } from 'motion/react';
import type { PersonalDetails } from './bookingTypes';
import { validateName, validatePhone, validateEmail } from './bookingUtils';

interface Step4PersonalDetailsProps {
  personalDetails: PersonalDetails | null;
  onChange: (details: PersonalDetails) => void;
}

interface TouchedFields {
  name: boolean;
  phone: boolean;
  email: boolean;
  notes: boolean;
}

const NOTES_MAX_LENGTH = 500;

const emptyDetails: PersonalDetails = {
  name: '',
  phone: '',
  email: '',
  notes: '',
};

export function Step4PersonalDetails({
  personalDetails,
  onChange,
}: Step4PersonalDetailsProps) {
  const details = personalDetails ?? emptyDetails;

  const [touched, setTouched] = useState<TouchedFields>({
    name: false,
    phone: false,
    email: false,
    notes: false,
  });

  function handleBlur(field: keyof TouchedFields) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handleChange(field: keyof PersonalDetails, value: string) {
    onChange({ ...details, [field]: value });
  }

  // Derive error messages — only shown after field is touched
  const nameError =
    touched.name && !validateName(details.name)
      ? 'O nome deve ter pelo menos 2 caracteres.'
      : null;

  const phoneError =
    touched.phone && !validatePhone(details.phone)
      ? 'Introduza um número de telefone moçambicano válido (ex: +258 84 000 0000).'
      : null;

  const emailError =
    touched.email && !validateEmail(details.email)
      ? 'Introduza um endereço de email válido.'
      : null;

  const baseInputClass =
    'w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-3 ' +
    'focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none ' +
    'transition-colors duration-150 placeholder:text-zinc-500';

  const errorInputClass = 'border-red-500 focus:border-red-500 focus:ring-red-500';

  return (
    <div>
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="font-serif text-2xl text-white mb-1">Dados Pessoais</h2>
        <p className="text-zinc-400 text-sm">
          Preencha os seus dados para confirmar o agendamento
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        onSubmit={(e) => e.preventDefault()}
        noValidate
        aria-label="Formulário de dados pessoais"
      >
        <div className="space-y-5">
          {/* Nome Completo */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <label
              htmlFor="booking-name"
              className="block text-sm font-medium text-zinc-300 mb-1.5"
            >
              Nome Completo{' '}
              <span className="text-gold" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="booking-name"
              type="text"
              autoComplete="name"
              required
              aria-required="true"
              aria-invalid={nameError ? 'true' : 'false'}
              aria-describedby={nameError ? 'booking-name-error' : undefined}
              value={details.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="O seu nome completo"
              className={[baseInputClass, nameError ? errorInputClass : ''].join(' ')}
            />
            {nameError && (
              <p
                id="booking-name-error"
                role="alert"
                className="mt-1.5 text-xs text-red-400"
              >
                {nameError}
              </p>
            )}
          </motion.div>

          {/* Telefone */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <label
              htmlFor="booking-phone"
              className="block text-sm font-medium text-zinc-300 mb-1.5"
            >
              Telefone{' '}
              <span className="text-gold" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="booking-phone"
              type="tel"
              autoComplete="tel"
              required
              aria-required="true"
              aria-invalid={phoneError ? 'true' : 'false'}
              aria-describedby={phoneError ? 'booking-phone-error' : undefined}
              value={details.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              placeholder="+258 84 000 0000"
              className={[baseInputClass, phoneError ? errorInputClass : ''].join(' ')}
            />
            {phoneError && (
              <p
                id="booking-phone-error"
                role="alert"
                className="mt-1.5 text-xs text-red-400"
              >
                {phoneError}
              </p>
            )}
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <label
              htmlFor="booking-email"
              className="block text-sm font-medium text-zinc-300 mb-1.5"
            >
              Email{' '}
              <span className="text-zinc-500 text-xs font-normal">(opcional)</span>
            </label>
            <input
              id="booking-email"
              type="email"
              autoComplete="email"
              aria-invalid={emailError ? 'true' : 'false'}
              aria-describedby={emailError ? 'booking-email-error' : undefined}
              value={details.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="o.seu@email.com"
              className={[baseInputClass, emailError ? errorInputClass : ''].join(' ')}
            />
            {emailError && (
              <p
                id="booking-email-error"
                role="alert"
                className="mt-1.5 text-xs text-red-400"
              >
                {emailError}
              </p>
            )}
          </motion.div>

          {/* Notas */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <label
              htmlFor="booking-notes"
              className="block text-sm font-medium text-zinc-300 mb-1.5"
            >
              Notas{' '}
              <span className="text-zinc-500 text-xs font-normal">(opcional)</span>
            </label>
            <textarea
              id="booking-notes"
              rows={4}
              maxLength={NOTES_MAX_LENGTH}
              aria-describedby="booking-notes-counter"
              value={details.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              onBlur={() => handleBlur('notes')}
              placeholder="Informações adicionais, preferências ou pedidos especiais..."
              className={[
                baseInputClass,
                'resize-none',
              ].join(' ')}
            />
            <p
              id="booking-notes-counter"
              className={[
                'mt-1 text-xs text-right',
                details.notes.length >= NOTES_MAX_LENGTH
                  ? 'text-red-400'
                  : 'text-zinc-500',
              ].join(' ')}
              aria-live="polite"
            >
              {details.notes.length}/{NOTES_MAX_LENGTH}
            </p>
          </motion.div>
        </div>

        {/* Required fields note */}
        <p className="mt-5 text-xs text-zinc-500">
          <span className="text-gold" aria-hidden="true">
            *
          </span>{' '}
          Campos obrigatórios
        </p>
      </motion.form>
    </div>
  );
}
