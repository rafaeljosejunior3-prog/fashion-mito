import { motion } from 'motion/react';
import type { Service } from './bookingTypes';

interface BookingConfirmationProps {
  service: Service;
  date: Date;
  time: string;
  name: string;
  onClose: () => void;
}

function formatDate(d: Date): string {
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ScissorsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export function BookingConfirmation({
  service,
  date,
  time,
  name,
  onClose,
}: BookingConfirmationProps) {
  const formattedDate = formatDate(date);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col items-center px-6 py-8 text-center"
      role="status"
      aria-live="polite"
    >
      {/* Checkmark animado */}
      <div className="relative mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, ease: 'backOut' }}
          className="w-20 h-20 rounded-full border-2 border-gold flex items-center justify-center bg-gold/8"
          aria-hidden="true"
        >
          <motion.svg
            className="w-10 h-10"
            viewBox="0 0 40 40"
            fill="none"
            stroke="#D4AF37"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M10 20 L17 27 L30 13"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.4, ease: 'easeOut' }}
            />
          </motion.svg>
        </motion.div>
      </div>

      {/* Título */}
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="text-2xl font-serif text-white mb-2"
      >
        Agendamento Confirmado
      </motion.h2>

      {/* Mensagem de sucesso */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        className="text-sm text-zinc-400 mb-8 max-w-xs leading-relaxed"
      >
        O seu agendamento foi submetido com sucesso! Entraremos em contacto brevemente para confirmar.
      </motion.p>

      {/* Resumo do agendamento */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.3 }}
        className="w-full max-w-sm rounded-lg border border-gold/20 bg-gold/5 mb-8 overflow-hidden"
      >
        {/* Serviço */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gold/10">
          <span className="text-gold"><ScissorsIcon /></span>
          <div className="text-left">
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Serviço</p>
            <p className="text-sm text-white font-medium">{service.name}</p>
          </div>
        </div>

        {/* Data */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gold/10">
          <span className="text-gold"><CalendarIcon /></span>
          <div className="text-left">
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Data</p>
            <p className="text-sm text-white font-medium">{formattedDate}</p>
          </div>
        </div>

        {/* Hora */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gold/10">
          <span className="text-gold"><ClockIcon /></span>
          <div className="text-left">
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Hora</p>
            <p className="text-sm text-white font-medium">{time}</p>
          </div>
        </div>

        {/* Nome */}
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="text-gold"><UserIcon /></span>
          <div className="text-left">
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Nome</p>
            <p className="text-sm text-white font-medium">{name}</p>
          </div>
        </div>
      </motion.div>

      {/* Botão Fechar */}
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.3 }}
        onClick={onClose}
        className="px-8 py-3 rounded-lg text-sm font-medium bg-gold text-black hover:bg-gold/90 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        aria-label="Fechar confirmação de agendamento"
      >
        Fechar
      </motion.button>
    </motion.div>
  );
}
