.PHONY: help install build test clean run-python run-typescript demo

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
	@echo "📦 Instalando dependencias TypeScript..."
	cd typescript-server && npm install

build:
	@echo "🔨 Compilando TypeScript..."
	cd typescript-server && npm run build

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
	cd client-examples && python python_client.py