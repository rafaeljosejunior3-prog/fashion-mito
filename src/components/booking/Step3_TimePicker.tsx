import { motion } from 'motion/react';
import { getTimeSlots } from './bookingUtils';

interface Step3TimePickerProps {
  selectedTime: string | null;
  onSelect: (time: string) => void;
  serviceDuration: string;
}

export function Step3TimePicker({
  selectedTime,
  onSelect,
  serviceDuration,
}: Step3TimePickerProps) {
  const slots = getTimeSlots();

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="font-serif text-2xl text-white mb-1">Escolha o Horário</h2>
        <p className="text-zinc-400 text-sm">Selecione um slot disponível para a sua consulta</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {/* Service duration indicator */}
        <div className="mb-5 text-center">
          <span className="inline-flex items-center gap-2 text-sm text-zinc-400 border border-gold/20 rounded-full px-4 py-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-gold"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Duração: <span className="text-gold font-medium">{serviceDuration}</span>
          </span>
        </div>

        {/* Time slots grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
          role="group"
          aria-label="Slots de horário disponíveis"
        >
          {slots.map((slot) => {
            const isSelected = selectedTime === slot;
            // All slots are available for now — structure with aria-disabled for future use
            const isDisabled = false;

            return (
              <button
                key={slot}
                onClick={() => !isDisabled && onSelect(slot)}
                disabled={isDisabled}
                aria-pressed={isSelected}
                aria-disabled={isDisabled ? 'true' : undefined}
                aria-label={`Horário ${slot}`}
                className={[
                  'rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-150',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black',
                  isSelected
                    ? 'bg-gold text-black font-semibold border-gold cursor-pointer'
                    : isDisabled
                    ? 'border-zinc-800 text-zinc-600 cursor-not-allowed opacity-40'
                    : 'border-gold/20 text-white hover:border-gold/50 hover:bg-gold/10 cursor-pointer',
                ].join(' ')}
              >
                {slot}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-5 flex items-center justify-center gap-5 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-gold inline-block" aria-hidden="true" />
            Selecionado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded border border-gold/20 inline-block" aria-hidden="true" />
            Disponível
          </span>
        </div>
      </motion.div>
    </div>
  );
}
