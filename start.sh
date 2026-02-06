#!/bin/bash

# Script de inicialização automática do API Security Lab
# Para iniciantes em Docker

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cor
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Banner
echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║   🐳 API Security Lab - Setup Automático     ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Verificar se Docker está instalado
print_info "Verificando se Docker está instalado..."
if ! command -v docker &> /dev/null; then
    print_error "Docker não está instalado!"
    echo ""
    echo "Por favor, instale o Docker primeiro:"
    echo "  Mac/Windows: https://www.docker.com/products/docker-desktop"
    echo "  Linux: sudo apt install docker.io docker-compose"
    echo ""
    echo "📚 Veja o tutorial completo: DOCKER_TUTORIAL.md"
    exit 1
fi
print_success "Docker encontrado!"

# Verificar se Docker está rodando
print_info "Verificando se Docker está rodando..."
if ! docker info &> /dev/null; then
    print_error "Docker não está rodando!"
    echo ""
    echo "Por favor, inicie o Docker:"
    echo "  Mac/Windows: Abra o Docker Desktop"
    echo "  Linux: sudo systemctl start docker"
    exit 1
fi
print_success "Docker está rodando!"

# Verificar se docker-compose está disponível
print_info "Verificando docker-compose..."
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
else
    print_error "docker-compose não encontrado!"
    exit 1
fi
print_success "docker-compose encontrado!"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar se já está rodando
if docker ps | grep -q "api-security-lab"; then
    print_warning "O projeto já está rodando!"
    echo ""
    read -p "Deseja reiniciar? (s/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        print_info "Parando containers..."
        $COMPOSE_CMD down
    else
        print_info "Mantendo containers rodando."
        echo ""
        print_success "API disponível em: http://localhost:3000"
        exit 0
    fi
fi

# Subir Docker
print_info "Subindo containers Docker..."
print_warning "Primeira vez pode demorar 3-5 minutos..."
$COMPOSE_CMD up --build -d

if [ $? -ne 0 ]; then
    print_error "Erro ao subir containers!"
    exit 1
fi
print_success "Containers iniciados!"

# Aguardar container iniciar
print_info "Aguardando container inicializar..."
sleep 5

# Verificar se container está rodando
if ! docker ps | grep -q "api-security-lab"; then
    print_error "Container não está rodando!"
    echo ""
    echo "Veja os logs para mais detalhes:"
    echo "  docker logs api-security-lab"
    exit 1
fi
print_success "Container rodando!"

# Verificar se banco já existe
DB_EXISTS=$(docker exec api-security-lab sh -c 'test -f /app/data/dev.db && echo "yes" || echo "no"' 2>/dev/null || echo "no")

if [ "$DB_EXISTS" = "no" ]; then
    # Criar banco de dados
    print_info "Criando banco de dados (migrations)..."
    docker exec -it api-security-lab npx prisma migrate dev --name init 2>/dev/null || {
        print_warning "Migrations já existem ou erro ocorreu"
    }
    print_success "Banco de dados criado!"

    # Popular dados
    print_info "Populando dados iniciais (seed)..."
    docker exec -it api-security-lab npm run prisma:seed
    print_success "Dados populados!"
else
    print_info "Banco de dados já existe, pulando migrations e seed"
fi

# Testar API
print_info "Testando API..."
sleep 2
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    print_success "API está respondendo!"
else
    print_warning "API ainda não está respondendo, pode demorar alguns segundos"
fi

# Mensagem final
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_success "Setup completo! 🎉"
echo ""
echo "📋 INFORMAÇÕES:"
echo "  • API Principal: http://localhost:3000"
echo "  • API Insecure:  http://localhost:3000/insecure"
echo "  • API Secure:    http://localhost:3000/secure"
echo "  • Health Check:  http://localhost:3000/health"
echo ""
echo "👤 USUÁRIOS DE TESTE:"
echo "  Admin: admin@example.com / admin123"
echo "  User:  user@example.com / user123"
echo ""
echo "📮 POSTMAN:"
echo "  Importe: postman/collection.json"
echo ""
echo "📊 VER LOGS:"
echo "  make docker-logs"
echo "  (ou: docker logs -f api-security-lab)"
echo ""
echo "🛑 PARAR:"
echo "  make docker-down"
echo "  (ou: docker-compose down)"
echo ""
echo "📚 DOCUMENTAÇÃO:"
echo "  • README.md - Documentação completa"
echo "  • DOCKER_TUTORIAL.md - Tutorial Docker"
echo "  • QUICKSTART.md - Guia rápido"
echo "  • COMANDOS_DOCKER.md - Referência de comandos"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Perguntar se quer ver logs
read -p "Deseja ver os logs da aplicação? (s/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo ""
    print_info "Mostrando logs (Ctrl+C para sair)..."
    echo ""
    docker logs -f api-security-lab
fi

