import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { z } from "zod";

// Esquemas de validación
const TimeToolSchema = z.object({
  format: z.enum(["iso", "readable"]).default("readable"),
});

const HttpRequestSchema = z.object({
  url: z.string().url(),
  method: z.enum(["GET", "POST"]).default("GET"),
});

const FileOperationSchema = z.object({
  operation: z.enum(["read", "write", "list"]),
  path: z.string(),
  content: z.string().optional(),
});

export function setupTools(server: Server): void {
  // Listar herramientas
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "get_current_time",
          description: "Obtiene la fecha y hora actual del sistema",
          inputSchema: {
            type: "object",
            properties: {
              format: {
                type: "string",
                enum: ["iso", "readable"],
                description: "Formato de salida de la fecha",
                default: "readable",
              },
            },
          },
        },
        {
          name: "http_request",
          description: "Realiza peticiones HTTP",
          inputSchema: {
            type: "object",
            properties: {
              url: {
                type: "string",
                description: "URL de destino",
              },
              method: {
                type: "string",
                enum: ["GET", "POST"],
                description: "Método HTTP",
                default: "GET",
              },
            },
            required: ["url"],
          },
        },
        {
          name: "file_operations",
          description: "Operaciones básicas de archivos",
          inputSchema: {
            type: "object",
            properties: {
              operation: {
                type: "string",
                enum: ["read", "write", "list"],
                description: "Tipo de operación",
              },
              path: {
                type: "string",
                description: "Ruta del archivo o directorio",
              },
              content: {
                type: "string",
                description: "Contenido para operaciones de escritura",
              },
            },
            required: ["operation", "path"],
          },
        },
        {
          name: "system_info",
          description: "Obtiene información del sistema",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
      ],
    };
  });

  // Ejecutar herramientas
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case "get_current_time": {
          const { format } = TimeToolSchema.parse(args);
          const now = new Date();
          const timeString = format === "iso" 
            ? now.toISOString() 
            : now.toLocaleString();

          return {
            content: [
              {
                type: "text" as const,
                text: `Fecha y hora actual: ${timeString}`,
              },
            ],
          };
        }

        case "http_request": {
          const { url, method } = HttpRequestSchema.parse(args);
          
          try {
            const response = await axios({
              method,
              url,
              timeout: 10000,
            });

            return {
              content: [
                {
                  type: "text" as const,
                  text: `Status: ${response.status}\nHeaders: ${JSON.stringify(
                    response.headers,
                    null,
                    2
                  )}\nData: ${JSON.stringify(response.data, null, 2).substring(0, 1000)}...`,
                },
              ],
            };
          } catch (error) {
            return {
              content: [
                {
                  type: "text" as const,
                  text: `Error en petición HTTP: ${error instanceof Error ? error.message : String(error)}`,
                },
              ],
            };
          }
        }

        case "file_operations": {
          const { operation, path, content } = FileOperationSchema.parse(args);
          
          // Implementación básica - en producción añadir validaciones de seguridad
          const fs = await import("fs/promises");
          const pathModule = await import("path");

          try {
            switch (operation) {
              case "read": {
                const data = await fs.readFile(path, "utf-8");
                return {
                  content: [
                    {
                      type: "text" as const,
                      text: `Contenido de ${path}:\n${data}`,
                    },
                  ],
                };
              }

              case "write": {
                if (!content) {
                  throw new Error("Contenido requerido para escritura");
                }
                await fs.writeFile(path, content);
                return {
                  content: [
                    {
                      type: "text" as const,
                      text: `Archivo escrito exitosamente: ${path}`,
                    },
                  ],
                };
              }

              case "list": {
                const items = await fs.readdir(path);
                return {
                  content: [
                    {
                      type: "text" as const,
                      text: `Contenido de ${path}:\n${items.join("\n")}`,
                    },
                  ],
                };
              }

              default:
                throw new Error(`Operación no soportada: ${operation}`);
            }
          } catch (error) {
            return {
              content: [
                {
                  type: "text" as const,
                  text: `Error en operación de archivo: ${error instanceof Error ? error.message : String(error)}`,
                },
              ],
            };
          }
        }

        case "system_info": {
          const os = await import("os");
          const info = {
            platform: os.platform(),
            arch: os.arch(),
            nodeVersion: process.version,
            uptime: os.uptime(),
            memory: {
              total: os.totalmem(),
              free: os.freemem(),
            },
            cpus: os.cpus().length,
          };

          return {
            content: [
              {
                type: "text" as const,
                text: `Información del sistema:\n${JSON.stringify(info, null, 2)}`,
              },
            ],
          };
        }

        default:
          throw new Error(`Herramienta desconocida: ${name}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  });
}
