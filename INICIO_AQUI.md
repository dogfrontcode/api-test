# 🎯 COMECE AQUI!

## Você nunca usou Docker?

### 1️⃣ Instale o Docker
Acesse: https://www.docker.com/products/docker-desktop

- **Mac**: Baixe Docker Desktop for Mac
- **Windows**: Baixe Docker Desktop for Windows  
- **Linux**: `sudo apt install docker.io docker-compose`

### 2️⃣ Abra o Docker Desktop
Certifique-se que o ícone da baleia está visível na barra superior (Mac) ou systray (Windows)

### 3️⃣ Abra o Terminal
- **Mac**: Aplicações → Utilitários → Terminal
- **Windows**: PowerShell ou CMD
- **Linux**: Terminal

### 4️⃣ Navegue até a pasta do projeto
```bash
cd /Users/tidos/Desktop/api-teste
```

### 5️⃣ Execute o script automático
```bash
./start.sh
```

**Pronto!** O script faz tudo sozinho. ✨

---

## Você já tem Docker instalado?

### Opção Rápida (Comando Único):
```bash
cd /Users/tidos/Desktop/api-teste
./start.sh
```

### Opção Makefile:
```bash
cd /Users/tidos/Desktop/api-teste
make setup-docker
```

---

## 🎯 Após Iniciar

### Acesse no navegador:
```
http://localhost:3000
```

### Teste com curl:
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

### Use o Postman:
1. Abra o Postman
2. Clique em "Import"
3. Selecione o arquivo: `postman/collection.json`
4. Execute as requests!

---

## 📚 Documentação

Escolha o que precisa:

| Documento | Quando usar |
|-----------|-------------|
| **[QUICKSTART.md](QUICKSTART.md)** | Quer começar em 5 minutos |
| **[DOCKER_TUTORIAL.md](DOCKER_TUTORIAL.md)** | Nunca usou Docker, quer entender |
| **[COMANDOS_DOCKER.md](COMANDOS_DOCKER.md)** | Referência rápida de comandos |
| **[README.md](README.md)** | Documentação completa do projeto |

---

## ❓ Algo deu errado?

### "docker: command not found"
➡️ Instale o Docker: https://www.docker.com/products/docker-desktop

### "Cannot connect to Docker daemon"  
➡️ Abra o Docker Desktop

### "Port 3000 already in use"
```bash
lsof -i :3000          # Ver quem está usando
kill -9 <PID>          # Matar o processo
```

### Outros problemas
➡️ Leia [DOCKER_TUTORIAL.md](DOCKER_TUTORIAL.md) - seção "Troubleshooting"

---

## 🎓 Credenciais de Teste

| Email | Senha | Role |
|-------|-------|------|
| admin@example.com | admin123 | admin |
| user@example.com | user123 | user |

---

## 🛑 Parar o Projeto

```bash
make docker-down
```

Ou:
```bash
docker-compose down
```

---

**🎉 Divirta-se aprendendo sobre segurança de APIs!**

Explore as diferenças entre `/insecure` e `/secure` para entender vulnerabilidades comuns e suas correções.

