# 🐳 Comandos Docker - Cola de Referência

## 🎯 Comando ÚNICO para começar

```bash
make setup-docker
```

**Isso faz tudo**: Sobe Docker + Cria banco + Popula dados

---

## 📦 Comandos Básicos

### Subir o projeto
```bash
make docker-up
```
Ou:
```bash
docker-compose up --build -d
```

### Ver se está rodando
```bash
docker ps
```

### Ver logs (tempo real)
```bash
make docker-logs
```
Ou:
```bash
docker logs -f api-security-lab
```

**Para sair dos logs**: Pressione `Ctrl+C`

### Parar o projeto
```bash
make docker-down
```
Ou:
```bash
docker-compose down
```

---

## 🗄️ Banco de Dados

### Criar tabelas (migrations)
```bash
docker exec -it api-security-lab npx prisma migrate dev --name init
```

### Popular dados (seed)
```bash
docker exec -it api-security-lab npm run prisma:seed
```

### Abrir Prisma Studio (interface visual do banco)
```bash
docker exec -it api-security-lab npx prisma studio
```
Acesse: http://localhost:5555

---

## 🔍 Debug e Inspeção

### Entrar dentro do container
```bash
docker exec -it api-security-lab sh
```

Dentro do container você pode:
```bash
ls              # Listar arquivos
pwd             # Ver diretório atual
npm run dev     # Rodar comandos
cat arquivo.ts  # Ver conteúdo de arquivo
exit            # Sair
```

### Ver últimas 50 linhas de log
```bash
docker logs api-security-lab --tail 50
```

### Ver logs com timestamp
```bash
docker logs -t api-security-lab
```

---

## 🧪 Rodar Testes

### Todos os testes
```bash
docker exec -it api-security-lab npm test
```

### Testes unitários
```bash
docker exec -it api-security-lab npm run test:unit
```

### Testes de integração
```bash
docker exec -it api-security-lab npm run test:integration
```

---

## 🔄 Reiniciar e Reconstruir

### Reiniciar container
```bash
docker restart api-security-lab
```

### Reconstruir (quando mudar código)
```bash
docker-compose up --build -d
```

### Limpar cache e reconstruir do zero
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 🗑️ Limpeza

### Parar e remover containers
```bash
docker-compose down
```

### Parar e remover TUDO (incluindo banco)
```bash
docker-compose down -v
```

### Ver espaço usado pelo Docker
```bash
docker system df
```

### Limpar tudo do Docker (CUIDADO!)
```bash
docker system prune -a --volumes
```
⚠️ **Isso remove tudo do Docker, não só deste projeto!**

### Limpar apenas deste projeto
```bash
make clean
```

---

## 📊 Informações

### Ver todos os containers (rodando e parados)
```bash
docker ps -a
```

### Ver imagens Docker
```bash
docker images
```

### Ver volumes
```bash
docker volume ls
```

### Ver uso de recursos
```bash
docker stats api-security-lab
```

---

## 🚨 Problemas Comuns

### Porta 3000 já está em uso
```bash
# Ver quem está usando
lsof -i :3000

# Matar o processo
kill -9 <PID>

# Ou mudar porta no docker-compose.yml
```

### Container não inicia
```bash
# Ver erro
docker logs api-security-lab

# Remover e recriar
docker-compose down
docker-compose up --build -d
```

### Mudanças no código não aparecem
```bash
# Reconstruir imagem
docker-compose up --build -d
```

### Container em loop de restart
```bash
# Ver logs para encontrar erro
docker logs api-security-lab --tail 100

# Entrar no container para debug
docker run -it api-teste-api sh
```

---

## 🎯 Workflow Diário

### Começar a trabalhar
```bash
cd /Users/tidos/Desktop/api-teste
make docker-up
make docker-logs  # (opcional) ver logs
```

### Durante o trabalho
```bash
# Se mudou código TypeScript
docker-compose up --build -d

# Ver logs
make docker-logs

# Testar
curl http://localhost:3000/health
```

### Terminar
```bash
make docker-down
```

---

## 📞 Atalhos Úteis

| Comando | Atalho |
|---------|--------|
| Subir Docker | `make docker-up` |
| Ver logs | `make docker-logs` |
| Parar Docker | `make docker-down` |
| Setup completo | `make setup-docker` |
| Limpar tudo | `make clean` |
| Ajuda | `make help` |

---

## 🔗 Links Rápidos

- **API**: http://localhost:3000
- **Insecure**: http://localhost:3000/insecure
- **Secure**: http://localhost:3000/secure
- **Health**: http://localhost:3000/health

---

## 📚 Mais Informações

- **Tutorial completo**: [DOCKER_TUTORIAL.md](DOCKER_TUTORIAL.md)
- **Quick Start**: [QUICKSTART.md](QUICKSTART.md)
- **README**: [README.md](README.md)

---

**💡 Dica**: Salve esta página nos favoritos para consultar rapidamente!

