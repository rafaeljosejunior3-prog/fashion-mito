# Plano de Implementação: Website Improvements — Fashion Mito

## Visão Geral

Implementação incremental das melhorias ao site Fashion Mito nos ficheiros `index.html`, `src/App.tsx` e `src/index.css`, usando React 19, TypeScript, Tailwind CSS v4 e Framer Motion (`motion/react`).

## Tarefas

- [x] 1. Configurar ambiente de testes
  - Instalar `fast-check` como devDependency: `npm install --save-dev fast-check`
  - Criar `vitest.config.ts` com `environment: 'jsdom'` e `globals: true`
  - Criar `src/test/setup.ts` com imports de `@testing-library/jest-dom`
  - _Requisitos: estratégia de testes (design)_

- [x] 2. SEO e metadados no `index.html`
  - [x] 2.1 Adicionar atributos e meta tags base ao `index.html`
    - Definir `lang="pt"` no elemento `<html>`
    - Definir `<title>Fashion Mito | Alfaiataria Bespoke em Maputo, Moçambique</title>`
    - Adicionar `<meta name="description">` com 150–160 caracteres
    - Adicionar `<meta name="robots" content="index, follow">`
    - Adicionar `<link rel="canonical">` e `<link rel="icon">`
    - _Requisitos: 1.1, 1.2, 1.3, 1.6, 1.7, 1.8_
  - [x] 2.2 Adicionar meta tags Open Graph, Twitter Card e geolocalização
    - Adicionar `og:title`, `og:description`, `og:type`, `og:url`, `og:image`
    - Adicionar `twitter:card`, `twitter:title`, `twitter:description`
    - Adicionar `geo.region`, `geo.placename`, `geo.position` com valores de Maputo
    - _Requisitos: 1.4, 1.5, 1.9_
  - [ ]* 2.3 Escrever testes de exemplo para SEO
    - Verificar `lang="pt"` e `<title>` correcto
    - Verificar presença de todas as meta tags OG e Twitter
    - _Requisitos: 1.1, 1.2, 1.4, 1.5_
  - [ ]* 2.4 Escrever teste de propriedade P1: comprimento da meta description
    - **Propriedade 1: Comprimento da meta description**
    - **Valida: Requisito 1.3**

- [x] 3. Performance de imagens em `src/App.tsx`
  - [x] 3.1 Actualizar atributos de todas as imagens
    - Imagem Hero: `loading="eager"`, `decoding="sync"`, `width="2000"`, `height="1333"`
    - Imagens About, Serviços e Galeria: `loading="lazy"`, `decoding="async"`, `width` e `height` explícitos
    - Ajustar parâmetro `&w=` nos URLs Unsplash ao tamanho de exibição real
    - _Requisitos: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [ ]* 3.2 Escrever teste de exemplo para imagem Hero
    - Verificar que a imagem Hero tem `loading="eager"`
    - _Requisito: 2.2_
  - [ ]* 3.3 Escrever teste de propriedade P2: atributos de imagens não-hero
    - **Propriedade 2: Atributos de performance em imagens não-hero**
    - **Valida: Requisitos 2.1, 2.3, 2.4**
  - [ ]* 3.4 Escrever teste de propriedade P3: parâmetro `w=` em URLs Unsplash
    - **Propriedade 3: Parâmetro de largura nos URLs Unsplash**
    - **Valida: Requisito 2.5**

- [x] 4. Checkpoint — Verificar que todos os testes passam até este ponto
  - Garantir que todos os testes passam; perguntar ao utilizador se surgirem dúvidas.

- [x] 5. Navbar com IntersectionObserver e secção activa
  - [x] 5.1 Implementar lógica de secção activa no componente Navbar
    - Adicionar estado `activeSection: string` inicializado com `'home'`
    - Criar `IntersectionObserver` com `threshold: 0.4` que observa todos os elementos com `id` de secção
    - Ao clicar num link, actualizar `activeSection` imediatamente
    - Garantir que apenas um link está activo de cada vez
    - _Requisitos: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [x] 5.2 Aplicar estilos e atributos de acessibilidade ao link activo
    - Aplicar classes `text-gold border-b border-gold` ao link activo
    - Adicionar `aria-current="page"` ao link activo; remover dos restantes
    - _Requisitos: 3.2, 9.3_
  - [ ]* 5.3 Escrever teste de propriedade P4: invariante do link activo
    - **Propriedade 4: Invariante do link activo no Navbar**
    - **Valida: Requisitos 3.2, 3.4, 9.3**

