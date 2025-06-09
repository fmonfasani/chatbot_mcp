#!/usr/bin/env node

/**
 * Cliente de ejemplo para conectar con servidores MCP en TypeScript
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";

class MCPClientDemo {
  private client?: Client;
  private transport?: StdioClientTransport;

  async connectToServer(command: string, args: string[] = []): Promise<void> {
    const serverProcess = spawn(command, args, {
      stdio: ["pipe", "pipe", "inherit"],
    });

    this.transport = new StdioClientTransport({
      reader: serverProcess.stdout,
      writer: serverProcess.stdin,
    });

    this.client = new Client(
      {
        name: "demo-client",
        version: "1.0.0",
      },
      {
        capabilities: {},
      }
    );

    await this.client.connect(this.transport);
    console.log("✅ Conectado al servidor MCP");
  }

  async listTools(): Promise<void> {
    if (!this.client) throw new Error("Cliente no conectado");

    try {
      const result = await this.client.listTools();
      console.log("\n🔧 Herramientas disponibles:");
      result.tools.forEach((tool) => {
        console.log(`  - ${tool.name}: ${tool.description}`);
      });
    } catch (error) {
      console.error("❌ Error listando herramientas:", error);
    }
  }

  async callTool(name: string, args: any = {}): Promise<void> {
    if (!this.client) throw new Error("Cliente no conectado");

    try {
      const result = await this.client.callTool({ name, arguments: args });
      console.log(`\n📤 Resultado de ${name}:`);
      result.content.forEach((content) => {
        if (content.type === "text") {
          console.log(`  ${content.text}`);
        }
      });
    } catch (error) {
      console.error(`❌ Error ejecutando ${name}:`, error);
    }
  }

  async listPrompts(): Promise<void> {
    if (!this.client) throw new Error("Cliente no conectado");

    try {
      const result = await this.client.listPrompts();
      console.log("\n📝 Prompts disponibles:");
      result.prompts.forEach((prompt) => {
        console.log(`  - ${prompt.name}: ${prompt.description}`);
      });
    } catch (error) {
      console.error("❌ Error listando prompts:", error);
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
    }
    console.log("👋 Desconectado del servidor");
  }
}

async function demoTypeScriptServer(): Promise<void> {
  console.log("📘 === DEMO SERVIDOR TYPESCRIPT ===");
  
  const client = new MCPClientDemo();
  
  try {
    await client.connectToServer("node", ["../typescript-server/dist/index.js"]);
    
    await client.listTools();
    
    await client.callTool("get_current_time", { format: "readable" });
    await client.callTool("system_info");
    
    await client.listPrompts();
    
  } catch (error) {
    console.error("❌ Error en demo:", error);
  } finally {
    await client.disconnect();
  }
}

// Ejecutar demo
demoTypeScriptServer().catch(console.error);