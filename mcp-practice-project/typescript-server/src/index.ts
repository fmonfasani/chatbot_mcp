#!/usr/bin/env node

/**
 * Servidor MCP de ejemplo en TypeScript
 * Proporciona herramientas, prompts y recursos para demostrar el protocolo MCP
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  GetResourceRequestSchema,
  ListResourcesRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { setupTools } from "./tools/index.js";
import { setupPrompts } from "./prompts/index.js";
import { setupResources } from "./resources/index.js";

class MCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "typescript-mcp-server",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
          prompts: {},
          resources: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // Configurar manejadores de herramientas
    setupTools(this.server);
    
    // Configurar manejadores de prompts
    setupPrompts(this.server);
    
    // Configurar manejadores de recursos
    setupResources(this.server);
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error("🚀 Servidor MCP TypeScript iniciado");
  }
}

// Iniciar servidor
const server = new MCPServer();
server.run().catch((error) => {
  console.error("Error al iniciar servidor:", error);
  process.exit(1);
});
