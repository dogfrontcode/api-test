# 🚀 Como Usar Este Projeto - Passo a Passo Visual

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   🎯 API SECURITY LAB - LABORATÓRIO DE SEGURANÇA           │
│                                                             │
│   Compare APIs vulneráveis vs seguras                      │
│   Aprenda sobre vulnerabilidades reais                     │
│   100% educacional e prático                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📖 PRIMEIRA VEZ? Escolha seu caminho:

```
┌──────────────────────────────┐      ┌──────────────────────────────┐
│                              │      │                              │
│  😊 INICIANTE EM DOCKER      │      │  👨‍💻 JÁ CONHEÇO DOCKER        │
│                              │      │                              │
│  Leia primeiro:              │      │  Execute direto:             │
│  📘 DOCKER_TUTORIAL.md       │      │  ⚡ ./start.sh               │
│                              │      │  ⚡ make setup-docker         │
│  É um tutorial completo      │      │                              │
│  desde a instalação!         │      │  Vai rodar automaticamente!  │
│                              │      │                              │
└──────────────────────────────┘      └──────────────────────────────┘
```

---

## 🎬 Passo a Passo Completo

### PASSO 1: Instalar Docker

```
┌─────────────────────────────────────────────────┐
│ 🐳 BAIXAR DOCKER                                │
│                                                 │
│ https://www.docker.com/products/docker-desktop │
│                                                 │
│ • Mac: Clique "Download for Mac"               │
│ • Windows: Clique "Download for Windows"       │
│ • Linux: sudo apt install docker.io            │
│                                                 │
│ Instale e abra o Docker Desktop!               │
└─────────────────────────────────────────────────┘
```

### PASSO 2: Abrir Terminal

```
┌──────────────────────────────────────────┐
│ 💻 ABRIR TERMINAL                        │
│                                          │
│ Mac:     Cmd+Espaço → Terminal          │
│ Windows: Win+R → cmd → Enter            │
│ Linux:   Ctrl+Alt+T                     │
└──────────────────────────────────────────┘
```

### PASSO 3: Navegar até o projeto

```bash
cd /Users/tidos/Desktop/api-teste
```

### PASSO 4: Executar o script mágico ✨

```bash
./start.sh
```

**O que esse script faz?**
```
📦 1. Verifica se Docker está instalado
🐳 2. Verifica se Docker está rodando
🏗️  3. Sobe os containers
⏳ 4. Aguarda inicializar
🗄️  5. Cria o banco de dados
🌱 6. Popula os dados de teste
✅ 7. Testa se está funcionando
📊 8. Mostra todas as informações
```

---

## 🎯 Depois de Rodar

### Acesse a API

```
┌────────────────────────────────────────────────┐
│ 🌐 ABRA NO NAVEGADOR                           │
│                                                │
│ http://localhost:3000                          │
│                                                │
│ Se aparecer JSON, está funcionando! ✅         │
└────────────────────────────────────────────────┘
```

### Use o Postman

```
┌────────────────────────────────────────────────┐
│ 📮 POSTMAN                                     │
│                                                │
│ 1. Abra o Postman                              │
│ 2. Clique "Import"                             │
│ 3. Selecione: postman/collection.json          │
│ 4. Execute "Secure API > Auth > Login (Admin)" │
│ 5. Explore as outras requests!                 │
└────────────────────────────────────────────────┘
```

### Teste com curl

```bash
# Login Vulnerável (Insecure)
curl -X POST http://localhost:3000/insecure/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Login Seguro (Secure)
curl -X POST http://localhost:3000/secure/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

---

## 👥 Credenciais de Teste

```
╔═══════════════════════════════════════════════╗
║  ADMIN                                        ║
║  Email:    admin@example.com                  ║
║  Senha:    admin123                           ║
║  Role:     admin                              ║
║  Saldo:    R$ 1000,00                         ║
╠═══════════════════════════════════════════════╣
║  USER                                         ║
║  Email:    user@example.com                   ║
║  Senha:    user123                            ║
║  Role:     user                               ║
║  Saldo:    R$ 100,00                          ║
╚═══════════════════════════════════════════════╝
```

---

## 🔍 Comandos Úteis

### Ver logs em tempo real
```bash
make docker-logs
```
ou
```bash
docker logs -f api-security-lab
```
*Pressione Ctrl+C para sair*

### Parar o projeto
```bash
make docker-down
```
ou
```bash
docker-compose down
```

### Ver se está rodando
```bash
docker ps
```

### Recomeçar do zero
```bash
make clean
./start.sh
```

---

## 📚 Documentação por Tipo

```
┌──────────────────────┬────────────────────────────────────┐
│ DOCUMENTO            │ PARA QUÊ SERVE                     │
├──────────────────────┼────────────────────────────────────┤
│ INICIO_AQUI.md       │ 🎯 Página de entrada               │
│ QUICKSTART.md        │ ⚡ Começar em 5 minutos            │
│ DOCKER_TUTORIAL.md   │ 📘 Tutorial completo Docker        │
│ COMANDOS_DOCKER.md   │ 📋 Referência rápida comandos      │
│ README.md            │ 📖 Documentação completa           │
│ COMO_USAR.md         │ 🚀 Este arquivo (guia visual)      │
└──────────────────────┴────────────────────────────────────┘
```

---

## 🐛 Vulnerabilidades vs Correções

### API Insecure (/insecure)

```
❌ Sem validação de input
❌ Cookie sem flags de segurança
❌ IDOR (ver qualquer usuário)
❌ Sem RBAC (qualquer um faz tudo)
❌ BOLA (manipular saldo de outros)
❌ Mass Assignment
❌ SSRF (aceita qualquer URL)
❌ Sem rate limiting
```

### API Secure (/secure)

```
✅ Validação Zod em tudo
✅ JWT com expiração (15min)
✅ Ownership checks
✅ RBAC completo
✅ Proteção contra BOLA
✅ Validação de campos
✅ HTTPS obrigatório + allowlist
✅ Rate limiting (5-60 req/min)
✅ Step-up auth para operações sensíveis
✅ Audit logging completo
```

---

## 🧪 Comparar Comportamentos

### Exemplo 1: Criar Usuário

**Insecure** (vulnerável):
```bash
# Qualquer um pode criar admin!
curl -X POST http://localhost:3000/insecure/users \
  -H "Content-Type: application/json" \
  -d '{"email":"hacker@test.com","password":"123","role":"admin"}'
