# Guía de Desarrollo

## 🛠️ Configuración del Entorno de Desarrollo

### Python

1. **Crear entorno virtual:**
```bash
cd python-server
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate     # Windows
```

2. **Instalar dependencias de desarrollo:**
```bash
pip install -e ".[dev]"
```

3. **Configurar herramientas:**
```bash
# Formatear código
black src/

# Type checking
mypy src/

# Tests
pytest tests/
```

### TypeScript

1. **Configurar modo desarrollo:**
```bash
cd typescript-server
npm run dev  # Auto-reload con tsx
```

2. **Herramientas de desarrollo:**
```bash
# Linting
npm run lint

# Formatear
npm run format

# Build
npm run build

# Tests
npm run test
```

## 🧪 Testing

### Crear Tests para Python

```python
# tests/test_tools.py
import pytest
from src.mcp_server.main import server

@pytest.mark.asyncio
async def test_get_time_tool():
    # Test implementation
    pass
```

### Crear Tests para TypeScript

```typescript
// tests/tools.test.ts
import { describe, it, expect } from 'jest';

describe('Tools', () => {
  it('should get current time', () => {
    // Test implementation
  });
});
```

## 🔄 Flujo de Desarrollo

1. **Crear nueva feature:**
   - Crear branch: `git checkout -b feature/nueva-herramienta`
   - Implementar funcionalidad
   - Añadir tests
   - Documentar

2. **Testing:**
   - Tests unitarios
   - Tests de integración
   - Manual testing con clientes

3. **Code review:**
   - Verificar code style
   - Revisar documentación
   - Validar tests

## 📊 Debugging

### Python
```bash
# Logging detallado
PYTHONPATH=src python -m pdb server.py

# Con logs
python server.py 2>&1 | tee debug.log
```

### TypeScript
```bash
# Debug mode
node --inspect dist/index.js

# Con logs detallados
DEBUG=* npm run start
```

## 🚀 Deployment

### Docker (Opcional)

```dockerfile
# Dockerfile.python
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY src/ src/
CMD ["python", "server.py"]
```

```dockerfile
# Dockerfile.typescript
FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ dist/
CMD ["node", "dist/index.js"]
```

## 📈 Performance

### Monitoring
- Memory usage
- Response times
- Error rates
- Connection stability

### Optimization
- Async/await best practices
- Connection pooling
- Caching strategies
- Resource management

## 🔐 Security

### Consideraciones
- Input validation
- File system access limits
- Network request restrictions
- Error message sanitization

### Best Practices
- Validate all tool inputs
- Sanitize file paths
- Rate limiting
- Audit logging