import { motion } from 'motion/react';
import type { Service } from './bookingTypes';
import { SERVICES } from './bookingConstants';

interface Step1ServiceSelectProps {
  selectedService: Service | null;
  onSelect: (service: Service) => void;
}

// SVG icons mapped by data-icon value
function ServiceIcon({ serviceId }: { serviceId: string }) {
  switch (serviceId) {
    case 'fatos-medida':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8"
          aria-hidden="true"
        >
          {/* Scissors icon */}
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <line x1="20" y1="4" x2="8.12" y2="15.88" />
          <line x1="14.47" y1="14.48" x2="20" y2="20" />
          <line x1="8.12" y1="8.12" x2="12" y2="12" />
        </svg>
      );
    case 'ajustes':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8"
          aria-hidden="true"
        >
          {/* Ruler icon */}
          <path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z" />
          <path d="m7.5 10.5 2 2" />
          <path d="m10.5 7.5 2 2" />
          <path d="m13.5 4.5 2 2" />
          <path d="m4.5 13.5 2 2" />
        </svg>
      );
    case 'uniformes':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8"
          aria-hidden="true"
        >
          {/* Briefcase icon */}
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case 'tradicional':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8"
          aria-hidden="true"
        >
          {/* Shirt icon */}
          <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  },
};

export function Step1ServiceSelect({ selectedService, onSelect }: Step1ServiceSelectProps) {
  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="font-serif text-2xl text-white mb-1">Escolha o Serviço</h2>
        <p className="text-zinc-400 text-sm">Selecione o tipo de consulta que pretende agendar</p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        role="radiogroup"
        aria-label="Serviços disponíveis"
      >
        {SERVICES.map((service) => {
          const isSelected = selectedService?.id === service.id;

          return (
            <motion.button
              key={service.id}
              variants={cardVariants}
              onClick={() => onSelect(service)}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${service.name} — ${service.duration}`}
              className={[
                'relative flex flex-col items-start gap-3 p-5 rounded-lg border text-left',
                'transition-colors duration-200 cursor-pointer focus:outline-none',
                'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black',
                isSelected
                  ? 'border-gold bg-gold/5'
                  : 'border-gold/20 bg-zinc-900/50 hover:border-gold/50 hover:bg-zinc-900',
              ].join(' ')}
            >
              {/* Selected indicator dot */}
              {isSelected && (
                <motion.span
                  className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-gold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  aria-hidden="true"
                />
              )}

              {/* Icon */}
              <span
                className={[
                  'transition-colors duration-200',
                  isSelected ? 'text-gold' : 'text-zinc-400',
                ].join(' ')}
              >
                <ServiceIcon serviceId={service.id} />
              </span>

              {/* Service name */}
              <span
                className={[
                  'font-serif text-base font-semibold leading-tight transition-colors duration-200',
                  isSelected ? 'text-gold' : 'text-white',
                ].join(' ')}
              >
                {service.name}
              </span>

              {/* Description */}
              <span className="text-zinc-400 text-xs leading-relaxed flex-1">
                {service.description}
              </span>

              {/* Duration badge */}
              <span
                className={[
                  'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border transition-colors duration-200',
                  isSelected
                    ? 'border-gold/40 text-gold bg-gold/10'
                    : 'border-zinc-700 text-zinc-500 bg-zinc-800',
                ].join(' ')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3 h-3"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {service.duration}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
