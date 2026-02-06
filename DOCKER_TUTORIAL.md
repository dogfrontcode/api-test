# 🐳 Tutorial Docker para Iniciantes

Guia completo para rodar este projeto usando Docker pela primeira vez.

## 📋 O que é Docker?

Docker é uma plataforma que permite rodar aplicações em "containers" - ambientes isolados que contêm tudo que a aplicação precisa para funcionar (código, bibliotecas, dependências). É como ter um "mini computador" só para sua aplicação.

**Vantagens**:
- ✅ Não precisa instalar Node.js, npm, ou outras dependências no seu computador
- ✅ Funciona igual em qualquer sistema operacional (Windows, Mac, Linux)
- ✅ Isolamento: não bagunça seu sistema
- ✅ Fácil de limpar: basta apagar os containers

## 1️⃣ Instalar Docker

### Para Mac

1. Acesse: https://www.docker.com/products/docker-desktop
2. Clique em **"Download for Mac"**
3. Escolha a versão:
   - **Mac com Intel**: Docker Desktop for Mac (Intel chip)
   - **Mac com M1/M2/M3**: Docker Desktop for Mac (Apple chip)
4. Abra o arquivo `.dmg` baixado
5. Arraste o ícone do Docker para a pasta **Applications**
6. Abra o Docker Desktop pela pasta Applications
7. Aguarde o Docker iniciar (vai aparecer um ícone de baleia na barra superior)

### Para Windows

1. Acesse: https://www.docker.com/products/docker-desktop
2. Clique em **"Download for Windows"**
3. Execute o instalador `Docker Desktop Installer.exe`
4. Siga o assistente de instalação
5. **Reinicie o computador** quando solicitado
6. Abra o Docker Desktop
7. Aguarde o Docker iniciar

### Para Linux (Ubuntu/Debian)

```bash
# Atualizar pacotes
sudo apt update

# Instalar Docker
sudo apt install docker.io docker-compose -y

# Adicionar seu usuário ao grupo docker (para não precisar de sudo)
sudo usermod -aG docker $USER

# Reiniciar sessão (logout e login novamente)
# Ou executar:
newgrp docker

# Verificar instalação
docker --version
docker-compose --version
```

## 2️⃣ Verificar se Docker está Funcionando

Abra o **Terminal** (Mac/Linux) ou **PowerShell/CMD** (Windows) e execute:

```bash
docker --version
```

**Saída esperada**:
```
Docker version 24.0.x, build xxxxx
```

Se aparecer a versão, está funcionando! ✅

Se der erro "comando não encontrado":
- **Mac/Windows**: Certifique-se que o Docker Desktop está rodando (ícone da baleia deve estar visível)
- **Linux**: Execute `sudo systemctl start docker`

## 3️⃣ Verificar Docker Compose

```bash
docker-compose --version
```

**Saída esperada**:
```
Docker Compose version v2.x.x
```

## 4️⃣ Rodar o Projeto com Docker

### Passo 1: Navegar até a pasta do projeto

```bash
cd /Users/tidos/Desktop/api-teste
```

### Passo 2: Verificar arquivos necessários

Certifique-se que os arquivos existem:

```bash
ls -la
```

Você deve ver:
- ✅ `Dockerfile`
- ✅ `docker-compose.yml`
- ✅ `package.json`
- ✅ `Makefile`

### Passo 3: Subir o projeto

Execute um dos comandos abaixo:

**Opção A - Usando Makefile (mais fácil)**:
```bash
make docker-up
```

**Opção B - Usando Docker Compose diretamente**:
```bash
docker-compose up --build -d
```

**Explicação dos parâmetros**:
- `--build`: Constrói a imagem Docker (primeira vez ou quando houver mudanças)
- `-d`: Roda em segundo plano (detached mode)

### Passo 4: Aguardar o build

Na primeira vez, vai demorar alguns minutos (3-5 min) porque o Docker precisa:
1. Baixar a imagem base do Node.js
2. Instalar todas as dependências do projeto
3. Compilar o código TypeScript

