# API Security Lab - Laborat��rio Educacional de Segurança

⚠️ **AVISO IMPORTANTE**: Este projeto contém vulnerabilidades intencionais para fins educacionais. **NUNCA** use o código vulnerável em produção ou exponha a API `/insecure` à internet.

## 📚 Sobre o Projeto

Este laboratório educacional demonstra vulnerabilidades comuns em APIs REST e suas correções, comparando duas implementações lado a lado:

- **`/insecure`** - API propositalmente vulnerável
- **`/secure`** - API com boas práticas de segurança

Ambas APIs têm os mesmos endpoints, mas comportamentos completamente diferentes em termos de segurança.

## 🏗️ Arquitetura

### Arquitetura em Camadas (OOP)

```
Cliente HTTP/Postman
        ↓
Express Router
        ↓
Controllers (HTTP Handling)
        ↓
Services (Lógica de Negócio)
        ↓
Repositories (Acesso a Dados)
        ↓
SQLite + Prisma
```

### Princípios SOLID Aplicados

- **Single Responsibility**: Cada classe tem uma responsabilidade única
- **Open/Closed**: Extensível via herança/interfaces
- **Liskov Substitution**: Interfaces garantem substituibilidade
- **Interface Segregation**: Interfaces específicas por domínio
- **Dependency Inversion**: Dependência de abstrações, não implementações

## 🛠️ Stack Tecnológica

- **Runtime**: Node.js 20+
- **Linguagem**: TypeScript (strict mode)
- **Framework**: Express.js
- **ORM**: Prisma
- **Banco de Dados**: SQLite
- **Autenticação**: JWT + bcrypt
- **Validação**: Zod
- **Segurança**: Helmet, express-rate-limit
- **Testes**: Jest + Supertest
- **Containerização**: Docker + Docker Compose

## 🚀 Como Rodar

### 🐳 Nunca usou Docker? Leia primeiro!
👉 **[DOCKER_TUTORIAL.md](DOCKER_TUTORIAL.md)** - Tutorial completo e didático para iniciantes

### ⚡ Quick Start (5 minutos)
👉 **[QUICKSTART.md](QUICKSTART.md)** - Guia rápido para começar agora

### 📋 Comandos Docker
👉 **[COMANDOS_DOCKER.md](COMANDOS_DOCKER.md)** - Referência rápida de comandos

---

### Opção 1: Script Automático (Mais Fácil!) 🎯

```bash
# Um comando faz tudo!
./start.sh
```

Este script:
- ✅ Verifica se Docker está instalado e rodando
- ✅ Sobe os containers
- ✅ Cria o banco de dados
- ✅ Popula os dados de teste
- ✅ Testa se está funcionando
- ✅ Mostra todas as informações necessárias

### Opção 2: Docker com Makefile

```bash
# Setup completo (um comando só)
make setup-docker

# OU passo a passo:
make docker-up                                           # Subir containers
docker exec -it api-security-lab npx prisma migrate dev  # Criar banco
docker exec -it api-security-lab npm run prisma:seed    # Popular dados
make docker-logs                                         # Ver logs
```

### Opção 3: Docker Compose Manual

```bash
docker-compose up --build -d
docker exec -it api-security-lab npx prisma migrate dev --name init
docker exec -it api-security-lab npm run prisma:seed
```

### Opção 4: Local (Sem Docker)

```bash
# Instalar dependências
make install

# Configurar banco de dados
make migrate

# Popular com dados iniciais
make seed

# Rodar em desenvolvimento
make dev
```

---

A API estará disponível em:
- **API Principal**: http://localhost:3000
- **Insecure**: http://localhost:3000/insecure
- **Secure**: http://localhost:3000/secure
- **Health Check**: http://localhost:3000/health

## 👥 Usuários de Teste

| Email | Senha | Role | Saldo |
|-------|-------|------|-------|
| admin@example.com | admin123 | admin | R$ 1000,00 |
| user@example.com | user123 | user | R$ 100,00 |

## 🐛 Vulnerabilidades na API Insecure

### 1. Autenticação Insegura

**Vulnerabilidade**:
- Cookie sem flags `HttpOnly`, `Secure`, `SameSite`
- Session ID simples sem validação forte
- Sem rate limiting

