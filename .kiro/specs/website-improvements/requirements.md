# Documento de Requisitos

## Introdução

Este documento descreve as melhorias a implementar no site **Fashion Mito**, uma alfaiataria de luxo localizada em Maputo, Moçambique. O site é construído em React 19, TypeScript, Tailwind CSS v4 e Framer Motion. As melhorias abrangem quatro áreas principais: SEO & HTML semântico, performance de carregamento, conteúdo e funcionalidades interactivas.

---

## Glossário

- **Site**: A aplicação web Fashion Mito em React/TypeScript
- **Navbar**: Barra de navegação fixa no topo da página
- **Hero**: Secção de destaque inicial com imagem de fundo e chamada à acção
- **Galeria**: Secção de portfólio com imagens de trabalhos realizados
- **Formulário**: Formulário de contacto na secção "Entre em Contacto"
- **Mapa**: Componente de localização geográfica na secção de contacto
- **SEO**: Search Engine Optimisation — conjunto de técnicas para melhorar a visibilidade em motores de busca
- **Meta Tags**: Etiquetas HTML no `<head>` que fornecem metadados à página
- **Open Graph**: Protocolo de metadados para partilha em redes sociais
- **Lazy Loading**: Técnica de carregamento diferido de recursos (imagens) apenas quando visíveis
- **Active Link**: Indicador visual no navbar que assinala a secção actualmente visível
- **Preço**: Tabela ou lista de valores indicativos dos serviços oferecidos
- **WhatsApp_Button**: Botão flutuante de acesso rápido ao WhatsApp

---

## Requisitos

### Requisito 1: SEO e Metadados HTML

**User Story:** Como proprietário do negócio, quero que o site apareça correctamente nos resultados de pesquisa e nas partilhas em redes sociais, para que potenciais clientes encontrem e reconheçam a Fashion Mito online.

#### Critérios de Aceitação

1. THE Site SHALL definir o atributo `lang` do elemento `<html>` como `"pt"`.
2. THE Site SHALL definir o `<title>` da página como `"Fashion Mito | Alfaiataria Bespoke em Maputo, Moçambique"`.
3. THE Site SHALL incluir uma `<meta name="description">` com conteúdo descritivo entre 150 e 160 caracteres sobre os serviços da Fashion Mito.
4. THE Site SHALL incluir as meta tags Open Graph: `og:title`, `og:description`, `og:type`, `og:url` e `og:image`.
5. THE Site SHALL incluir as meta tags Twitter Card: `twitter:card`, `twitter:title` e `twitter:description`.
6. THE Site SHALL incluir uma meta tag `<meta name="robots" content="index, follow">`.
7. THE Site SHALL incluir um `<link rel="canonical">` apontando para o URL canónico do site.
8. THE Site SHALL incluir um `<link rel="icon">` referenciando um favicon representativo da marca.
9. THE Site SHALL incluir as meta tags de geolocalização `geo.region`, `geo.placename` e `geo.position` com os valores correspondentes a Maputo, Moçambique.

---

### Requisito 2: Performance de Carregamento de Imagens

**User Story:** Como visitante do site, quero que as páginas carreguem rapidamente, para que a minha experiência de navegação seja fluida mesmo em ligações móveis lentas.

#### Critérios de Aceitação

1. WHEN uma imagem está fora da área visível do ecrã, THE Site SHALL aplicar o atributo `loading="lazy"` a essa imagem.
2. THE Site SHALL aplicar `loading="eager"` à imagem principal da secção Hero, por ser a primeira imagem visível.
3. THE Site SHALL aplicar o atributo `decoding="async"` a todas as imagens que não sejam críticas para o primeiro render.
4. THE Site SHALL definir atributos `width` e `height` explícitos em todas as imagens para evitar layout shift (CLS).
5. WHEN uma imagem do Unsplash é carregada, THE Site SHALL incluir o parâmetro `&w=` adequado ao tamanho de exibição para evitar transferência de imagens sobredimensionadas.

---

### Requisito 3: Indicador de Secção Activa no Navbar

**User Story:** Como visitante do site, quero saber em que secção me encontro enquanto navego, para que a minha orientação na página seja intuitiva.

#### Critérios de Aceitação

1. WHEN o utilizador faz scroll pela página, THE Navbar SHALL detectar qual a secção actualmente visível usando `IntersectionObserver`.
2. WHEN uma secção entra na área visível, THE Navbar SHALL aplicar um estilo visual distinto (cor dourada e/ou sublinhado) ao link correspondente.
3. WHEN o utilizador clica num link do Navbar, THE Navbar SHALL marcar esse link como activo imediatamente.
4. THE Navbar SHALL manter apenas um link activo de cada vez.
5. WHILE o utilizador está no topo da página (secção Hero), THE Navbar SHALL marcar o link "Início" como activo.

---

### Requisito 4: Galeria Expandida

**User Story:** Como visitante do site, quero ver mais exemplos de trabalhos realizados pela Fashion Mito, para que possa avaliar a qualidade e variedade dos serviços antes de contactar.

#### Critérios de Aceitação