**Você verá mensagens como**:
```
[+] Building 120.5s (12/12) FINISHED
=> [internal] load .dockerignore
=> [internal] load build definition
=> [1/7] FROM docker.io/library/node:20-alpine
=> [2/7] WORKDIR /app
=> [3/7] COPY package*.json ./
=> [4/7] RUN npm ci
=> [5/7] COPY . .
=> [6/7] RUN npx prisma generate
=> exporting to image
```

### Passo 5: Verificar se está rodando

```bash
docker ps
```

**Saída esperada**:
```
CONTAINER ID   IMAGE               STATUS         PORTS                    NAMES
abc123def456   api-teste-api       Up 2 minutes   0.0.0.0:3000->3000/tcp   api-security-lab
```

Se você ver uma linha com `api-security-lab` e status `Up`, significa que está rodando! 🎉

## 5️⃣ Popular o Banco de Dados

Agora precisamos criar as tabelas e inserir os usuários de teste:

```bash
# Entrar no container
docker exec -it api-security-lab sh

# Dentro do container, rodar migrations
npx prisma migrate dev --name init

# Rodar seed (popular dados)
npm run prisma:seed

# Sair do container
exit
```

**OU use o comando direto (mais rápido)**:

```bash
# Migrations
docker exec -it api-security-lab npx prisma migrate dev --name init

# Seed
docker exec -it api-security-lab npm run prisma:seed
```

**Saída esperada do seed**:
```
🌱 Iniciando seed do banco de dados...
🗑️  Dados antigos removidos
✅ Admin criado: admin@example.com
✅ User criado: user@example.com
✅ Configurações de merchant criadas

📊 Resumo:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Admin:
  Email:    admin@example.com
  Password: admin123
  Role:     admin
  Balance:  R$ 1000.00

User:
  Email:    user@example.com
  Password: user123
  Role:     user
  Balance:  R$ 100.00
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Seed concluído com sucesso!
```

## 6️⃣ Testar se está funcionando

### Opção 1: Via navegador

Abra seu navegador e acesse:
```
http://localhost:3000
```

Você deve ver:
```json
{
  "message": "API Security Lab - Laboratório Educacional",
  "warning": "⚠️  Este laboratório contém vulnerabilidades propositais...",
  "endpoints": {
    "insecure": "/insecure/* - API vulnerável",
    "secure": "/secure/* - API protegida",
    "health": "/health - Health check"
  }
}
```

### Opção 2: Via curl (terminal)

```bash
# Health check
curl http://localhost:3000/health

# Login inseguro
curl -X POST http://localhost:3000/insecure/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Login seguro
curl -X POST http://localhost:3000/secure/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

Se você receber respostas JSON, está tudo funcionando! ✅

## 7️⃣ Ver Logs da Aplicação

Para ver o que está acontecendo dentro do container:

```bash
# Ver logs em tempo real
docker logs -f api-security-lab

# OU usando Makefile
make docker-logs
```

**Para parar de ver os logs**: Pressione `Ctrl+C`

Você verá logs como:
```
🚀 Server running on port 3000
📝 Environment: development
🔓 Insecure API: http://localhost:3000/insecure
🔒 Secure API: http://localhost:3000/secure
⚠️  WARNING: This lab contains intentional vulnerabilities...
```

## 8️⃣ Parar o Projeto

Quando quiser parar o projeto:

```bash
# Opção A - Usando Makefile
make docker-down

# Opção B - Usando Docker Compose
docker-compose down
```

Isso para e remove os containers (mas mantém os dados do banco).

**Para apagar TUDO (incluindo dados)**:
```bash
docker-compose down -v
```

O `-v` remove os volumes (onde o banco de dados está salvo).

## 9️⃣ Comandos Úteis

### Ver containers rodando
```bash
docker ps
```

### Ver TODOS os containers (incluindo parados)
```bash
docker ps -a
```

### Ver imagens Docker
```bash
docker images
```

### Entrar no container (útil para debug)
```bash
docker exec -it api-security-lab sh
```

Dentro do container você pode:
```bash
ls                    # Listar arquivos
npm run dev           # Rodar comandos npm
npx prisma studio     # Abrir Prisma Studio
exit                  # Sair
```

### Ver logs
```bash
# Últimas 100 linhas
docker logs api-security-lab --tail 100

