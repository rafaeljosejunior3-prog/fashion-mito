# Requirements Document — Sistema de Agendamento Fashion Mito

## Introduction

Sistema de agendamento multi-passo integrado no site estático da Fashion Mito, permitindo que clientes marquem consultas de alfaiataria sem necessidade de backend. Os agendamentos são submetidos via Formspree (email) ou WhatsApp com mensagem pré-preenchida.

---

## Glossary

- **Booking_System**: O componente React que gere o fluxo completo de agendamento
- **Step**: Um dos quatro passos sequenciais do fluxo (Serviço, Data, Horário, Dados)
- **Service**: Um dos quatro serviços de alfaiataria disponíveis para agendamento
- **Available_Date**: Data futura, dentro do horizonte de 60 dias, que não seja domingo nem passada
- **Time_Slot**: Intervalo de 30 minutos entre 08:00 e 17:30 (exceto pausa de almoço 12:30–14:00)
- **Personal_Details**: Dados do cliente (nome, telefone, email, notas)
- **Formspree**: Serviço externo de submissão de formulários via email
- **WhatsApp_Fallback**: Mecanismo alternativo de submissão via mensagem WhatsApp pré-preenchida

---

## Requirements

### Requirement 1: Navegação Multi-Passo

**User Story:** Como utilizador, quero navegar sequencialmente pelos passos do agendamento, para que possa preencher as informações de forma organizada.

#### Acceptance Criteria

1. WHEN o utilizador abre o sistema de agendamento, THE Booking_System SHALL apresentar o Passo 1 (Seleção de Serviço)
2. WHEN o utilizador completa um passo e clica "Próximo", THE Booking_System SHALL avançar para o passo seguinte
3. WHEN o utilizador clica "Anterior", THE Booking_System SHALL retroceder para o passo anterior
4. WHEN o utilizador está no Passo 1, THE Booking_System SHALL desativar o botão "Anterior"
5. WHEN o utilizador está no Passo 4, THE Booking_System SHALL substituir o botão "Próximo" por "Confirmar Agendamento"
6. THE Booking_System SHALL apresentar um indicador visual do passo atual e passos completos

---

### Requirement 2: Seleção de Serviço

**User Story:** Como utilizador, quero escolher o tipo de serviço de alfaiataria, para que possa agendar a consulta adequada às minhas necessidades.

#### Acceptance Criteria

1. THE Booking_System SHALL apresentar quatro serviços: Fatos Sob Medida, Ajustes de Roupa, Uniformes Corporativos, Vestuário Tradicional
2. WHEN o utilizador clica num serviço, THE Booking_System SHALL marcar esse serviço como selecionado visualmente
3. WHEN o utilizador seleciona um serviço, THE Booking_System SHALL ativar o botão "Próximo"
4. THE Booking_System SHALL apresentar para cada serviço: nome, descrição breve, duração estimada e ícone

---

### Requirement 3: Seleção de Data

**User Story:** Como utilizador, quero escolher uma data disponível num calendário visual, para que possa marcar a consulta num dia conveniente.

#### Acceptance Criteria

1. THE Booking_System SHALL apresentar um calendário mensal navegável
2. THE Booking_System SHALL bloquear visualmente datas passadas (não clicáveis, cinzentas)
3. THE Booking_System SHALL bloquear visualmente domingos (não clicáveis, cinzentas)
4. THE Booking_System SHALL permitir seleção apenas de datas futuras em dias úteis (segunda a sábado)
5. THE Booking_System SHALL limitar o horizonte de agendamento a 60 dias a partir de hoje
6. WHEN o utilizador clica numa data disponível, THE Booking_System SHALL marcar essa data como selecionada (fundo dourado)
7. THE Booking_System SHALL apresentar botões de navegação para mês anterior e próximo
8. THE Booking_System SHALL marcar o dia atual com um indicador visual subtil

---

### Requirement 4: Seleção de Horário

**User Story:** Como utilizador, quero escolher um horário disponível, para que possa marcar a consulta numa hora conveniente.

#### Acceptance Criteria

1. THE Booking_System SHALL apresentar slots de horário de 30 em 30 minutos entre 08:00 e 17:30
2. THE Booking_System SHALL excluir o intervalo de almoço (12:30 – 14:00) dos slots disponíveis
3. WHEN o utilizador clica num slot de horário, THE Booking_System SHALL marcar esse horário como selecionado
4. THE Booking_System SHALL apresentar os slots numa grelha responsiva (3–4 colunas)
5. THE Booking_System SHALL apresentar visualmente a duração do serviço selecionado acima da grelha de horários

---

### Requirement 5: Dados Pessoais e Validação

**User Story:** Como utilizador, quero preencher os meus dados pessoais, para que a Fashion Mito possa contactar-me sobre o agendamento.

#### Acceptance Criteria

1. THE Booking_System SHALL apresentar campos para: Nome, Telefone, Email, Notas
2. THE Booking_System SHALL validar que o campo Nome contém pelo menos 2 caracteres
3. THE Booking_System SHALL validar que o campo Telefone corresponde ao formato moçambicano (+258, 258, 8x ou 9x seguido de 8 dígitos)
4. WHEN o campo Email está preenchido, THE Booking_System SHALL validar que contém um formato de email válido
5. THE Booking_System SHALL permitir que o campo Notas seja opcional e limite a 500 caracteres
6. WHEN um campo é inválido, THE Booking_System SHALL apresentar uma mensagem de erro inline abaixo do campo
7. THE Booking_System SHALL desativar o botão "Confirmar Agendamento" enquanto existirem campos obrigatórios inválidos ou vazios

---

### Requirement 6: Submissão via Formspree

**User Story:** Como utilizador, quero que o meu agendamento seja enviado por email para a Fashion Mito, para que receba confirmação.

