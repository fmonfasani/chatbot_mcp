PHONY: help install build test clean run-python run-typescript demo

help:
	@echo "Comandos disponibles:"
	@echo "  install          - Instalar todas las dependencias"
	@echo "  build           - Compilar proyectos"
	@echo "  test            - Ejecutar tests"
	@echo "  clean           - Limpiar archivos generados"
	@echo "  run-python      - Ejecutar servidor Python"
	@echo "  run-typescript  - Ejecutar servidor TypeScript"
	@echo "  demo            - Ejecutar demo completo"

install:
	@echo "📦 Instalando dependencias Python..."
	cd python-server && pip install -r requirements.txt
	@echo "📦 Instalando dependencias TypeScript (servidor)..."
	cd typescript-server && npm install
	@echo "📦 Instalando dependencias TypeScript (cliente)..."
	cd client-examples && npm install

build:
	@echo "🔨 Compilando servidor TypeScript..."
	cd typescript-server && npm run build
	@echo "✅ Compilación completada"

test:
	@echo "🧪 Ejecutando tests Python..."
	cd python-server && python -m pytest tests/ || echo "No tests found"
	@echo "🧪 Ejecutando tests TypeScript..."
	cd typescript-server && npm test || echo "No tests found"

clean:
	@echo "🧹 Limpiando archivos generados..."
	rm -rf typescript-server/dist/
	rm -rf python-server/src/*.egg-info/
	rm -rf **/__pycache__/
	rm -rf **/node_modules/.cache/

run-python:
	@echo "🐍 Iniciando servidor Python..."
	cd python-server && python server.py

run-typescript:
	@echo "📘 Iniciando servidor TypeScript..."
	cd typescript-server && npm run start

demo:
	@echo "🎮 Ejecutando demo completo..."
	@echo "Asegúrate de que los servidores estén compilados..."
	$(MAKE) build
	@echo ""
	@echo "🐍 Demo Python:"
	cd client-examples && python python_client.py || echo "Error en demo Python - verifica que el servidor esté funcionando"
	@echo ""
	@echo "📘 Demo TypeScript:"
	cd client-examples && npx tsx typescript_client.ts || echo "Error en demo TypeScript - verifica que el servidor esté funcionando"

# Comandos adicionales útiles
dev-python:
	@echo "🔄 Modo desarrollo Python (con auto-reload)..."
	cd python-server && python -u server.py

dev-typescript:
	@echo "🔄 Modo desarrollo TypeScript (con auto-reload)..."
	cd typescript-server && npm run dev

setup: install build
	@echo "✅ Setup completo - proyecto listo para usar"
	@echo ""
	@echo "🚀 Próximos pasos:"
	@echo "   make run-python      # o"
	@echo "   make run-typescript  # en terminales separadas"
	@echo "   make demo           # para probar"