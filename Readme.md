# Chatbot UI

Uma interface moderna de chatbot com comunicação WebSocket em tempo real, construída com Next.js, React e TypeScript.

## 🚀 Funcionalidades

- **Interface Dark Theme**: Design moderno e elegante com tema escuro
- **Comunicação WebSocket**: Troca de mensagens em tempo real
- **Reconexão Automática**: Reconecta automaticamente em caso de perda de conexão
- **Indicador de Status**: Mostra o status da conexão WebSocket
- **Histórico de Mensagens**: Mantém o histórico das conversas
- **Scroll Automático**: Rola automaticamente para novas mensagens
- **Interface Responsiva**: Funciona em desktop e mobile
- **Sidebar Navegável**: Gerenciamento de chats e workspaces

## 🛠️ Tecnologias

- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca de interface de usuário
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de estilos utilitários
- **WebSocket API** - Comunicação em tempo real
- **Lucide React** - Ícones modernos

## 📦 Instalação

1. Clone o repositório:
\`\`\`bash
git clone <url-do-repositorio>
cd chatbot-ui
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
# ou
yarn install
# ou
pnpm install
\`\`\`

3. Execute o projeto em modo de desenvolvimento:
\`\`\`bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
\`\`\`

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🔧 Configuração do WebSocket

Por padrão, o chatbot tenta se conectar ao WebSocket em `ws://localhost:8080`. Para alterar a URL de conexão, modifique a variável no hook `useWebSocket`:

\`\`\`typescript
// hooks/use-websocket.ts
const [socket, setSocket] = useState<WebSocket | null>(null);
const [isConnected, setIsConnected] = useState(false);

// Altere a URL aqui
const connectWebSocket = useCallback(() => {
  const ws = new WebSocket('ws://seu-servidor:porta');
  // ...
}, []);
\`\`\`

## 📡 Protocolo de Mensagens

O chatbot espera mensagens WebSocket no seguinte formato JSON:

### Mensagem do Cliente para Servidor:
\`\`\`json
{
  "type": "message",
  "content": "Sua mensagem aqui",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
\`\`\`

### Mensagem do Servidor para Cliente:
\`\`\`json
{
  "type": "message",
  "content": "Resposta do bot",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "sender": "bot"
}
\`\`\`

## 🏗️ Estrutura do Projeto

\`\`\`
chatbot-ui/
├── app/
│   ├── globals.css          # Estilos globais
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Página principal
├── components/
│   ├── ChatArea.tsx         # Área de chat e mensagens
│   ├── Header.tsx           # Cabeçalho com controles
│   └── Sidebar.tsx          # Barra lateral de navegação
├── hooks/
│   └── use-websocket.ts     # Hook personalizado para WebSocket
└── README.md
\`\`\`

## 🎯 Como Usar

1. **Conectar ao WebSocket**: Clique no botão "Connect" no header para estabelecer conexão
2. **Enviar Mensagens**: Digite sua mensagem no campo inferior e pressione Enter ou clique no botão enviar
3. **Monitorar Status**: O indicador no header mostra o status da conexão (Connected/Disconnected)
4. **Reconexão**: Em caso de perda de conexão, o sistema tenta reconectar automaticamente

## 🔧 Desenvolvimento

### Comandos Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter

### Personalização

#### Alterar Tema
Os estilos estão definidos em `app/globals.css` usando CSS custom properties. Você pode alterar as cores modificando as variáveis CSS:

\`\`\`css
:root {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2a2a2a;
  --text-primary: #ffffff;
  /* ... outras variáveis */
}
\`\`\`

#### Adicionar Funcionalidades
- **Novos tipos de mensagem**: Modifique o hook `useWebSocket` e o componente `ChatArea`
- **Persistência**: Adicione localStorage ou integração com banco de dados
- **Autenticação**: Implemente sistema de login/logout

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🐛 Problemas Conhecidos

- A reconexão automática pode falhar em alguns navegadores mais antigos
- O histórico de mensagens não é persistido entre sessões

## 📞 Suporte

Se você encontrar algum problema ou tiver sugestões, por favor abra uma issue no repositório.