**CWE**: CWE-614, CWE-307

**Impacto**: XSS pode roubar cookies, brute force possível

### 2. IDOR (Insecure Direct Object Reference)

**Vulnerabilidade**:
```bash
GET /insecure/users/1  # Pode ver qualquer usuário
```

**CWE**: CWE-639

**Impacto**: Vazamento de dados sensíveis de outros usuários

### 3. Falta de RBAC (Role-Based Access Control)

**Vulnerabilidade**:
```bash
POST /insecure/users
{
  "email": "hacker@test.com",
  "password": "123",
  "role": "admin"  # ← Pode se tornar admin!
}
```

**CWE**: CWE-862

**Impacto**: Escalação de privilégios

### 4. BOLA (Broken Object Level Authorization)

**Vulnerabilidade**:
```bash
POST /insecure/balance/credit
{
  "userId": 2,  # ← Pode creditar em qualquer usuário!
  "amount": 999999
}

GET /insecure/balance/me?userId=1  # ← Query param vaza saldo
```

**CWE**: CWE-639

**Impacto**: Manipulação de saldo de outros usuários

### 5. Mass Assignment

**Vulnerabilidade**:
```bash
PATCH /insecure/users/1
{
  "role": "admin",  # ← Pode alterar qualquer campo
  "balance": 999999
}
```

**CWE**: CWE-915

**Impacto**: Alteração de campos sensíveis

### 6. SSRF (Server-Side Request Forgery)

**Vulnerabilidade**:
```bash
PATCH /insecure/merchant/callbackurl
{
  "callback_url": "http://localhost:8080/internal"  # ← SSRF!
}
```

**CWE**: CWE-918

**Impacto**: Acesso a recursos internos, exfiltração de dados

### 7. Falta de Validação de Input

**Vulnerabilidade**:
- Aceita emails inválidos
- Aceita senhas fracas
- Aceita URLs malformadas
- Sem sanitização de input

**CWE**: CWE-20

**Impacto**: Injeções, comportamento inesperado

## ✅ Correções na API Secure

### 1. Autenticação Segura

**Correção**:
- JWT com expiração curta (15 minutos)
- Refresh tokens armazenados no banco
- Rate limiting (5 req/min no login)
- Step-up authentication para operações sensíveis

**Exemplo**:
```bash
POST /secure/auth/login
{
  "email": "admin@example.com",
  "password": "admin123"
}

# Retorna:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "uuid...",
  "user": { "id": 1, "email": "...", "role": "admin" }
}
```

### 2. RBAC + Ownership

**Correção**:
- Middleware verifica role do usuário
- Middleware verifica ownership
- Apenas admin pode criar/listar/deletar usuários
- Usuário comum só pode ver/editar próprio perfil

**Exemplo**:
```bash
# Middleware stack
authMiddleware.authenticate()         # Valida JWT
→ RBACMiddleware.requireAdmin()       # Verifica role
  → controller.create()               # Executa ação
```

### 3. Validação de Input

**Correção**:
- Schemas Zod em todos os endpoints
- Validação de email, senha, URLs
- Sanitização de input

**Exemplo**:
```typescript
const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'user']).optional()
});
```

### 4. Validação de Callback URL

**Correção**:
- HTTPS obrigatório
- Allowlist de hosts permitidos
- Não aceita localhost/IPs internos
- Step-up authentication necessária
- Audit log completo

**Exemplo**:
```bash
# 1. Login
POST /secure/auth/login

# 2. Re-autenticar para step-up
POST /secure/auth/reauth
Authorization: Bearer {accessToken}
{
  "password": "admin123"
}
# Retorna: { "stepUpToken": "..." }

# 3. Atualizar callback URL
PATCH /secure/merchant/callbackurl
Authorization: Bearer {accessToken}
X-Step-Up-Token: {stepUpToken}
{
  "callback_url": "https://api.example.com/webhook"
}
```

### 5. Audit Logging

**Correção**:
- Todas operações sensíveis são logadas
- Logs incluem: userId, action, resource, details, IP, timestamp
- Tabelas: `AuditLog`, `RequestLog`

**Exemplo**:
```json
{
  "userId": 1,
  "action": "CALLBACK_CHANGE",
  "resource": "merchant",
  "details": "{\"oldUrl\":\"...\",\"newUrl\":\"...\"}",
  "ip": "192.168.1.1",
  "timestamp": "2026-02-06T10:30:00Z"
}
```