1. THE Galeria SHALL exibir no mínimo 8 imagens de trabalhos realizados.
2. THE Galeria SHALL organizar as imagens num layout de grelha com variação de tamanhos (masonry ou grid assimétrico).
3. WHEN o utilizador clica numa imagem da galeria, THE Galeria SHALL abrir um lightbox com a imagem em tamanho ampliado.
4. WHEN o lightbox está aberto, THE Galeria SHALL permitir navegar para a imagem anterior e seguinte com botões ou teclas de seta.
5. WHEN o utilizador prime a tecla `Escape` ou clica fora da imagem, THE Galeria SHALL fechar o lightbox.
6. THE Galeria SHALL incluir uma legenda descritiva para cada imagem (ex: tipo de peça e material).

---

### Requisito 5: Formulário de Contacto Funcional

**User Story:** Como visitante interessado, quero enviar uma mensagem real à Fashion Mito através do formulário, para que possa solicitar informações ou agendar uma consulta sem sair do site.

#### Critérios de Aceitação

1. WHEN o utilizador submete o formulário com todos os campos válidos, THE Formulário SHALL enviar os dados para um serviço de e-mail externo (ex: EmailJS ou Formspree).
2. WHEN o envio é bem-sucedido, THE Formulário SHALL exibir uma mensagem de confirmação visível ao utilizador.
3. IF o envio falhar por erro de rede ou serviço, THEN THE Formulário SHALL exibir uma mensagem de erro com instrução alternativa (ex: contacto por WhatsApp).
4. THE Formulário SHALL incluir um campo de selecção de serviço de interesse (Fatos Sob Medida, Ajustes, Uniformes, Vestuário Tradicional).
5. THE Formulário SHALL incluir um campo de número de telefone opcional.
6. WHILE o envio está em curso, THE Formulário SHALL desactivar o botão de submissão e exibir um indicador de carregamento.
7. IF um campo obrigatório estiver vazio na submissão, THEN THE Formulário SHALL exibir uma mensagem de validação inline junto ao campo em falta.

---

### Requisito 6: Mapa de Localização Real

**User Story:** Como cliente que pretende visitar a loja, quero ver a localização exacta da Fashion Mito num mapa interactivo, para que possa planear a minha deslocação.

#### Critérios de Aceitação

1. THE Mapa SHALL exibir a localização da Fashion Mito em Maputo através de um iframe do Google Maps ou OpenStreetMap.
2. THE Mapa SHALL ter uma altura mínima de 256px e ocupar toda a largura disponível do contentor.
3. WHEN o utilizador interage com o Mapa (zoom, pan), THE Mapa SHALL responder às interacções sem interferir com o scroll da página.
4. THE Mapa SHALL incluir um link "Abrir no Google Maps" que abre a localização numa nova aba.

---

### Requisito 7: Secção de Preços Indicativos

**User Story:** Como potencial cliente, quero ter uma ideia dos preços praticados pela Fashion Mito, para que possa avaliar se os serviços se enquadram no meu orçamento antes de contactar.

#### Critérios de Aceitação

1. THE Site SHALL incluir uma secção dedicada a preços indicativos, posicionada entre as secções de Serviços e Galeria.
2. THE Site SHALL apresentar pelo menos 3 pacotes ou categorias de preço (ex: Básico, Premium, Bespoke).
3. WHEN o utilizador passa o cursor sobre um cartão de preço, THE Site SHALL aplicar uma animação de destaque ao cartão.
4. THE Site SHALL incluir uma nota de rodapé na secção de preços indicando que os valores são indicativos e sujeitos a consulta.
5. WHEN o utilizador clica no botão de acção de um pacote de preço, THE Site SHALL fazer scroll suave até à secção de contacto.

---

### Requisito 8: Conteúdo e Textos em Português Correcto

**User Story:** Como visitante moçambicano, quero que todo o conteúdo do site esteja em português correcto e culturalmente adequado, para que a comunicação seja clara e profissional.

#### Critérios de Aceitação

1. THE Site SHALL substituir todos os textos em inglês por equivalentes em português (ex: "Mon - Sat: 08:00 - 18:00" → "Seg - Sáb: 08:00 - 18:00").
2. THE Site SHALL apresentar o horário de funcionamento de forma consistente em português em todas as secções.
3. THE Site SHALL incluir na secção "Sobre" uma referência explícita à localização em Maputo, Moçambique.
4. THE Site SHALL actualizar os links de redes sociais no Footer e no Navbar para URLs reais das páginas da Fashion Mito (Instagram, Facebook).
5. THE WhatsApp_Button SHALL incluir uma mensagem pré-preenchida em português ao abrir o WhatsApp (ex: `?text=Olá, gostaria de saber mais sobre os vossos serviços`).

---

### Requisito 9: Acessibilidade e Semântica HTML

**User Story:** Como utilizador com necessidades especiais ou que usa tecnologias de apoio, quero que o site seja navegável e compreensível, para que possa aceder a toda a informação sem barreiras.

#### Critérios de Aceitação

1. THE Site SHALL incluir atributos `alt` descritivos em todas as imagens.
2. THE Site SHALL garantir que todos os elementos interactivos (botões, links) têm um `aria-label` quando o texto visível não é suficientemente descritivo.
3. THE Navbar SHALL incluir um atributo `aria-current="page"` no link activo.
4. THE Site SHALL garantir que a ordem de foco por teclado (`Tab`) segue a ordem visual da página.
5. THE Site SHALL garantir um rácio de contraste mínimo de 4.5:1 entre texto e fundo em todos os elementos de texto.