# Tempo real
docker logs -f api-security-lab

# Com timestamps
docker logs -t api-security-lab
```

### Reiniciar container
```bash
docker restart api-security-lab
```

### Parar container
```bash
docker stop api-security-lab
```

### Iniciar container parado
```bash
docker start api-security-lab
```

### Remover container
```bash
docker rm api-security-lab
```

### Limpar tudo (containers, imagens, volumes)
```bash
docker system prune -a --volumes
```

⚠️ **CUIDADO**: Isso apaga TUDO do Docker, não só deste projeto!

## 🔄 Workflow Completo - Resumo

### Primeira vez:
```bash
cd /Users/tidos/Desktop/api-teste
make docker-up                                           # Subir container
docker exec -it api-security-lab npx prisma migrate dev  # Criar tabelas
docker exec -it api-security-lab npm run prisma:seed    # Popular dados
```

### Acessar:
- Navegador: http://localhost:3000
- Postman: Importe `postman/collection.json`

### Ver logs:
```bash
make docker-logs
```

### Parar:
```bash
make docker-down
```

### Próximas vezes (dados já populados):
```bash
make docker-up    # Subir
# Usar a API
make docker-down  # Parar
```

## ❓ Troubleshooting (Problemas Comuns)

### "docker: command not found"
**Solução**: Docker não está instalado ou não está no PATH
- Mac/Windows: Certifique-se que o Docker Desktop está rodando
- Linux: `sudo systemctl start docker`

### "Cannot connect to the Docker daemon"
**Solução**: Docker daemon não está rodando
- Mac/Windows: Abra o Docker Desktop
- Linux: `sudo systemctl start docker`

### "port is already allocated"
**Solução**: A porta 3000 já está em uso
```bash
# Ver o que está usando a porta 3000
lsof -i :3000

# Matar o processo (substitua PID pelo número que aparecer)
kill -9 PID

# OU mude a porta no docker-compose.yml:
ports:
  - "3001:3000"  # Usa porta 3001 externamente
```

### "Error response from daemon: pull access denied"
**Solução**: Problema de permissão
```bash
# Mac/Windows: Faça login no Docker Desktop
# Linux:
sudo usermod -aG docker $USER
newgrp docker
```

### Container não inicia / crash loop
```bash
# Ver logs do erro
docker logs api-security-lab

# Entrar no container em modo debug
docker run -it api-teste-api sh
```

### Build muito lento
**Solução**: Normal na primeira vez. Próximas vezes serão mais rápidas por causa do cache.

### Mudei código mas não atualiza
**Solução**: Rebuildar a imagem
```bash
docker-compose up --build -d
```

## 📚 Conceitos Importantes

### Container vs Imagem
- **Imagem**: É o "molde" (receita de bolo)
- **Container**: É a aplicação rodando (o bolo pronto)

### Volume
- Local onde dados persistem mesmo quando o container é deletado
- O banco SQLite fica em um volume

### Port Mapping
- `3000:3000` significa: Porta 3000 do seu computador → Porta 3000 do container
- Você acessa `localhost:3000` e chega no container

### docker-compose.yml
- Arquivo que define como subir múltiplos containers
- Neste projeto: apenas 1 container (a API)

## 🎯 Próximos Passos

Agora que o Docker está rodando:

1. ✅ Importe a collection Postman (`postman/collection.json`)
2. ✅ Teste as APIs Insecure e Secure
3. ✅ Compare os comportamentos
4. ✅ Rode os testes: `docker exec -it api-security-lab npm test`
5. ✅ Explore o código para entender as vulnerabilidades

## 📞 Precisa de Ajuda?

Se algo não funcionar:

1. Verifique se o Docker Desktop está rodando (ícone da baleia)
2. Veja os logs: `docker logs api-security-lab`
3. Tente rebuildar: `docker-compose up --build -d`
4. Em último caso, limpe tudo e comece de novo:
   ```bash
   docker-compose down -v
   docker system prune -a
   make docker-up
   ```

---

**Parabéns! 🎉 Você agora sabe usar Docker!**

O Docker é uma ferramenta poderosa que você usará muito como desenvolvedor. Este projeto é uma ótima forma de praticar.

