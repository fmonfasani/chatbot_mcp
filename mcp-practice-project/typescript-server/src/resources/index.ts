import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  GetResourceRequestSchema,
  ListResourcesRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

export function setupResources(server: Server): void {
  // Listar recursos
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: "config://server.json",
          name: "Configuración del servidor",
          description: "Configuración actual del servidor MCP",
          mimeType: "application/json",
        },
        {
          uri: "docs://api.md",
          name: "Documentación de la API",
          description: "Documentación completa de la API del servidor",
          mimeType: "text/markdown",
        },
        {
          uri: "examples://usage.json",
          name: "Ejemplos de uso",
          description: "Ejemplos de cómo usar las herramientas disponibles",
          mimeType: "application/json",
        },
      ],
    };
  });

  // Obtener recursos específicos
  server.setRequestHandler(GetResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    switch (uri) {
      case "config://server.json": {
        const config = {
          server: "typescript-mcp-server",
          version: "0.1.0",
          capabilities: ["tools", "prompts", "resources"],
          tools: ["get_current_time", "http_request", "file_operations", "system_info"],
          prompts: ["tech_interview", "architecture_review", "debug_helper"],
          resources: ["config", "docs", "examples"],
          started_at: new Date().toISOString(),
        };

        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(config, null, 2),
            },
          ],
        };
      }

      case "docs://api.md": {
        const documentation = `# API del Servidor MCP TypeScript

## Herramientas Disponibles

### get_current_time
Obtiene la fecha y hora actual del sistema.

**Parámetros:**
- \`format\` (opcional): "iso" | "readable"

**Ejemplo:**
\`\`\`json
{
  "tool": "get_current_time",
  "arguments": {
    "format": "iso"
  }
}
\`\`\`

### http_request
Realiza peticiones HTTP a URLs externas.

**Parámetros:**
- \`url\` (requerido): URL de destino
- \`method\` (opcional): "GET" | "POST"

**Ejemplo:**
\`\`\`json
{
  "tool": "http_request",
  "arguments": {
    "url": "https://api.github.com/users/octocat",
    "method": "GET"
  }
}
\`\`\`

### file_operations
Operaciones básicas de archivos del sistema.

**Parámetros:**
- \`operation\` (requerido): "read" | "write" | "list"
- \`path\` (requerido): Ruta del archivo o directorio
- \`content\` (opcional): Contenido para escritura

### system_info
Obtiene información del sistema operativo y runtime.

## Prompts Disponibles

### tech_interview
Genera preguntas para entrevistas técnicas personalizadas.

### architecture_review
Crea prompts para revisión de arquitectura de sistemas.

### debug_helper
Estructura el proceso de debugging sistemático.

## Recursos Disponibles

- \`config://server.json\`: Configuración del servidor
- \`docs://api.md\`: Esta documentación
- \`examples://usage.json\`: Ejemplos de uso
`;

        return {
          contents: [
            {
              uri,
              mimeType: "text/markdown",
              text: documentation,
            },
          ],
        };
      }

      case "examples://usage.json": {
        const examples = {
          tools: {
            get_current_time: [
              {
                description: "Obtener hora en formato legible",
                request: {
                  tool: "get_current_time",
                  arguments: { format: "readable" },
                },
              },
              {
                description: "Obtener hora en formato ISO",
                request: {
                  tool: "get_current_time",
                  arguments: { format: "iso" },
                },
              },
            ],
            http_request: [
              {
                description: "Consultar API de GitHub",
                request: {
                  tool: "http_request",
                  arguments: {
                    url: "https://api.github.com/users/octocat",
                    method: "GET",
                  },
                },
              },
            ],
            file_operations: [
              {
                description: "Listar archivos en directorio",
                request: {
                  tool: "file_operations",
                  arguments: {
                    operation: "list",
                    path: ".",
                  },
                },
              },
              {
                description: "Leer archivo de configuración",
                request: {
                  tool: "file_operations",
                  arguments: {
                    operation: "read",
                    path: "package.json",
                  },
                },
              },
            ],
          },
          prompts: {
            tech_interview: [
              {
                description: "Entrevista para desarrollador backend senior",
                request: {
                  prompt: "tech_interview",
                  arguments: {
                    role: "backend",
                    level: "senior",
                    technology: "Node.js",
                  },
                },
              },
            ],
          },
        };

        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(examples, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Recurso no encontrado: ${uri}`);
    }
  });
}