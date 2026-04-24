# Tasks — Sistema de Agendamento Fashion Mito

## Implementation Plan

---

- [x] 1. Criar tipos e utilitários base do sistema de agendamento
  - [x] 1.1 Criar ficheiro `src/components/booking/bookingTypes.ts` com todas as interfaces TypeScript (`BookingState`, `Service`, `PersonalDetails`, `BookingStep`)
  - [x] 1.2 Criar ficheiro `src/components/booking/bookingUtils.ts` com funções puras: `isDateAvailable`, `getTimeSlots`, `validateName`, `validatePhone`, `validateEmail`, `isBookingSubmittable`, `buildFormspreePayload`, `buildWhatsAppUrl`
  - [x] 1.3 Definir a constante `SERVICES` com os 4 serviços (Fatos Sob Medida, Ajustes de Roupa, Uniformes Corporativos, Vestuário Tradicional)
  - [x] 1.4 Escrever testes de propriedade para `isDateAvailable` (Properties 2 e 3 do design)
  - [x] 1.5 Escrever testes de propriedade para `validatePhone` e `validateName` (Properties 5 e 6 do design)
  - [x] 1.6 Escrever testes de propriedade para `buildWhatsAppUrl` e `buildFormspreePayload` (Properties 7 e 8 do design)
  - [x] 1.7 Escrever testes de propriedade para `getTimeSlots` (Property 4 do design)
  - [x] 1.8 Escrever testes de propriedade para `isBookingSubmittable` (Property 9 do design)
  - [x] 1.9 Escrever testes de propriedade para a constante `SERVICES` (Property 10 do design)
  - [x] 1.10 Executar todos os testes e confirmar que passam

- [x] 2. Criar componente `BookingProgress`
  - [x] 2.1 Criar `src/components/booking/BookingProgress.tsx` com indicadores visuais dos 4 passos
  - [x] 2.2 Implementar estados visuais: passo ativo (círculo dourado), passo completo (✓ dourado), passo futuro (círculo cinzento)
  - [x] 2.3 Implementar linha conectora entre passos
  - [x] 2.4 Adicionar atributos de acessibilidade: `aria-current="step"` no passo ativo

- [x] 3. Criar componente `Step1_ServiceSelect`
  - [x] 3.1 Criar `src/components/booking/Step1_ServiceSelect.tsx` com grelha de cards de serviços
  - [x] 3.2 Implementar layout responsivo: 1 coluna mobile, 2 tablet, 4 desktop
  - [x] 3.3 Implementar estado de seleção visual (borda dourada, fundo subtil)
  - [x] 3.4 Apresentar nome, descrição, duração e ícone para cada serviço
  - [x] 3.5 Animar entrada dos cards com Framer Motion (stagger)

- [x] 4. Criar componente `Step2_DatePicker`
  - [x] 4.1 Criar `src/components/booking/Step2_DatePicker.tsx` com calendário mensal
  - [x] 4.2 Implementar navegação entre meses (botões anterior/próximo)
  - [x] 4.3 Implementar lógica de desativação: datas passadas, domingos, datas além de 60 dias
  - [x] 4.4 Implementar estado de seleção visual (fundo dourado, texto preto)
  - [x] 4.5 Marcar o dia atual com indicador subtil (ponto dourado)
  - [x] 4.6 Garantir tamanho mínimo de célula de 44x44px para acessibilidade táctil
  - [x] 4.7 Adicionar `aria-disabled="true"` a datas indisponíveis

- [x] 5. Criar componente `Step3_TimePicker`
  - [x] 5.1 Criar `src/components/booking/Step3_TimePicker.tsx` com grelha de slots de horário
  - [x] 5.2 Apresentar duração do serviço selecionado acima da grelha
  - [x] 5.3 Implementar layout responsivo: 2 colunas mobile, 3–4 desktop
  - [x] 5.4 Implementar estado de seleção visual (fundo dourado, texto preto)
  - [x] 5.5 Adicionar `aria-disabled="true"` a slots indisponíveis

- [x] 6. Criar componente `Step4_PersonalDetails`
  - [x] 6.1 Criar `src/components/booking/Step4_PersonalDetails.tsx` com formulário de dados pessoais
  - [x] 6.2 Implementar campos: Nome (obrigatório), Telefone (obrigatório), Email (opcional), Notas (opcional)
  - [x] 6.3 Implementar validação em tempo real com mensagens de erro inline
  - [x] 6.4 Integrar funções de validação de `bookingUtils.ts`
  - [x] 6.5 Estilizar campos com bordas douradas no foco, consistente com o design do site

- [x] 7. Criar componente `BookingConfirmation`
  - [x] 7.1 Criar `src/components/booking/BookingConfirmation.tsx` com ecrã de sucesso
  - [x] 7.2 Apresentar ícone de checkmark animado (Framer Motion)
  - [x] 7.3 Apresentar resumo do agendamento: serviço, data (dd/MM/yyyy), hora, nome
  - [x] 7.4 Apresentar mensagem de sucesso em português
  - [x] 7.5 Implementar botão "Fechar" que fecha o modal

- [x] 8. Criar componente raiz `BookingSystem`
  - [x] 8.1 Criar `src/components/booking/BookingSystem.tsx` com gestão de estado global do fluxo
  - [x] 8.2 Implementar `useReducer` ou `useState` para `BookingState`
  - [x] 8.3 Implementar lógica de navegação entre passos (avançar/recuar)
  - [x] 8.4 Implementar lógica de submissão: detetar `VITE_FORMSPREE_ENDPOINT` e escolher Formspree ou WhatsApp
  - [x] 8.5 Implementar wrapper modal: overlay escurecido, animação de entrada/saída, botão X
  - [x] 8.6 Implementar bloqueio de scroll da página quando o modal está aberto
  - [x] 8.7 Implementar fecho com tecla Escape
  - [x] 8.8 Adicionar `role="dialog"`, `aria-modal="true"`, `aria-label` ao modal
  - [x] 8.9 Implementar focus trap dentro do modal
  - [x] 8.10 Implementar botões de navegação "Anterior" / "Próximo" / "Confirmar Agendamento"
  - [x] 8.11 Desativar botão "Confirmar" quando `isBookingSubmittable` retorna `false`
  - [x] 8.12 Apresentar indicador de carregamento durante submissão

- [x] 9. Integrar `BookingSystem` no `App.tsx`
  - [x] 9.1 Adicionar estado `isBookingOpen` ao `App.tsx`
  - [x] 9.2 Ligar o botão "Agendar Agora" no Hero ao `setIsBookingOpen(true)`
  - [x] 9.3 Ligar o botão "Agendar Medida" na Navbar ao `setIsBookingOpen(true)`
  - [x] 9.4 Renderizar `<BookingSystem isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />` no App
  - [x] 9.5 Verificar que os links `href="#contact"` nos cards de serviços continuam a funcionar para mensagens gerais

- [x] 10. Configurar variável de ambiente Formspree
  - [x] 10.1 Adicionar `VITE_FORMSPREE_ENDPOINT=` ao ficheiro `.env.example`
  - [x] 10.2 Documentar no README como configurar o endpoint Formspree

- [x] 11. Testes de integração e verificação final
  - [x] 11.1 Executar `npm run lint` e corrigir erros TypeScript
  - [x] 11.2 Executar `npm test` e confirmar que todos os testes passam
  - [x] 11.3 Verificar fluxo completo manualmente: serviço → data → horário → dados → submissão WhatsApp
  - [x] 11.4 Verificar responsividade em mobile (< 768px) e desktop
  - [x] 11.5 Verificar navegação por teclado (Tab, Enter, Escape)
