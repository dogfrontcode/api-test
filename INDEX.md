# 📚 Índice Geral - API Security Lab

Bem-vindo ao laboratório de segurança de APIs! Escolha o documento que precisa:

## 🎯 Para Começar AGORA

| Documento | Descrição | Quando Usar |
|-----------|-----------|-------------|
| **[INICIO_AQUI.md](INICIO_AQUI.md)** | 🚀 Ponto de entrada principal | **COMECE AQUI!** |
| **[QUICKSTART.md](QUICKSTART.md)** | ⚡ Guia rápido (5 minutos) | Quer rodar rápido |
| **[start.sh](start.sh)** | 🤖 Script automático | Execute: `./start.sh` |

## 🐳 Documentação Docker

| Documento | Descrição | Quando Usar |
|-----------|-----------|-------------|
| **[DOCKER_TUTORIAL.md](DOCKER_TUTORIAL.md)** | 📘 Tutorial completo Docker | **Nunca usou Docker** |
| **[COMANDOS_DOCKER.md](COMANDOS_DOCKER.md)** | 📋 Referência rápida | Consulta de comandos |
| **[COMO_USAR.md](COMO_USAR.md)** | 🎨 Guia visual passo a passo | Quer algo visual |

## 📖 Documentação Completa

| Documento | Descrição | Quando Usar |
|-----------|-----------|-------------|
| **[README.md](README.md)** | 📚 Documentação completa | Quer todos os detalhes |
| **[INDEX.md](INDEX.md)** | 🗂️ Este arquivo | Navegar documentação |

## 📮 Recursos Adicionais

| Recurso | Localização | Descrição |
|---------|-------------|-----------|
| **Postman Collection** | `postman/collection.json` | Todas as requests prontas |
| **Prisma Schema** | `prisma/schema.prisma` | Estrutura do banco |
| **Makefile** | `Makefile` | Comandos facilitados |

---

## 🎓 Fluxo de Aprendizado Recomendado

```
1. INICIO_AQUI.md
   ↓
2. Execute: ./start.sh
   ↓
3. Importe: postman/collection.json
   ↓
4. Teste APIs /insecure e /secure
   ↓
5. Leia: README.md (vulnerabilidades)
   ↓
6. Explore código fonte
   ↓
7. Rode testes: make test
```

---

## 🗺️ Mapa de Conteúdo

### Para Iniciantes em Docker

1. **[DOCKER_TUTORIAL.md](DOCKER_TUTORIAL.md)** → Aprenda Docker do zero
2. **[INICIO_AQUI.md](INICIO_AQUI.md)** → Instale e configure
3. **[start.sh](start.sh)** → Execute o projeto
4. **[COMANDOS_DOCKER.md](COMANDOS_DOCKER.md)** → Referência rápida

### Para Quem Já Conhece Docker

1. **[QUICKSTART.md](QUICKSTART.md)** → Setup rápido
2. **[README.md](README.md)** → Entenda o projeto
3. **Postman** → Teste as APIs
4. **Código fonte** → Estude as diferenças

### Para Referência Rápida

1. **[COMANDOS_DOCKER.md](COMANDOS_DOCKER.md)** → Comandos essenciais
2. **[Makefile](Makefile)** → `make help`
3. **[COMO_USAR.md](COMO_USAR.md)** → Guia visual

---

## 📁 Estrutura de Arquivos

```
api-teste/
├── 📚 DOCUMENTAÇÃO
│   ├── INDEX.md                    ← Você está aqui!
│   ├── INICIO_AQUI.md             ← Comece aqui
│   ├── QUICKSTART.md              ← 5 minutos
│   ├── DOCKER_TUTORIAL.md         ← Tutorial Docker
│   ├── COMANDOS_DOCKER.md         ← Referência
│   ├── COMO_USAR.md               ← Guia visual
│   └── README.md                  ← Doc completa
│
├── 🤖 SCRIPTS
│   ├── start.sh                   ← Script automático
│   └── Makefile                   ← Comandos make
│
├── 🐳 DOCKER
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── 💻 CÓDIGO FONTE
│   └── src/
│       ├── common/                ← Compartilhado
│       ├── insecure/              ← API vulnerável
│       ├── secure/                ← API protegida
│       └── services/              ← Lógica de negócio
│
├── 🗄️ BANCO DE DADOS
│   └── prisma/
│       ├── schema.prisma          ← Schema
│       └── seed.ts                ← Dados iniciais
│
├── 🧪 TESTES
│   └── tests/
│       ├── unit/                  ← Testes unitários
│       └── integration/           ← Testes integração
│
└── 📮 POSTMAN
    └── postman/
        └── collection.json        ← Collection pronta
```

