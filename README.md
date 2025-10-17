# Leitura Ativa - Aplicativo de Gerenciamento de Biblioteca

Aplicativo moderno para gerenciar sua biblioteca pessoal e acompanhar suas leituras.

## 🚀 Funcionalidades

- ✅ Autenticação de usuários (login/cadastro)
- ✅ Adicionar livros com informações completas
- ✅ Busca de livros online via AI
- ✅ Seleção de capas de livros via Google Custom Search
- ✅ Acompanhamento de progresso de leitura
- ✅ Edição de informações dos livros
- ✅ Estatísticas de leitura
- ✅ Tema claro/escuro
- ✅ Interface moderna e responsiva

## 🎨 Design

O aplicativo utiliza uma paleta de cores vibrante e moderna:

- **Primária**: Roxo vibrante (#635BFF) - `248 95% 68%`
- **Secundária**: Verde água (#00BFA6) - `174 100% 37%`
- **Acento**: Vermelho chamativo (#FF6B6B) - `0 84% 67%`
- **Tipografia**: Inter (16px base, 400-700 weights)
- **Bordas**: Arredondamento de 12px
- **Responsividade**: Mobile-first (360px+, 768px, 1280px)

## 🔧 Configuração

### Variáveis de Ambiente

Para habilitar a busca de capas via Google Custom Search API, configure as seguintes variáveis:

```env
VITE_GOOGLE_API_KEY=your_google_api_key_here
VITE_GOOGLE_CSE_ID=your_custom_search_engine_id_here
```

#### Como obter as credenciais:

1. **Google API Key**:
   - Acesse o [Google Cloud Console](https://console.cloud.google.com/)
   - Crie um novo projeto ou selecione um existente
   - Ative a API "Custom Search API"
   - Vá em "Credenciais" e crie uma chave de API

2. **Google CSE ID**:
   - Acesse o [Programmable Search Engine](https://programmablesearchengine.google.com/)
   - Crie um novo mecanismo de busca
   - Configure para buscar em toda a web
   - Ative "Busca de imagens" nas configurações
   - Copie o ID do mecanismo de busca

### Modo Fallback

Se as variáveis de ambiente não estiverem configuradas, o aplicativo funciona em modo fallback:
- Permite colar URLs de capas manualmente
- Exibe preview das capas inseridas
- Todas as outras funcionalidades continuam operando normalmente

## Project info

**URL**: https://lovable.dev/projects/444013a7-dacd-4c8d-bce9-d122e15c3fcf

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/444013a7-dacd-4c8d-bce9-d122e15c3fcf) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/444013a7-dacd-4c8d-bce9-d122e15c3fcf) and click on Share -> Publish.

## 🐛 Correções Implementadas

### 1. Autenticação
- ✅ Botão "Criar conta" totalmente funcional
- ✅ Validação de campos com mensagens amigáveis
- ✅ Estados de loading durante cadastro/login
- ✅ Tratamento de erros (email já cadastrado, senha fraca, etc.)
- ✅ Redirecionamento automático após sucesso

### 2. Formulário de Livros
- ✅ Campo "Nome do Livro" sem autocomplete do navegador
  - `autocomplete="off"`
  - `autocorrect="off"`
  - `autocapitalize="off"`
  - `spellcheck="false"`

### 3. Busca de Capas
- ✅ Modal de seleção de capas do Google
- ✅ Grid de thumbnails com seleção visual
- ✅ Preview da capa selecionada
- ✅ Fallback para URL manual quando API não configurada
- ✅ Lazy loading das imagens
- ✅ Tratamento de erros de carregamento

### 4. UI/UX Moderna
- ✅ Paleta de cores vibrante com alto contraste
- ✅ Tipografia Inter moderna
- ✅ Cards com sombras suaves e bordas arredondadas
- ✅ Botões com estados hover/focus
- ✅ Inputs com validação visual
- ✅ Logo no topo da tela de login
- ✅ Layout responsivo (mobile, tablet, desktop)
- ✅ Contraste WCAG AA compliant

## 🎯 Critérios de Aceitação

- [x] Criar conta funciona com validação completa
- [x] Nome do Livro sem sugestões do navegador
- [x] Modal de busca de capas do Google funcionando
- [x] Preview de capas implementado
- [x] Fallback para URL manual quando API não configurada
- [x] Adicionar livro funciona com e sem capa
- [x] Botão de editar nos cards dos livros
- [x] Interface moderna com cores vibrantes
- [x] Logo na tela de login
- [x] Responsividade em todos os breakpoints

## 📝 Notas

- As capas são armazenadas como URLs
- A API do Google tem limites de requisições gratuitas
- Para desativar a confirmação de email durante testes, acesse as configurações do Firebase Auth

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

---

Desenvolvido com ❤️ usando React, TypeScript, Firebase e Tailwind CSS
