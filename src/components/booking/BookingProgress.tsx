import { motion } from 'motion/react';
import type { BookingStep } from './bookingTypes';

interface BookingProgressProps {
  currentStep: BookingStep;
}

const STEPS: { number: BookingStep; label: string }[] = [
  { number: 1, label: 'Serviço' },
  { number: 2, label: 'Data' },
  { number: 3, label: 'Horário' },
  { number: 4, label: 'Dados' },
];

export function BookingProgress({ currentStep }: BookingProgressProps) {
  return (
    <nav aria-label="Progresso do agendamento">
      <ol className="flex items-center justify-center gap-0">
        {STEPS.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;
          const isFuture = step.number > currentStep;
          const isLast = index === STEPS.length - 1;

          return (
            <li key={step.number} className="flex items-center">
              {/* Step indicator */}
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  className={[
                    'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                    isCompleted
                      ? 'bg-gold text-black'
                      : isActive
                        ? 'bg-gold text-black ring-2 ring-gold/40 ring-offset-2 ring-offset-black'
                        : 'bg-zinc-800 text-zinc-500',
                  ].join(' ')}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <span aria-hidden="true">✓</span>
                  ) : (
                    <span>{step.number}</span>
                  )}
                </motion.div>

                {/* Step label */}
                <span
                  className={[
                    'text-xs font-medium whitespace-nowrap',
                    isActive
                      ? 'text-gold'
                      : isCompleted
                        ? 'text-gold/70'
                        : 'text-zinc-500',
                  ].join(' ')}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line between steps */}
              {!isLast && (
                <div
                  className="relative w-12 sm:w-16 h-px mx-1 mb-5 flex-shrink-0 bg-zinc-700"
                  aria-hidden="true"
                >
                  <motion.div
                    className="absolute inset-0 bg-gold"
                    initial={false}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: 'left' }}
                  />
                </div>
              )}

              {/* Screen reader only: step status */}
              <span className="sr-only">
                {isCompleted
                  ? `Passo ${step.number} (${step.label}): concluído`
                  : isActive
                    ? `Passo ${step.number} (${step.label}): atual`
                    : `Passo ${step.number} (${step.label}): pendente`}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
