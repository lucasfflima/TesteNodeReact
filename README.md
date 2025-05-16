# Aplicação de Integração com Spotify

Uma aplicação que integra com as APIs do Spotify para exibir perfis de usuários, playlists, principais artistas, e permitir a criação de playlists.

## Arquitetura

Este projeto segue uma arquitetura cliente-servidor:

- **Frontend**: Aplicação React com React Router para navegação
- **Backend**: Servidor Express.js atuando como proxy de autenticação para a API do Spotify
- **Autenticação**: Fluxo OAuth 2.0 com a API do Spotify

### Principais Tecnologias Utilizadas

#### Frontend
- React 19
- React Router v7
- Axios para requisições API
- CSS para estilização

#### Backend
- Express.js
- Node.js
- Jest para testes

## Instruções de Instalação

### Pré-requisitos
- Node.js (v18 ou posterior recomendado)
- npm ou yarn
- Conta de desenvolvedor Spotify com aplicativo registrado

### Configuração

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd teste-node-react
   ```

2. **Configuração do Backend**
   ```bash
   cd backend
   npm install
   ```

   Crie um arquivo `.env` no diretório backend com as seguintes variáveis:
   ```
   SPOTIFY_CLIENT_ID=seu_spotify_client_id
   SPOTIFY_CLIENT_SECRET=seu_spotify_client_secret
   SPOTIFY_REDIRECT_URI=seu_uri_de_redirecionamento
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   ```

3. **Configuração do Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Executando a Aplicação

1. **Inicie o Servidor Backend**
   ```bash
   cd backend
   npm start
   ```
   O servidor será executado na porta 3001 por padrão.

2. **Inicie o Servidor de Desenvolvimento Frontend**
   ```bash
   cd frontend
   npm start
   ```
   A aplicação React será executada na porta 3000 por padrão.

## Usando ngrok para HTTPS

A API do Spotify requer HTTPS para redirecionamentos OAuth em produção. Para desenvolvimento, você pode usar ngrok para criar um túnel seguro para seu servidor local.

### Por que usar ngrok?

- Cria um endpoint HTTPS seguro para seu servidor de desenvolvimento local
- Essencial para callbacks da API do Spotify, que exigem HTTPS
- Permite testar fluxos OAuth localmente sem necessidade de deploy

### Configuração do ngrok

1. **Instale o ngrok**
   Baixe em [ngrok.com](https://ngrok.com/download) ou instale usando npm:
   ```bash
   npm install ngrok -g
   ```

2. **Inicie seu servidor backend**
   ```bash
   cd backend
   npm start
   ```

3. **Crie um túnel com ngrok**
   Em um novo terminal:
   ```bash
   ngrok http 3001
   ```

4. **Atualize seu Painel de Desenvolvedor Spotify**
   - Copie a URL HTTPS fornecida pelo ngrok (ex: https://abc123def456.ngrok.io)
   - Acesse seu [Painel de Desenvolvedor Spotify](https://developer.spotify.com/dashboard)
   - Edite as configurações da sua aplicação
   - Adicione a URL do ngrok como URI de Redirecionamento: `https://abc123def456.ngrok.io/api/auth/callback`
   - Não se esqueça de registrar o usuário no dashboard da sua aplicação (UserManagement) na api do spotify

5. **Atualize seu arquivo .env do backend**
   ```
   SPOTIFY_REDIRECT_URI=https://abc123def456.ngrok.io/api/auth/callback
   ```

6. **Atualize as chamadas API do seu frontend**
   Certifique-se de que seu frontend esteja fazendo chamadas API para a URL do ngrok ao invés de localhost.

### Observações Importantes
- URLs do ngrok mudam cada vez que você reinicia o ngrok, a menos que tenha um plano pago
- Lembre-se de atualizar tanto o Painel do Spotify quanto seus arquivos .env quando a URL mudar

## Funcionalidades

- Autenticação de usuário com Spotify
- Exibição de informações do perfil do usuário
- Navegação pelas playlists do usuário
- Criação de novas playlists
- Visualização dos principais artistas com opções de filtro
- Exploração de detalhes e álbuns do artista

## Testes

### Testes do Backend
```bash
cd backend
npm test
```

### Testes do Frontend
```bash
cd frontend
npm test
```

## Scripts Disponíveis

No diretório do projeto, você pode executar:

### `npm start`

Executa o aplicativo no modo de desenvolvimento.\
Abra [http://localhost:3000](http://localhost:3000) para visualizá-lo em seu navegador.

A página será recarregada quando você fizer alterações.\
Você também poderá ver quaisquer erros de lint no console.

### `npm test`

Inicia o executor de teste no modo de observação interativo.\
Consulte a seção sobre [execução de testes](https://facebook.github.io/create-react-app/docs/running-tests) para mais informações.

### `npm run build`

Compila o aplicativo para produção na pasta `build`.\
Ele agrupa corretamente o React no modo de produção e otimiza a compilação para obter o melhor desempenho.

A compilação é minificada e os nomes dos arquivos incluem os hashes.\
Seu aplicativo está pronto para ser implantado!

## Licença

Este projeto está licenciado sob a Licença MIT.

