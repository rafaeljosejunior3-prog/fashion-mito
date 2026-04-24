import { useState } from 'react';
import { motion } from 'motion/react';
import { isDateAvailable } from './bookingUtils';

interface Step2DatePickerProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
}

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function getCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = firstDay.getDay(); // 0=Sun
  const days: (Date | null)[] = [];

  for (let i = 0; i < startPadding; i++) {
    days.push(null);
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

export function Step2DatePicker({ selectedDate, onSelect }: Step2DatePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const isCurrentMonth =
    viewYear === today.getFullYear() && viewMonth === today.getMonth();

  function prevMonth() {
    if (isCurrentMonth) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  const calendarDays = getCalendarDays(viewYear, viewMonth);

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="font-serif text-2xl text-white mb-1">Escolha a Data</h2>
        <p className="text-zinc-400 text-sm">Selecione um dia disponível para a sua consulta</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="mx-auto max-w-sm"
      >
        {/* Month navigation header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <button
            onClick={prevMonth}
            disabled={isCurrentMonth}
            aria-label="Mês anterior"
            className={[
              'flex items-center justify-center w-9 h-9 rounded-full border transition-colors duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black',
              isCurrentMonth
                ? 'border-zinc-800 text-zinc-700 cursor-not-allowed opacity-40'
                : 'border-gold/30 text-gold hover:bg-gold/10 cursor-pointer',
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
              className="w-4 h-4"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <span className="font-serif text-white text-lg font-medium">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>

          <button
            onClick={nextMonth}
            aria-label="Próximo mês"
            className={[
              'flex items-center justify-center w-9 h-9 rounded-full border transition-colors duration-200',
              'border-gold/30 text-gold hover:bg-gold/10 cursor-pointer',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black',
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
              className="w-4 h-4"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Weekday labels */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="text-center text-xs font-medium text-zinc-500 py-1"
              aria-hidden="true"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-y-1">
          {calendarDays.map((date, idx) => {
            if (!date) {
              return <div key={`empty-${idx}`} aria-hidden="true" />;
            }

            const available = isDateAvailable(date);
            const isToday = date.getTime() === today.getTime();
            const isSelected =
              selectedDate !== null &&
              date.getFullYear() === selectedDate.getFullYear() &&
              date.getMonth() === selectedDate.getMonth() &&
              date.getDate() === selectedDate.getDate();

            return (
              <div key={date.toISOString()} className="flex justify-center">
                <button
                  onClick={() => available && onSelect(date)}
                  disabled={!available}
                  aria-label={date.toLocaleDateString('pt-PT', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  aria-pressed={isSelected}
                  aria-disabled={!available ? 'true' : undefined}
                  className={[
                    'relative flex flex-col items-center justify-center rounded-full',
                    'min-w-[44px] min-h-[44px] w-11 h-11',
                    'text-sm font-medium transition-colors duration-150',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black',
                    isSelected
                      ? 'bg-gold text-black font-semibold cursor-pointer'
                      : available
                      ? 'text-white hover:bg-gold/20 hover:text-white cursor-pointer'
                      : 'text-zinc-600 cursor-not-allowed opacity-50',
                  ].join(' ')}
                >
                  <span>{date.getDate()}</span>

                  {/* Today indicator — subtle golden dot */}
                  {isToday && (
                    <span
                      className={[
                        'absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full',
                        isSelected ? 'bg-black/60' : 'bg-gold',
                      ].join(' ')}
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-5 flex items-center justify-center gap-5 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gold inline-block" aria-hidden="true" />
            Hoje
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-gold inline-block" aria-hidden="true" />
            Selecionado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-zinc-700 opacity-50 inline-block" aria-hidden="true" />
            Indisponível
          </span>
        </div>
      </motion.div>
    </div>
  );
}