#### Acceptance Criteria

1. WHEN a variável de ambiente `VITE_FORMSPREE_ENDPOINT` está configurada, THE Booking_System SHALL submeter o agendamento via Formspree
2. THE Booking_System SHALL enviar os seguintes dados: serviço, data (formato dd/MM/yyyy), hora, nome, telefone, email, notas
3. WHEN a submissão é bem-sucedida (status 200), THE Booking_System SHALL apresentar o ecrã de confirmação
4. WHEN a submissão falha, THE Booking_System SHALL apresentar uma mensagem de erro e permitir nova tentativa
5. WHILE a submissão está em progresso, THE Booking_System SHALL desativar o botão de submissão e apresentar um indicador de carregamento

---

### Requirement 7: Submissão via WhatsApp (Fallback)

**User Story:** Como utilizador, quero poder agendar via WhatsApp caso o email não esteja disponível, para que tenha uma alternativa de contacto.

#### Acceptance Criteria

1. WHEN a variável de ambiente `VITE_FORMSPREE_ENDPOINT` não está configurada, THE Booking_System SHALL abrir o WhatsApp com mensagem pré-preenchida
2. THE Booking_System SHALL gerar uma mensagem em português contendo: serviço, data (dd/MM/yyyy), hora, nome, telefone, email, notas
3. THE Booking_System SHALL abrir a URL `wa.me/258840218385` com a mensagem codificada como parâmetro `text`
4. THE Booking_System SHALL abrir o WhatsApp numa nova janela/tab
5. WHEN o WhatsApp é aberto, THE Booking_System SHALL apresentar o ecrã de confirmação

---

### Requirement 8: Ecrã de Confirmação

**User Story:** Como utilizador, quero ver uma confirmação visual do meu agendamento, para que saiba que foi submetido com sucesso.

#### Acceptance Criteria

1. WHEN a submissão é bem-sucedida, THE Booking_System SHALL apresentar um ecrã de confirmação
2. THE Booking_System SHALL apresentar um resumo do agendamento: serviço, data, hora, nome
3. THE Booking_System SHALL apresentar uma mensagem de sucesso em português
4. THE Booking_System SHALL apresentar um botão "Fechar" que fecha o modal de agendamento
5. THE Booking_System SHALL apresentar um ícone de sucesso (checkmark) animado

---

### Requirement 9: Integração no Site Existente

**User Story:** Como utilizador, quero aceder ao sistema de agendamento a partir do site principal, para que possa marcar consultas facilmente.

#### Acceptance Criteria

1. WHEN o utilizador clica no botão "Agendar Agora" no Hero, THE Booking_System SHALL abrir como modal
2. WHEN o utilizador clica no botão "Agendar Medida" na Navbar, THE Booking_System SHALL abrir como modal
3. THE Booking_System SHALL apresentar-se como um overlay modal com fundo escurecido
4. WHEN o utilizador clica fora do modal ou pressiona Escape, THE Booking_System SHALL fechar
5. THE Booking_System SHALL apresentar um botão "X" no canto superior direito para fechar
6. WHEN o modal está aberto, THE Booking_System SHALL bloquear o scroll da página de fundo

---

### Requirement 10: Design Visual e Animações

**User Story:** Como utilizador, quero uma experiência visual consistente com o site Fashion Mito, para que o agendamento pareça integrado e profissional.

#### Acceptance Criteria

1. THE Booking_System SHALL utilizar a paleta de cores do site: preto (#000), dourado (#D4AF37), branco, cinzentos
2. THE Booking_System SHALL utilizar as fontes Playfair Display (títulos) e Inter (corpo)
3. THE Booking_System SHALL aplicar o padrão de fundo `.bg-atelier-pattern` onde apropriado
4. THE Booking_System SHALL animar transições entre passos com fade-in e slide (Framer Motion)
5. THE Booking_System SHALL animar a entrada do modal com scale e fade
6. THE Booking_System SHALL aplicar estados hover consistentes (bordas douradas, transições suaves)

---

### Requirement 11: Acessibilidade

**User Story:** Como utilizador com necessidades de acessibilidade, quero poder navegar e usar o sistema de agendamento com teclado e leitores de ecrã.

#### Acceptance Criteria

1. THE Booking_System SHALL aplicar `role="dialog"` e `aria-modal="true"` ao modal
2. THE Booking_System SHALL gerir o foco ao abrir o modal (focus trap)
3. THE Booking_System SHALL permitir fechar o modal com a tecla Escape
4. THE Booking_System SHALL aplicar `aria-label` a todos os botões e controlos interativos
5. THE Booking_System SHALL aplicar `aria-current="step"` ao indicador de passo atual
6. THE Booking_System SHALL aplicar `aria-disabled="true"` a datas e horários indisponíveis
7. THE Booking_System SHALL garantir contraste de cor conforme WCAG AA (mínimo 4.5:1 para texto)

---

### Requirement 12: Responsividade

**User Story:** Como utilizador móvel, quero usar o sistema de agendamento no meu telemóvel, para que possa agendar em qualquer dispositivo.

#### Acceptance Criteria

1. THE Booking_System SHALL adaptar o layout do modal para ecrãs pequenos (< 768px)
2. THE Booking_System SHALL apresentar a grelha de serviços em 1 coluna em mobile, 2 colunas em tablet, 4 em desktop
3. THE Booking_System SHALL apresentar o calendário com tamanho de célula adequado ao toque (mínimo 44x44px)
4. THE Booking_System SHALL apresentar a grelha de horários em 2 colunas em mobile, 3–4 em desktop
5. THE Booking_System SHALL ajustar o tamanho do modal para ocupar 95% da largura em mobile, máximo 800px em desktop