# ✅ Status 201 - Criado!
```

**Secure** (protegido):
```bash
# Precisa ser admin autenticado
curl -X POST http://localhost:3000/secure/users \
  -H "Content-Type: application/json" \
  -d '{"email":"blocked@test.com","password":"123"}'
# ❌ Status 401 - Unauthorized
```

### Exemplo 2: Ver Saldo

**Insecure** (vulnerável):
```bash
# Pode ver saldo de qualquer um via query param!
curl "http://localhost:3000/insecure/balance/me?userId=1"
# ✅ Retorna saldo do usuário 1
```

**Secure** (protegido):
```bash
# Só vê próprio saldo (do token JWT)
curl http://localhost:3000/secure/balance/me \
  -H "Authorization: Bearer {token}"
# ✅ Retorna apenas SEU saldo
```

---

## 🎓 Aprenda na Prática

1. **Execute um endpoint insecure**
2. **Execute o mesmo endpoint secure**
3. **Compare os resultados**
4. **Leia o código fonte**
5. **Entenda as diferenças**

### Exemplo de Estudo

```
1️⃣ Tente criar um usuário sem autenticação:
   • /insecure/users → Funciona! (vulnerável)
   • /secure/users → Bloqueado! (protegido)

2️⃣ Veja o código:
   • src/insecure/controllers/UsersController.ts
   • src/secure/controllers/UsersController.ts

3️⃣ Compare:
   • Insecure: Sem middleware de auth
   • Secure: Com authMiddleware + RBAC

4️⃣ Entenda:
   • Por que insecure é vulnerável?
   • Como secure previne?
   • Que proteções foram adicionadas?
```

---

## 🎯 Workflow Recomendado

```
┌─────────────────────────────────────────────────┐
│ DIA 1: Configuração                             │
│ • Instalar Docker                               │
│ • Rodar ./start.sh                              │
│ • Importar Postman                              │
│ • Testar se funciona                            │
└─────────────────────────────────────────────────┘
                     ⬇️
┌─────────────────────────────────────────────────┐
│ DIA 2: Explorar Insecure                        │
│ • Testar endpoints /insecure                    │
│ • Explorar vulnerabilidades                     │
│ • Ler código insecure                           │
│ • Entender o que está errado                    │
└─────────────────────────────────────────────────┘
                     ⬇️
┌─────────────────────────────────────────────────┐
│ DIA 3: Explorar Secure                          │
│ • Testar endpoints /secure                      │
│ • Ver bloqueios funcionando                     │
│ • Ler código secure                             │
│ • Entender as correções                         │
└─────────────────────────────────────────────────┘
                     ⬇️
┌─────────────────────────────────────────────────┐
│ DIA 4: Comparar e Aprender                      │
│ • Rodar testes (make test)                      │
│ • Comparar lado a lado                          │
│ • Documentar aprendizados                       │
│ • Aplicar em seus projetos!                     │
└─────────────────────────────────────────────────┘
```

---

## ❓ Problemas Comuns

```
┌──────────────────────────────────────────────────┐
│ PROBLEMA: "docker: command not found"           │
│ SOLUÇÃO: Instalar Docker Desktop                │
│ Link: https://www.docker.com/products/docker-.. │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ PROBLEMA: "Cannot connect to Docker daemon"     │
│ SOLUÇÃO: Abrir Docker Desktop (ícone da baleia) │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ PROBLEMA: "Port 3000 already in use"            │
│ SOLUÇÃO: lsof -i :3000  → kill -9 <PID>        │
└──────────────────────────────────────────────────┘
```

Para mais problemas: **DOCKER_TUTORIAL.md** → seção "Troubleshooting"

---

## 🎉 Pronto para Começar!

```
     ╔═══════════════════════════════════════╗
     ║                                       ║
     ║   Execute agora:                      ║
     ║                                       ║
     ║   ./start.sh                          ║
     ║                                       ║
     ║   E comece a aprender! 🚀             ║
     ║                                       ║
     ╚═══════════════════════════════════════╝
```

**Dúvidas?** Leia os outros documentos ou abra uma issue no repositório!

**Divirta-se aprendendo sobre segurança de APIs!** 🔒🎓

