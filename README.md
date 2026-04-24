<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/c196634a-42c3-4634-8df1-058758cd8272

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Sistema de Agendamento

O site inclui um sistema de agendamento multi-passo acessível pelos botões "Agendar Agora" (Hero) e "Agendar Medida" (Navbar).

### Configurar envio por email (Formspree)

1. Cria uma conta em [formspree.io](https://formspree.io)
2. Cria um novo formulário e copia o endpoint (ex: `https://formspree.io/f/xabcdefg`)
3. Cria um ficheiro `.env.local` na raiz do projeto e adiciona:

```
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/xabcdefg
```

Se `VITE_FORMSPREE_ENDPOINT` não estiver configurado, o sistema usa automaticamente o **WhatsApp** como alternativa — abre uma mensagem pré-preenchida com todos os dados do agendamento para o número +258 84 021 8385.
