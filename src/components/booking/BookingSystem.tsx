import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import type { BookingState, BookingStep, PersonalDetails, Service } from './bookingTypes';
import { isBookingSubmittable, buildFormspreePayload, buildWhatsAppUrl } from './bookingUtils';
import { BookingProgress } from './BookingProgress';
import { Step1ServiceSelect } from './Step1_ServiceSelect';
import { Step2DatePicker } from './Step2_DatePicker';
import { Step3TimePicker } from './Step3_TimePicker';
import { Step4PersonalDetails } from './Step4_PersonalDetails';
import { BookingConfirmation } from './BookingConfirmation';

interface BookingSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialState: BookingState = {
  currentStep: 1,
  selectedService: null,
  selectedDate: null,
  selectedTime: null,
  personalDetails: null,
  submissionStatus: 'idle',
};

export function BookingSystem({ isOpen, onClose }: BookingSystemProps) {
  const [state, setState] = useState<BookingState>(initialState);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setState(initialState);
    }
  }, [isOpen]);

  // Block body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap: focus close button when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Focus trap: keep focus inside modal
  const handleKeyDownTrap = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  }, []);

  function canAdvance(): boolean {
    switch (state.currentStep) {
      case 1: return state.selectedService !== null;
      case 2: return state.selectedDate !== null;
      case 3: return state.selectedTime !== null;
      case 4: return isBookingSubmittable(state);
      default: return false;
    }
  }

  function goNext() {
    if (state.currentStep < 4) {
      setState(s => ({ ...s, currentStep: (s.currentStep + 1) as BookingStep }));
    }
  }

  function goPrev() {
    if (state.currentStep > 1) {
      setState(s => ({ ...s, currentStep: (s.currentStep - 1) as BookingStep }));
    }
  }

  async function handleSubmit() {
    if (!isBookingSubmittable(state)) return;
    const { selectedService, selectedDate, selectedTime, personalDetails } = state;
    if (!selectedService || !selectedDate || !selectedTime || !personalDetails) return;

    setState(s => ({ ...s, submissionStatus: 'submitting' }));

    const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined;

    if (formspreeEndpoint) {
      try {
        const payload = buildFormspreePayload(selectedService, selectedDate, selectedTime, personalDetails);
        const res = await fetch(formspreeEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setState(s => ({ ...s, submissionStatus: 'success' }));
        } else {
          setState(s => ({ ...s, submissionStatus: 'error' }));
        }
      } catch {
        setState(s => ({ ...s, submissionStatus: 'error' }));
      }
    } else {
      // WhatsApp fallback
      const url = buildWhatsAppUrl(selectedService, selectedDate, selectedTime, personalDetails);
      window.open(url, '_blank');
      setState(s => ({ ...s, submissionStatus: 'success' }));
    }
  }

  const isSubmitting = state.submissionStatus === 'submitting';
  const isSuccess = state.submissionStatus === 'success';
  const isError = state.submissionStatus === 'error';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="Sistema de Agendamento Fashion Mito"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onKeyDown={handleKeyDownTrap}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-3xl max-h-[90vh] bg-zinc-950 border border-gold/20 rounded-xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gold/10 flex-shrink-0">
                <h2 className="font-serif text-lg text-white tracking-widest uppercase">
                  Agendar Consulta
                </h2>
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  aria-label="Fechar modal de agendamento"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-gold/20 text-zinc-400 hover:text-white hover:border-gold/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Progress bar (hidden on success/error) */}
              {!isSuccess && !isError && (
                <div className="px-6 py-4 border-b border-gold/10 flex-shrink-0">
                  <BookingProgress currentStep={state.currentStep} />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <AnimatePresence mode="wait">
                  {isSuccess && state.selectedService && state.selectedDate && state.selectedTime && state.personalDetails ? (
                    <motion.div key="confirmation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <BookingConfirmation
                        service={state.selectedService}
                        date={state.selectedDate}
                        time={state.selectedTime}
                        name={state.personalDetails.name}
                        onClose={onClose}
                      />
                    </motion.div>
                  ) : isError ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center py-12 text-center gap-4"
                    >
                      <div className="w-16 h-16 rounded-full border-2 border-red-500/50 flex items-center justify-center text-red-400 text-2xl">✕</div>
                      <h3 className="font-serif text-xl text-white">Erro ao enviar</h3>
                      <p className="text-zinc-400 text-sm max-w-xs">
                        Não foi possível enviar o agendamento. Por favor, tente contactar-nos diretamente pelo WhatsApp.
                      </p>
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => setState(s => ({ ...s, submissionStatus: 'idle' }))}
                          className="px-5 py-2 border border-gold/30 text-gold text-sm rounded-lg hover:bg-gold/10 transition-colors"
                        >
                          Tentar novamente
                        </button>
                        <a
                          href="https://wa.me/258840218385"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2 bg-[#25D366] text-white text-sm rounded-lg hover:bg-[#20b858] transition-colors"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`step-${state.currentStep}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      {state.currentStep === 1 && (
                        <Step1ServiceSelect
                          selectedService={state.selectedService}
                          onSelect={(service: Service) => setState(s => ({ ...s, selectedService: service }))}
                        />
                      )}
                      {state.currentStep === 2 && (
                        <Step2DatePicker
                          selectedDate={state.selectedDate}
                          onSelect={(date: Date) => setState(s => ({ ...s, selectedDate: date }))}
                        />
                      )}
                      {state.currentStep === 3 && (
                        <Step3TimePicker
                          selectedTime={state.selectedTime}
                          onSelect={(time: string) => setState(s => ({ ...s, selectedTime: time }))}
                          serviceDuration={state.selectedService?.duration ?? '60 min'}
                        />
                      )}
                      {state.currentStep === 4 && (
                        <Step4PersonalDetails
                          personalDetails={state.personalDetails}
                          onChange={(details: PersonalDetails) => setState(s => ({ ...s, personalDetails: details }))}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer navigation (hidden on success/error) */}
              {!isSuccess && !isError && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gold/10 flex-shrink-0">
                  <button
                    onClick={goPrev}
                    disabled={state.currentStep === 1}
                    className="px-5 py-2 text-sm border border-gold/20 text-zinc-400 rounded-lg hover:border-gold/50 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    ← Anterior
                  </button>

                  {state.currentStep < 4 ? (
                    <button
                      onClick={goNext}
                      disabled={!canAdvance()}
                      className="px-6 py-2 text-sm bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                    >
                      Próximo →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!canAdvance() || isSubmitting}
                      className="px-6 py-2 text-sm bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" aria-hidden="true" />
                          A enviar...
                        </>
                      ) : (
                        'Confirmar Agendamento'
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
