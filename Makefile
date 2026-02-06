.PHONY: help install build dev test clean docker-up docker-down seed migrate

help:
	@echo "🐳 COMANDOS DOCKER (RECOMENDADO):"
	@echo "  make setup-docker     - 🚀 Setup completo com Docker (um comando só!)"
	@echo "  make docker-up        - Subir containers Docker"
	@echo "  make docker-down      - Parar containers"
	@echo "  make docker-logs      - Ver logs dos containers"
	@echo ""
	@echo "💻 COMANDOS LOCAIS:"
	@echo "  make install          - Instalar dependências"
	@echo "  make build            - Compilar TypeScript"
	@echo "  make dev              - Rodar em modo desenvolvimento"
	@echo "  make seed             - Popular banco com dados iniciais"
	@echo "  make migrate          - Rodar migrations do Prisma"
	@echo "  make setup            - Setup completo local"
	@echo ""
	@echo "🧪 TESTES:"
	@echo "  make test             - Rodar todos os testes"
	@echo "  make test-unit        - Rodar testes unitários"
	@echo "  make test-integration - Rodar testes de integração"
	@echo ""
	@echo "🗑️  LIMPEZA:"
	@echo "  make clean            - Limpar arquivos gerados"
	@echo ""
	@echo "📚 DOCUMENTAÇÃO:"
	@echo "  • README.md - Documentação completa"
	@echo "  • DOCKER_TUTORIAL.md - Tutorial Docker para iniciantes"
	@echo "  • QUICKSTART.md - Guia rápido de 5 minutos"

install:
	npm install

build:
	npm run build

dev:
	npm run dev

test:
	npm run test

test-unit:
	npm run test:unit

test-integration:
	npm run test:integration

docker-up:
	docker-compose up --build -d

docker-down:
	docker-compose down -v

docker-logs:
	docker-compose logs -f

seed:
	npm run prisma:seed

migrate:
	npm run prisma:migrate

generate:
	npm run prisma:generate

clean:
	rm -rf dist node_modules .prisma logs/*.log
	docker-compose down -v

setup: install migrate seed
	@echo "✅ Setup completo!"

setup-docker: docker-up
	@echo "⏳ Aguardando container iniciar..."
	@sleep 5
	@echo "📊 Criando banco de dados..."
	@docker exec -it api-security-lab npx prisma migrate dev --name init || true
	@echo "🌱 Populando dados..."
	@docker exec -it api-security-lab npm run prisma:seed || true
	@echo ""
	@echo "✅ Setup Docker completo!"
	@echo "🌐 Acesse: http://localhost:3000"
	@echo "📮 Importe: postman/collection.json no Postman"
	@echo "📚 Veja: README.md para mais informações"

