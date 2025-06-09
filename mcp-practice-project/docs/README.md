# Proyecto de Práctica MCP (Model Context Protocol)

Este proyecto te permite practicar con el Model Context Protocol usando tanto Python como TypeScript.

## 🏗️ Estructura del Proyecto

```
mcp-practice-project/
├── python-server/          # Servidor MCP en Python
│   ├── src/mcp_server/
│   │   ├── __init__.py
│   │   └── main.py         # Servidor principal
│   ├── server.py           # Punto de entrada
│   ├── pyproject.toml      # Configuración Python
│   └── requirements.txt
├── typescript-server/      # Servidor MCP en TypeScript
│   ├── src/
│   │   ├── index.ts        # Servidor principal
│   │   ├── tools/          # Herramientas
│   │   ├── prompts/        # Prompts
│   │   └── resources/      # Recursos
│   ├── package.json
│   └── tsconfig.json
├── client-examples/        # Ejemplos de clientes
│   ├── python_client.py
│   └── typescript_client.ts
└── docs/                   # Documentación
    └── README.md
```

## 🚀 Instalación y Setup

### 1. Instalar Dependencias Python

```bash
cd python-server
pip install -r requirements.txt
# o usando pipenv/poetry
```

### 2. Instalar Dependencias TypeScript

```bash
cd typescript-server
npm install
npm run build
```

## 🎮 Uso

### Ejecutar Servidor Python

```bash
cd python-server
python server.py
```

### Ejecutar Servidor TypeScript

```bash
cd typescript-server
npm run start
# o para desarrollo:
npm run dev
```

### Probar con Clientes

```bash
cd client-examples

# Cliente Python
python python_client.py

# Cliente TypeScript (después de compilar)
npx tsx typescript_client.ts
```

## 🔧 Herramientas Disponibles

### Servidor Python

- `get_time`: Obtiene fecha y hora actual
- `http_request`: Realiza peticiones HTTP GET
- `calculate`: Cálculos matemáticos básicos

### Servidor TypeScript

- `get_current_time`: Fecha y hora del sistema
- `http_request`: Peticiones HTTP (GET/POST)
- `file_operations`: Operaciones de archivos
- `system_info`: Información del sistema

## 📝 Prompts Disponibles

### Servidor Python

- `code_review`: Revisión de código
- `explain_concept`: Explicación de conceptos

### Servidor TypeScript

- `tech_interview`: Preguntas de entrevistas técnicas
- `architecture_review`: Revisión de arquitectura
- `debug_helper`: Ayuda para debugging

## 📊 Recursos Disponibles

Ambos servidores proporcionan:

- Configuración del servidor
- Documentación de la API
- Ejemplos de uso

## 🧪 Experimentación

### Ideas para Practicar

1. **Añadir nuevas herramientas:**

   - Base de datos simple
   - Generador de passwords
   - Convertidor de unidades

2. **Crear nuevos prompts:**

   - Code generation templates
   - Documentation generators
   - Testing strategies

3. **Añadir recursos:**

   - Configuration files
   - Templates
   - Documentation

4. **Mejorar clientes:**
   - CLI interactivo
   - Web interface
   - Integración con IDEs

## 📖 Referencias

- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## 🤝 Contribuir

Este es un proyecto de práctica. Siéntete libre de:

- Añadir nuevas funcionalidades
- Mejorar el código existente
- Crear ejemplos adicionales
- Reportar issues

## 📄 Licencia

powered by @fmonfasani

MIT License - Siéntete libre de usar este código para aprender y experimentar.