### 6. Rate Limiting

**Correção**:
- Login: 5 req/min
- Operações normais: 60 req/min
- Operações sensíveis: 10 req/min

### 7. Error Handling Seguro

**Correção**:
- Erros padronizados sem vazar stack traces
- Status codes corretos (401, 403, 422, etc)
- Mensagens genéricas em produção

## 📋 Exemplos de Uso (curl)

### Insecure API

```bash
# Login (vulnerável)
curl -X POST http://localhost:3000/insecure/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Criar usuário admin sem autenticação (vulnerável)
curl -X POST http://localhost:3000/insecure/users \
  -H "Content-Type: application/json" \
  -d '{"email":"hacker@test.com","password":"123","role":"admin"}'

# Ver qualquer usuário sem autenticação (IDOR)
curl http://localhost:3000/insecure/users/1

# Creditar saldo em qualquer usuário (BOLA)
curl -X POST http://localhost:3000/insecure/balance/credit \
  -H "Content-Type: application/json" \
  -d '{"userId":2,"amount":999999}'

# Ver saldo de qualquer usuário via query param (BOLA)
curl "http://localhost:3000/insecure/balance/me?userId=1"

# Callback URL vulnerável (SSRF)
curl -X PATCH http://localhost:3000/insecure/merchant/callbackurl \
  -H "Content-Type: application/json" \
  -d '{"callback_url":"http://localhost:8080/internal"}'
```

### Secure API

```bash
# 1. Login seguro
TOKEN=$(curl -X POST http://localhost:3000/secure/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  | jq -r '.accessToken')

# 2. Criar usuário (apenas admin)
curl -X POST http://localhost:3000/secure/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@test.com","password":"secure123"}'

# 3. Ver usuário (admin ou owner)
curl http://localhost:3000/secure/users/1 \
  -H "Authorization: Bearer $TOKEN"

# 4. Creditar saldo (apenas admin)
curl -X POST http://localhost:3000/secure/balance/credit \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId":2,"amount":100}'

# 5. Ver próprio saldo
curl http://localhost:3000/secure/balance/me \
  -H "Authorization: Bearer $TOKEN"

# 6. Callback URL seguro (com step-up)
# 6.1. Re-autenticar
STEP_UP=$(curl -X POST http://localhost:3000/secure/auth/reauth \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}' \
  | jq -r '.stepUpToken')

# 6.2. Atualizar callback URL
curl -X PATCH http://localhost:3000/secure/merchant/callbackurl \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Step-Up-Token: $STEP_UP" \
  -H "Content-Type: application/json" \
  -d '{"callback_url":"https://api.example.com/webhook"}'
```

## 🧪 Testes

```bash
# Rodar todos os testes
make test

# Testes unitários
make test-unit

# Testes de integração
make test-integration

# Testes em watch mode
npm run test:watch
```

### Cobertura de Testes

Os testes comparam o comportamento insecure vs secure:

✅ Autenticação sem/com validação  
✅ IDOR bloqueado vs permitido  
✅ RBAC aplicado vs ausente  
✅ BOLA bloqueado vs permitido  
✅ Validação de URL vs aceita qualquer  
✅ Rate limiting vs sem limite  

## 📮 Postman Collection

Importe o arquivo `postman/collection.json` no Postman.

A coleção inclui:
- ✅ Todas as rotas insecure e secure
- ✅ Variáveis de ambiente auto-populadas
- ✅ Scripts para capturar tokens automaticamente
- ✅ Exemplos de vulnerabilidades e correções

### Como Usar

1. Importe `postman/collection.json`
2. Configure `base_url` para `http://localhost:3000`
3. Execute "Secure API > Auth > Login (Admin)" primeiro
4. Tokens serão salvos automaticamente nas variáveis

## 📊 Observando Logs

Logs são salvos em `logs/`:

```bash
# Ver logs em tempo real
tail -f logs/combined.log

# Ver apenas erros
tail -f logs/error.log
```

### Logs de Segurança