- [x] 6. Secção de Preços (`Pricing`) em `src/App.tsx`
  - [x] 6.1 Criar array de dados `pricingPlans` e componente/secção Pricing
    - Definir interface `PricingPlan` com `name`, `price`, `features`, `highlighted`
    - Criar array com 3 planos: Essencial (3.500 MT), Premium (7.000 MT, destacado), Bespoke (Sob Consulta)
    - Renderizar cartões com animação `whileHover={{ scale: 1.03 }}` via Framer Motion
    - Posicionar a secção entre `<Services />` e `<Gallery />` no JSX
    - _Requisitos: 7.1, 7.2, 7.3_
  - [x] 6.2 Adicionar nota de rodapé e botão CTA com scroll suave
    - Adicionar nota indicando que os valores são indicativos e sujeitos a consulta
    - Botão CTA de cada plano faz `scrollIntoView` para `#contact`
    - _Requisitos: 7.4, 7.5_
  - [ ]* 6.3 Escrever testes de exemplo para a secção de Preços
    - Verificar que a secção de preços está posicionada entre Serviços e Galeria no DOM
    - Verificar que `pricingPlans` tem comprimento >= 3
    - Verificar que a nota de rodapé contém texto sobre valores indicativos
    - _Requisitos: 7.1, 7.2, 7.4_

- [x] 7. Galeria expandida com Lightbox em `src/App.tsx`
  - [x] 7.1 Expandir array `galleryImages` para 8+ imagens com grid assimétrico
    - Definir interface `GalleryImage` com `src`, `alt`, `caption`, `span`
    - Criar array com 8+ imagens, cada uma com `alt` descritivo e `caption` não vazio
    - Aplicar layout `grid-cols-2 md:grid-cols-4` com `span` variável por imagem
    - _Requisitos: 4.1, 4.2, 4.6, 9.1_
  - [x] 7.2 Implementar componente Lightbox com navegação e fecho
    - Estado `lightbox: { isOpen: boolean; currentIndex: number }`
    - Clique numa imagem abre o lightbox com o índice correcto
    - Botões prev/next para navegação circular entre imagens
    - `useEffect` com `addEventListener('keydown')` para `ArrowLeft`, `ArrowRight` e `Escape`
    - Clique no overlay fora da imagem fecha o lightbox
    - Limpar event listener no cleanup do `useEffect`
    - _Requisitos: 4.3, 4.4, 4.5_
  - [ ]* 7.3 Escrever testes de exemplo para a Galeria e Lightbox
    - Verificar que clicar numa imagem abre o lightbox com o índice correcto
    - Verificar que premir Escape fecha o lightbox
    - _Requisitos: 4.3, 4.5_
  - [ ]* 7.4 Escrever teste de propriedade P5: navegação circular no Lightbox
    - **Propriedade 5: Navegação circular no Lightbox**
    - **Valida: Requisito 4.4**
  - [ ]* 7.5 Escrever teste de propriedade P6: legendas e alt não vazios
    - **Propriedade 6: Legendas não vazias na Galeria**
    - **Valida: Requisitos 4.6, 9.1**

- [x] 8. Checkpoint — Verificar que todos os testes passam até este ponto
  - Garantir que todos os testes passam; perguntar ao utilizador se surgirem dúvidas.

- [x] 9. Formulário de contacto via Formspree em `src/App.tsx`
  - [x] 9.1 Implementar estado e validação inline do formulário
    - Definir interfaces `FormData` e `FormStatus`
    - Estado: `formData`, `formStatus`, `fieldErrors`
    - Validação inline: campos obrigatórios (`name`, `email`, `message`, `service`) vazios → `fieldErrors` com mensagem junto ao campo (`<p role="alert">`)
    - Bloquear envio se existirem erros de validação
    - _Requisitos: 5.4, 5.5, 5.7_
  - [x] 9.2 Implementar envio via `fetch` nativo para Formspree
    - `fetch POST` para `https://formspree.io/f/{FORM_ID}` com `Content-Type: application/json`
    - Durante envio: `formStatus = 'submitting'`, botão desactivado com indicador de carregamento
    - Sucesso (200): `formStatus = 'success'`, limpar formulário, mostrar mensagem de confirmação
    - Erro (4xx/5xx ou rede): `formStatus = 'error'`, mostrar mensagem com sugestão de contacto por WhatsApp
    - _Requisitos: 5.1, 5.2, 5.3, 5.6_
  - [ ]* 9.3 Escrever testes de exemplo para o formulário
    - Verificar que submissão bem-sucedida mostra mensagem de confirmação
    - Verificar que submissão falhada mostra mensagem de erro
    - Verificar que o campo select de serviço tem 4 opções
    - _Requisitos: 5.2, 5.3, 5.4_
  - [ ]* 9.4 Escrever teste de propriedade P7: botão desactivado durante envio
    - **Propriedade 7: Estado do botão de submissão durante envio**
    - **Valida: Requisito 5.6**
  - [ ]* 9.5 Escrever teste de propriedade P8: validação inline de campos obrigatórios
    - **Propriedade 8: Validação inline de campos obrigatórios**
    - **Valida: Requisito 5.7**

