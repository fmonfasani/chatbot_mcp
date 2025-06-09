#!/usr/bin/env python3
"""
Cliente de ejemplo para conectar con servidores MCP
"""

import asyncio
import json
from typing import Any, Dict
from mcp.client import Client
from mcp.client.stdio import stdio_client

class MCPClient:
    def __init__(self, server_command: list[str]):
        self.server_command = server_command
        self.client = None
    
    async def connect(self):
        """Conecta al servidor MCP"""
        self.client_session = stdio_client(self.server_command)
        self.client = Client(self.client_session[0])
        await self.client_session[1].__aenter__()
        
        # Inicializar sesión
        await self.client.initialize()
        
        print("✅ Conectado al servidor MCP")
    
    async def list_tools(self):
        """Lista todas las herramientas disponibles"""
        try:
            result = await self.client.list_tools()
            print("\n🔧 Herramientas disponibles:")
            for tool in result.tools:
                print(f"  - {tool.name}: {tool.description}")
            return result.tools
        except Exception as e:
            print(f"❌ Error listando herramientas: {e}")
            return []
    
    async def call_tool(self, name: str, arguments: Dict[str, Any] = None):
        """Ejecuta una herramienta específica"""
        try:
            result = await self.client.call_tool(name, arguments or {})
            print(f"\n📤 Resultado de {name}:")
            for content in result.content:
                print(f"  {content.text}")
            return result
        except Exception as e:
            print(f"❌ Error ejecutando {name}: {e}")
            return None
    
    async def list_prompts(self):
        """Lista todos los prompts disponibles"""
        try:
            result = await self.client.list_prompts()
            print("\n📝 Prompts disponibles:")
            for prompt in result.prompts:
                print(f"  - {prompt.name}: {prompt.description}")
            return result.prompts
        except Exception as e:
            print(f"❌ Error listando prompts: {e}")
            return []
    
    async def disconnect(self):
        """Desconecta del servidor"""
        if self.client_session:
            await self.client_session[1].__aexit__(None, None, None)
        print("👋 Desconectado del servidor")

async def demo_python_server():
    """Demo del servidor Python"""
    print("🐍 === DEMO SERVIDOR PYTHON ===")
    
    client = MCPClient(["python", "../python-server/server.py"])
    
    try:
        await client.connect()
        
        # Listar herramientas
        await client.list_tools()
        
        # Probar herramientas
        await client.call_tool("get_time", {"format": "readable"})
        await client.call_tool("calculate", {"expression": "2 + 2 * 3"})
        
        # Listar prompts
        await client.list_prompts()
        
    except Exception as e:
        print(f"❌ Error en demo: {e}")
    finally:
        await client.disconnect()

async def demo_typescript_server():
    """Demo del servidor TypeScript"""
    print("\n📘 === DEMO SERVIDOR TYPESCRIPT ===")
    
    client = MCPClient(["node", "../typescript-server/dist/index.js"])
    
    try:
        await client.connect()
        
        # Listar herramientas
        await client.list_tools()
        
        # Probar herramientas
        await client.call_tool("get_current_time", {"format": "iso"})
        await client.call_tool("system_info")
        
        # Listar prompts
        await client.list_prompts()
        
    except Exception as e:
        print(f"❌ Error en demo: {e}")
    finally:
        await client.disconnect()

if __name__ == "__main__":
    async def main():
        await demo_python_server()
        await demo_typescript_server()
    
    asyncio.run(main())