**Tentativas negadas (401/403)**:
```json
{
  "level": "warn",
  "message": "Access denied",
  "userId": 2,
  "ip": "127.0.0.1",
  "reason": "Insufficient permissions",
  "timestamp": "2026-02-06T10:30:00Z"
}
```

**Audit logs no banco**:
```sql
SELECT * FROM AuditLog WHERE action = 'CALLBACK_CHANGE';
```

## 📁 Estrutura do Projeto

```
api-teste/
├── src/
│   ├── common/              # Código compartilhado
│   │   ├── config/          # Configurações
│   │   ├── interfaces/      # Interfaces TypeScript
│   │   ├── types/           # DTOs e tipos
│   │   ├── errors/          # Hierarquia de erros
│   │   ├── utils/           # Utilitários (Logger, etc)
│   │   └── repositories/    # Repositórios (camada de dados)
│   ├── services/            # Lógica de negócio
│   ├── insecure/            # API vulnerável
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── routes/
│   ├── secure/              # API segura
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── validators/
│   │   └── routes/
│   ├── app.ts               # Express app
│   └── server.ts            # Entry point
├── prisma/
│   ├── schema.prisma        # Schema do banco
│   └── seed.ts              # Dados iniciais
├── tests/
│   ├── unit/                # Testes unitários
│   └── integration/         # Testes de integração
├── postman/
│   └── collection.json      # Coleção Postman
├── Makefile                 # Comandos facilitados
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## 🎯 Casos de Uso Educacionais

### Para Estudantes

- Compare código vulnerável vs seguro lado a lado
- Execute testes para ver diferenças de comportamento
- Use Postman para testar manualmente
- Leia comentários no código explicando vulnerabilidades

### Para Professores

- Demonstre vulnerabilidades reais em aula
- Use como base para exercícios práticos
- Customize para adicionar mais vulnerabilidades
- Integre com currículo de segurança

### Para Profissionais

- Treinamento de equipes de desenvolvimento
- Code review educacional
- Demonstração de boas práticas
- Baseline para auditorias de segurança

## 📖 Recursos Adicionais

### CWEs Demonstradas

- **CWE-20**: Improper Input Validation
- **CWE-307**: Improper Restriction of Excessive Authentication Attempts
- **CWE-614**: Sensitive Cookie Without 'HttpOnly' Flag
- **CWE-639**: Authorization Bypass Through User-Controlled Key (IDOR)
- **CWE-862**: Missing Authorization
- **CWE-915**: Improperly Controlled Modification of Dynamically-Determined Object Attributes (Mass Assignment)
- **CWE-918**: Server-Side Request Forgery (SSRF)

### OWASP Top 10 API Security

Este lab cobre:
- **API1:2023** - Broken Object Level Authorization (BOLA)
- **API2:2023** - Broken Authentication
- **API3:2023** - Broken Object Property Level Authorization (Mass Assignment)
- **API5:2023** - Broken Function Level Authorization (RBAC)
- **API8:2023** - Security Misconfiguration
- **API10:2023** - Unsafe Consumption of APIs (SSRF)

## ⚙️ Comandos Makefile

```bash
make help              # Listar comandos disponíveis
make install           # Instalar dependências
make build             # Compilar TypeScript
make dev               # Modo desenvolvimento
make test              # Rodar testes
make docker-up         # Subir Docker
make docker-down       # Parar Docker
make docker-logs       # Ver logs
make seed              # Popular banco
make migrate           # Rodar migrations
make clean             # Limpar tudo
make setup             # Setup completo (install + migrate + seed)
```

## 🔒 Disclaimer de Segurança

⚠️ **ATENÇÃO**:

- Este projeto é **APENAS para fins educacionais**
- **NUNCA** use código da pasta `/insecure` em produção
- **NUNCA** exponha este lab à internet pública
- Use **APENAS em ambiente local controlado**
- Entenda que as vulnerabilidades são **intencionais**

## 📜 Licença

MIT License - Use para educação e aprendizado.

## 🤝 Contribuindo

Contribuições educacionais são bem-vindas! Sugestões:
- Adicionar mais vulnerabilidades
- Melhorar documentação
- Adicionar mais testes
- Traduzir para outros idiomas

## 📧 Suporte

Para dúvidas educacionais sobre o lab, abra uma issue no repositório.

---

**Desenvolvido com 🔒 para educação em segurança de APIs**