---

## 🎯 Casos de Uso por Perfil

### 👨‍🎓 Estudante
1. Leia **[DOCKER_TUTORIAL.md](DOCKER_TUTORIAL.md)** para aprender Docker
2. Execute **[start.sh](start.sh)** para rodar o projeto
3. Leia **[README.md](README.md)** para entender vulnerabilidades
4. Use Postman para testar na prática
5. Estude o código fonte comparando insecure vs secure

### 👨‍💻 Desenvolvedor
1. Execute **[QUICKSTART.md](QUICKSTART.md)** para setup rápido
2. Leia **[README.md](README.md)** - seção de vulnerabilidades
3. Rode `make test` para ver testes automatizados
4. Explore o código em `src/insecure` e `src/secure`
5. Aplique os aprendizados em seus projetos

### 👨‍🏫 Professor
1. Leia **[README.md](README.md)** para visão geral completa
2. Use **[start.sh](start.sh)** para demo em aula
3. Distribua **[DOCKER_TUTORIAL.md](DOCKER_TUTORIAL.md)** para alunos
4. Use **Postman Collection** para demonstrações ao vivo
5. Customize o código para exercícios práticos

### 🔒 Security Analyst
1. **[README.md](README.md)** - lista completa de CWEs e vulnerabilidades
2. Teste explorações com **Postman Collection**
3. Veja testes em `tests/integration/comparison.test.ts`
4. Use para treinamento de equipes
5. Customize para simular cenários específicos

---

## ⚡ Comandos Mais Usados

```bash
# Rodar tudo automaticamente
./start.sh

# Ou com make
make setup-docker

# Ver logs
make docker-logs

# Parar
make docker-down

# Ajuda
make help
```

---

## 🔗 Links Rápidos

- **API Principal**: http://localhost:3000
- **API Insecure**: http://localhost:3000/insecure
- **API Secure**: http://localhost:3000/secure
- **Health Check**: http://localhost:3000/health

---

## 👥 Credenciais

- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

---

## ❓ Precisa de Ajuda?

| Problema | Solução |
|----------|---------|
| Não sabe por onde começar | **[INICIO_AQUI.md](INICIO_AQUI.md)** |
| Nunca usou Docker | **[DOCKER_TUTORIAL.md](DOCKER_TUTORIAL.md)** |
| Quer rodar rápido | `./start.sh` |
| Precisa de comando | **[COMANDOS_DOCKER.md](COMANDOS_DOCKER.md)** |
| Erro específico | **[DOCKER_TUTORIAL.md](DOCKER_TUTORIAL.md)** → Troubleshooting |
| Quer entender vulnerabilidades | **[README.md](README.md)** |
| Dúvidas de código | Explore `src/` |

---

## 📊 Estatísticas do Projeto

- **Linguagem**: TypeScript (strict mode)
- **Linhas de código**: ~3000+
- **Arquivos**: 50+
- **Testes**: Unitários + Integração
- **Endpoints**: 20+ (10 insecure + 10 secure)
- **Vulnerabilidades**: 7 tipos principais (IDOR, BOLA, SSRF, etc)
- **Proteções**: 10+ (JWT, RBAC, Rate Limit, etc)

---

## 🎉 Pronto!

Escolha um documento acima e comece sua jornada de aprendizado em segurança de APIs!

**Recomendação**: Se é sua primeira vez, comece por **[INICIO_AQUI.md](INICIO_AQUI.md)**

---

**Desenvolvido com 🔒 para educação em segurança de APIs**

