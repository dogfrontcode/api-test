# ⚡ Quick Start - 5 minutos para rodar!

## 🐳 Nunca usou Docker?
👉 **Leia primeiro**: [DOCKER_TUTORIAL.md](DOCKER_TUTORIAL.md) - Tutorial completo para iniciantes

## 🚀 Para quem já tem Docker instalado

### Opção 1: Comandos Automáticos (Recomendado)

```bash
# 1. Entrar na pasta
cd /Users/tidos/Desktop/api-teste

# 2. Setup completo (sobe Docker + cria banco + popula dados)
make setup-docker
```

Pronto! Acesse: http://localhost:3000

### Opção 2: Passo a Passo Manual

```bash
# 1. Entrar na pasta
cd /Users/tidos/Desktop/api-teste

# 2. Subir Docker
make docker-up
# Aguarde 2-3 minutos na primeira vez

# 3. Criar banco de dados
docker exec -it api-security-lab npx prisma migrate dev --name init

# 4. Popular dados (usuários de teste)
docker exec -it api-security-lab npm run prisma:seed

# 5. Testar
curl http://localhost:3000/health
```

## ✅ Como saber se está funcionando?

Abra seu navegador em: **http://localhost:3000**

Você deve ver:
```json
{
  "message": "API Security Lab - Laboratório Educacional",
  "endpoints": {
    "insecure": "/insecure/* - API vulnerável",
    "secure": "/secure/* - API protegida"
  }
}
```

## 🧪 Testar rapidamente

```bash
# Login Insecure (vulnerável)
curl -X POST http://localhost:3000/insecure/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Login Secure (protegido)
curl -X POST http://localhost:3000/secure/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

## 📮 Usar Postman

1. Abra o Postman
2. Importe o arquivo: `postman/collection.json`
3. Execute "Secure API > Auth > Login (Admin)"
4. Explore as outras requests!

## 📊 Ver logs

```bash
make docker-logs
```

Para sair dos logs: `Ctrl+C`

## 🛑 Parar tudo

```bash
make docker-down
```

## 🗑️ Limpar tudo e recomeçar

```bash
make clean
make setup-docker
```

## 🎯 Credenciais de Teste

| Email | Senha | Role |
|-------|-------|------|
| admin@example.com | admin123 | admin |
| user@example.com | user123 | user |

## 📚 Documentação Completa

- **Tutorial Docker**: [DOCKER_TUTORIAL.md](DOCKER_TUTORIAL.md)
- **README completo**: [README.md](README.md)
- **Arquitetura e vulnerabilidades**: Veja README.md

## ❓ Problemas?

### "docker: command not found"
👉 Instale o Docker: https://www.docker.com/products/docker-desktop

### "Cannot connect to Docker daemon"
👉 Abra o Docker Desktop (ícone da baleia deve estar visível)

### "Port 3000 already in use"
```bash
# Ver o que está usando a porta
lsof -i :3000

# Matar o processo
kill -9 <PID>
```

### Outros problemas
👉 Leia [DOCKER_TUTORIAL.md](DOCKER_TUTORIAL.md) - seção "Troubleshooting"

---

**Divirta-se aprendendo sobre segurança de APIs! 🔒**

