# Documento de Design: Sistema de Agendamento — Fashion Mito

## Visão Geral

Sistema de agendamento multi-passo integrado no site estático da Fashion Mito, permitindo que clientes marquem consultas de alfaiataria diretamente no site. Sem backend — os agendamentos são submetidos via Formspree (email) ou redirecionados para WhatsApp com mensagem pré-preenchida.

O fluxo guia o cliente por 4 passos sequenciais:
1. **Escolha do Serviço** — selecionar o tipo de serviço desejado
2. **Seleção de Data** — escolher uma data disponível num calendário
3. **Escolha de Horário** — selecionar um slot de hora disponível
4. **Dados Pessoais e Confirmação** — preencher nome, telefone, email e notas; submeter

Após submissão bem-sucedida, é apresentado um ecrã de confirmação visual com resumo do agendamento.

---

## Arquitetura

### Componente Principal

O sistema é implementado como um componente React autónomo `BookingSystem` que pode ser montado como modal (overlay) ou como secção inline na página. O estado do fluxo multi-passo é gerido localmente com `useState` e `useReducer`.

```
BookingSystem (modal ou inline)
├── BookingProgress        — barra de progresso com indicadores de passo
├── Step1_ServiceSelect    — grelha de cards de serviços
├── Step2_DatePicker       — calendário mensal navegável
├── Step3_TimePicker       — grelha de slots de horário
├── Step4_PersonalDetails  — formulário de dados pessoais
└── BookingConfirmation    — ecrã de sucesso pós-submissão
```

### Gestão de Estado

```typescript
interface BookingState {
  currentStep: 1 | 2 | 3 | 4;
  selectedService: Service | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  personalDetails: PersonalDetails | null;
  submissionStatus: 'idle' | 'submitting' | 'success' | 'error';
}

interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;   // ex: "60 min"
  icon: ReactNode;
}

interface PersonalDetails {
  name: string;
  phone: string;
  email: string;
  notes: string;
}
```

### Integração no Site Existente

- O botão "Agendar Agora" no Hero e "Agendar Medida" na Navbar abrem o modal de agendamento
- O componente `BookingSystem` é adicionado ao `App.tsx` com um estado `isBookingOpen` controlado pelo pai
- A secção `#contact` mantém-se para mensagens gerais; o agendamento é um fluxo separado

---

## Serviços Disponíveis

Os serviços são definidos como dados estáticos no componente, espelhando os serviços já presentes na secção Services do site:

| ID | Nome | Duração | Descrição |
|----|------|---------|-----------|
| `fatos-medida` | Fatos Sob Medida | 90 min | Consulta completa de alfaiataria bespoke |
| `ajustes` | Ajustes de Roupa | 30 min | Ajustes e alterações em peças existentes |
| `uniformes` | Uniformes Corporativos | 60 min | Consulta para uniformes de empresa |
| `tradicional` | Vestuário Tradicional | 60 min | Capulanas e trajes tradicionais africanos |

---

## Calendário e Disponibilidade

### Lógica de Disponibilidade (Client-Side)

Sem backend, a disponibilidade é determinada por regras estáticas configuráveis:

- **Dias disponíveis**: Segunda a Sábado (domingo bloqueado)
- **Datas passadas**: sempre bloqueadas
- **Horizonte de agendamento**: máximo 60 dias a partir de hoje
- **Slots de horário**: 08:00 – 17:30, intervalos de 30 minutos

```typescript
const AVAILABLE_DAYS = [1, 2, 3, 4, 5, 6]; // 0=Dom, 6=Sáb
const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];
const BOOKING_HORIZON_DAYS = 60;
```

### Calendário Visual

- Navegação por mês (anterior/próximo)
- Dias passados e domingos visualmente desativados (cinzento, não clicáveis)
- Dia selecionado destacado com cor dourada (`bg-gold text-black`)
- Hoje marcado com um ponto dourado subtil

---

## Submissão do Agendamento

### Opção A — Formspree (Email)

```typescript
const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;

const payload = {
  service: selectedService.name,
  date: format(selectedDate, 'dd/MM/yyyy'),
  time: selectedTime,
  name: personalDetails.name,
  phone: personalDetails.phone,
  email: personalDetails.email,
  notes: personalDetails.notes,
};

await fetch(FORMSPREE_ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  body: JSON.stringify(payload),
});
```

### Opção B — WhatsApp (Fallback / Alternativa)

Gera uma URL `wa.me` com mensagem pré-preenchida em português:

```typescript
const WHATSAPP_NUMBER = '258840218385';

const message = encodeURIComponent(
  `Olá Fashion Mito! Gostaria de agendar:\n\n` +
  `📋 Serviço: ${selectedService.name}\n` +
  `📅 Data: ${format(selectedDate, 'dd/MM/yyyy')}\n` +
  `🕐 Hora: ${selectedTime}\n` +
  `👤 Nome: ${personalDetails.name}\n` +
  `📞 Telefone: ${personalDetails.phone}\n` +
  `📧 Email: ${personalDetails.email}\n` +
  `📝 Notas: ${personalDetails.notes || 'Nenhuma'}`
);

window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
```

### Estratégia de Submissão

- Se `VITE_FORMSPREE_ENDPOINT` estiver configurado → submete via Formspree
- Se não estiver configurado → abre WhatsApp com mensagem pré-preenchida
- Em ambos os casos, o ecrã de confirmação é apresentado após ação bem-sucedida

---

## Design Visual

### Consistência com o Site

O componente segue rigorosamente o design system existente:

- **Paleta**: preto (`#000`), dourado (`#D4AF37`), branco, cinzentos
- **Tipografia**: Playfair Display (serif) para títulos, Inter (sans) para corpo
- **Bordas**: `border-gold/10` a `border-gold/50` conforme estado
- **Animações**: Framer Motion (`motion/react`) — fade-in, slide, scale
- **Padrão de fundo**: `.bg-atelier-pattern` (pontos dourados subtis)