- [x] 10. Mapa OpenStreetMap via iframe em `src/App.tsx`
  - [x] 10.1 Implementar componente `MapEmbed` com iframe OpenStreetMap
    - Construir URL do iframe com `bbox` e `marker` para Maputo (`-25.9653, 32.5732`)
    - Definir `height: min-h-64`, `width: 100%` no iframe
    - Adicionar fallback de texto "Av. 25 de Setembro, Maputo" visível se iframe falhar
    - Adicionar link "Abrir no Google Maps" com `target="_blank"` e `rel="noopener noreferrer"`
    - _Requisitos: 6.1, 6.2, 6.3, 6.4_
  - [ ]* 10.2 Escrever testes de exemplo para o Mapa
    - Verificar que o iframe tem `src` com `openstreetmap.org`
    - Verificar que o link "Abrir no Google Maps" tem `target="_blank"`
    - _Requisitos: 6.1, 6.4_

- [x] 11. Conteúdo em português e acessibilidade em `src/App.tsx`
  - [x] 11.1 Corrigir textos e conteúdo em português
    - Substituir horário em inglês por `"Seg - Sáb: 08:00 - 18:00"` em todas as ocorrências
    - Adicionar referência explícita a Maputo, Moçambique na secção About
    - Actualizar links de redes sociais para URLs reais da Fashion Mito (Instagram, Facebook)
    - Actualizar href do botão WhatsApp com `?text=Olá%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20vossos%20serviços`
    - _Requisitos: 8.1, 8.2, 8.3, 8.4, 8.5_
  - [x] 11.2 Garantir acessibilidade em todos os elementos interactivos
    - Verificar e completar atributos `alt` descritivos em todas as imagens (comprimento > 5 chars)
    - Adicionar `aria-label` a botões e links sem texto visível suficiente (texto < 3 chars)
    - Garantir que a ordem de foco Tab segue a ordem visual (sem `tabindex` positivo)
    - _Requisitos: 9.1, 9.2, 9.4_
  - [ ]* 11.3 Escrever testes de exemplo para conteúdo e acessibilidade
    - Verificar que a secção About contém "Maputo" e "Moçambique"
    - Verificar que links sociais não são `"#"`
    - Verificar que href do WhatsApp contém `?text=` com conteúdo em português
    - _Requisitos: 8.3, 8.4, 8.5_
  - [ ]* 11.4 Escrever teste de propriedade P9: ausência de inglês no horário
    - **Propriedade 9: Ausência de texto em inglês no horário**
    - **Valida: Requisito 8.1**
  - [ ]* 11.5 Escrever teste de propriedade P10: alt descritivo em todas as imagens
    - **Propriedade 10: Alt descritivo em todas as imagens**
    - **Valida: Requisito 9.1**
  - [ ]* 11.6 Escrever teste de propriedade P11: aria-label em elementos interactivos sem texto visível
    - **Propriedade 11: aria-label em elementos interactivos sem texto visível**
    - **Valida: Requisito 9.2**

- [x] 12. Checkpoint final — Garantir que todos os testes passam
  - Garantir que todos os testes passam; perguntar ao utilizador se surgirem dúvidas.

## Notas

- As tarefas marcadas com `*` são opcionais e podem ser ignoradas para um MVP mais rápido
- Cada tarefa referencia os requisitos específicos para rastreabilidade
- Os checkpoints garantem validação incremental ao longo da implementação
- Os testes de propriedade validam invariantes universais com fast-check (mínimo 100 iterações)
- Os testes unitários validam exemplos concretos e casos de erro
- Nenhuma dependência de runtime adicional é introduzida — apenas `fast-check` como devDependency