### Modal

```
┌─────────────────────────────────────────────────────┐
│  [X]                    AGENDAR CONSULTA             │
│─────────────────────────────────────────────────────│
│  ① Serviço  ──  ② Data  ──  ③ Horário  ──  ④ Dados │
│─────────────────────────────────────────────────────│
│                                                     │
│              [Conteúdo do Passo Atual]              │
│                                                     │
│─────────────────────────────────────────────────────│
│  [← Anterior]                      [Próximo →]     │
└─────────────────────────────────────────────────────┘
```

### Indicadores de Passo

- Passo ativo: círculo dourado sólido com número
- Passo completo: círculo dourado com ✓
- Passo futuro: círculo cinzento com número
- Linha conectora entre passos

---

## Validação de Formulário

### Passo 4 — Dados Pessoais

| Campo | Validação |
|-------|-----------|
| Nome | Obrigatório, mínimo 2 caracteres |
| Telefone | Obrigatório, formato Moçambique (+258 ou 8x/9x) |
| Email | Opcional, formato válido se preenchido |
| Notas | Opcional, máximo 500 caracteres |

Validação em tempo real com mensagens de erro inline abaixo de cada campo.

---

## Acessibilidade

- Foco gerido entre passos (focus trap no modal)
- Atributos `aria-label`, `aria-current`, `aria-disabled` nos elementos interativos
- Navegação por teclado: Tab, Enter, Escape (fechar modal)
- Contraste de cor conforme WCAG AA
- `role="dialog"` e `aria-modal="true"` no overlay do modal

---

## Estrutura de Ficheiros

```
src/
├── components/
│   └── booking/
│       ├── BookingSystem.tsx       — componente raiz + modal wrapper
│       ├── BookingProgress.tsx     — barra de progresso multi-passo
│       ├── Step1_ServiceSelect.tsx — seleção de serviço
│       ├── Step2_DatePicker.tsx    — calendário
│       ├── Step3_TimePicker.tsx    — seleção de horário
│       ├── Step4_PersonalDetails.tsx — formulário de dados
│       ├── BookingConfirmation.tsx — ecrã de sucesso
│       └── bookingTypes.ts        — interfaces TypeScript
```

---

## Correctness Properties

*Uma propriedade é uma característica ou comportamento que deve ser verdadeiro em todas as execuções válidas do sistema — essencialmente, uma afirmação formal sobre o que o sistema deve fazer. As propriedades servem de ponte entre especificações legíveis por humanos e garantias de correção verificáveis automaticamente.*

### Property 1: Navegação sequencial é monotónica e limitada

*Para qualquer* passo atual válido no intervalo [1, 4], avançar deve incrementar `currentStep` em exatamente 1 (sem ultrapassar 4), e recuar deve decrementar em exatamente 1 (sem descer abaixo de 1).

**Validates: Requirements 1.2, 1.3**

### Property 2: Datas passadas e domingos são sempre inválidos

*Para qualquer* data gerada aleatoriamente que seja anterior a hoje ou que caia num domingo (dayOfWeek === 0), a função `isDateAvailable` deve retornar `false`.

**Validates: Requirements 3.2, 3.3**

### Property 3: Datas futuras dentro do horizonte e em dias úteis são válidas

*Para qualquer* data gerada aleatoriamente que seja posterior a hoje, dentro dos próximos 60 dias, e que não caia num domingo, a função `isDateAvailable` deve retornar `true`.

**Validates: Requirements 3.4, 3.5**

### Property 4: Slots de horário excluem sempre o intervalo de almoço

*Para qualquer* slot na lista gerada por `getTimeSlots`, o horário não deve estar no intervalo [12:30, 14:00[.

**Validates: Requirements 4.2**

### Property 5: Validação de telefone aceita e rejeita corretamente

*Para qualquer* string que corresponda ao padrão moçambicano (+258/258/8x/9x seguido de 8 dígitos), `validatePhone` deve retornar `true`; para qualquer string que não corresponda, deve retornar `false`.

**Validates: Requirements 5.3**

### Property 6: Validação de nome rejeita strings curtas

*Para qualquer* string com menos de 2 caracteres (incluindo strings vazias e de 1 caractere), `validateName` deve retornar `false`; para qualquer string com 2 ou mais caracteres, deve retornar `true`.

**Validates: Requirements 5.2**

### Property 7: Payload Formspree contém todos os campos do agendamento

*Para qualquer* agendamento completo (serviço, data, hora, dados pessoais), o objeto payload gerado para Formspree deve conter os campos: `service`, `date`, `time`, `name`, `phone`, `email`, `notes`.

**Validates: Requirements 6.2**

### Property 8: Mensagem WhatsApp contém todos os dados do agendamento

*Para qualquer* agendamento completo (serviço, data, hora, dados pessoais), a mensagem WhatsApp gerada deve conter o nome do serviço, a data formatada (dd/MM/yyyy), a hora, o nome do cliente e o telefone.

**Validates: Requirements 7.2, 7.3**

### Property 9: Submissão bloqueada com campos obrigatórios inválidos

*Para qualquer* estado de agendamento onde pelo menos um dos campos obrigatórios (serviço, data, hora, nome, telefone) esteja ausente ou inválido, a função `isBookingSubmittable` deve retornar `false`.

**Validates: Requirements 5.7**

### Property 10: Cada serviço contém todos os campos obrigatórios

*Para qualquer* serviço na lista `SERVICES`, o objeto deve conter os campos: `id`, `name`, `description`, `duration`, e `icon`.

**Validates: Requirements 2.4**
