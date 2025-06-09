#!/usr/bin/env python3
#========================================================== 
#                      Servidor MCP                         
#===========================================================

import asyncio
import json
from typing import Any, Dict, List, Optional
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import (
    CallToolResult,
    ListToolsResult,
    Tool,
    TextContent,
    GetPromptResult,
    ListPromptsResult,
    Prompt,
    PromptArgument,
    GetResourceResult,
    ListResourcesResult,
    Resource,
    ResourceContents,
)
import httpx
from datetime import datetime

# Crear instancia del servidor
server = Server("python-mcp-server")

# ========== HERRAMIENTAS ==========

@server.list_tools()
async def list_tools() -> ListToolsResult:
    """Lista todas las herramientas disponibles"""
    return ListToolsResult(
        tools=[
            Tool(
                name="get_time",
                description="Obtiene la fecha y hora actual",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "format": {
                            "type": "string",
                            "description": "Formato de fecha (iso, readable)",
                            "default": "readable"
                        }
                    }
                }
            ),
            Tool(
                name="http_request",
                description="Realiza una petición HTTP GET",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "url": {
                            "type": "string",
                            "description": "URL para la petición HTTP"
                        }
                    },
                    "required": ["url"]
                }
            ),
            Tool(
                name="calculate",
                description="Realiza cálculos matemáticos básicos",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "expression": {
                            "type": "string",
                            "description": "Expresión matemática a evaluar"
                        }
                    },
                    "required": ["expression"]
                }
            )
        ]
    )

@server.call_tool()
async def call_tool(name: str, arguments: Dict[str, Any]) -> CallToolResult:
    """Ejecuta una herramienta específica"""
    
    if name == "get_time":
        format_type = arguments.get("format", "readable")
        now = datetime.now()
        
        if format_type == "iso":
            time_str = now.isoformat()
        else:
            time_str = now.strftime("%Y-%m-%d %H:%M:%S")
            
        return CallToolResult(
            content=[TextContent(type="text", text=f"Fecha y hora actual: {time_str}")]
        )
    
    elif name == "http_request":
        url = arguments["url"]
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url)
                return CallToolResult(
                    content=[TextContent(
                        type="text", 
                        text=f"Status: {response.status_code}\nContent: {response.text[:500]}..."
                    )]
                )
        except Exception as e:
            return CallToolResult(
                content=[TextContent(type="text", text=f"Error: {str(e)}")]
            )
    
    elif name == "calculate":
        expression = arguments["expression"]
        try:
            # Evaluación básica y segura
            allowed_chars = set("0123456789+-*/().")
            if not all(c in allowed_chars or c.isspace() for c in expression):
                raise ValueError("Caracteres no permitidos en la expresión")
            
            result = eval(expression)
            return CallToolResult(
                content=[TextContent(type="text", text=f"Resultado: {result}")]
            )
        except Exception as e:
            return CallToolResult(
                content=[TextContent(type="text", text=f"Error en cálculo: {str(e)}")]
            )
    
    else:
        return CallToolResult(
            content=[TextContent(type="text", text=f"Herramienta desconocida: {name}")]
        )

# ========== PROMPTS ==========

@server.list_prompts()
async def list_prompts() -> ListPromptsResult:
    """Lista todos los prompts disponibles"""
    return ListPromptsResult(
        prompts=[
            Prompt(
                name="code_review",
                description="Genera un prompt para revisión de código",
                arguments=[
                    PromptArgument(
                        name="language",
                        description="Lenguaje de programación",
                        required=True
                    ),
                    PromptArgument(
                        name="code",
                        description="Código a revisar",
                        required=True
                    )
                ]
            ),
            Prompt(
                name="explain_concept",
                description="Genera un prompt para explicar conceptos técnicos",
                arguments=[
                    PromptArgument(
                        name="concept",
                        description="Concepto a explicar",
                        required=True
                    ),
                    PromptArgument(
                        name="level",
                        description="Nivel de experiencia (beginner, intermediate, advanced)",
                        required=False
                    )
                ]
            )
        ]
    )

@server.get_prompt()
async def get_prompt(name: str, arguments: Dict[str, str]) -> GetPromptResult:
    """Obtiene un prompt específico"""
    
    if name == "code_review":
        language = arguments["language"]
        code = arguments["code"]
        
        prompt_text = f"""Por favor, revisa este código en {language}:

```{language}
{code}
```

Evalúa:
1. Legibilidad y estilo
2. Posibles bugs o problemas
3. Rendimiento
4. Mejores prácticas
5. Sugerencias de mejora

Proporciona feedback constructivo y específico."""

        return GetPromptResult(
            description=f"Revisión de código en {language}",
            messages=[
                {
                    "role": "user",
                    "content": {
                        "type": "text",
                        "text": prompt_text
                    }
                }
            ]
        )
    
    elif name == "explain_concept":
        concept = arguments["concept"]
        level = arguments.get("level", "intermediate")
        
        prompt_text = f"""Explica el concepto "{concept}" para alguien con nivel {level}.

Incluye:
1. Definición clara y concisa
2. Ejemplos prácticos
3. Casos de uso comunes
4. Conceptos relacionados
5. Recursos adicionales para profundizar

Adapta el lenguaje y la profundidad al nivel especificado."""

        return GetPromptResult(
            description=f"Explicación de {concept} (nivel {level})",
            messages=[
                {
                    "role": "user",
                    "content": {
                        "type": "text",
                        "text": prompt_text
                    }
                }
            ]
        )
    
    else:
        raise ValueError(f"Prompt desconocido: {name}")

# ========== RECURSOS ==========

@server.list_resources()
async def list_resources() -> ListResourcesResult:
    """Lista todos los recursos disponibles"""
    return ListResourcesResult(
        resources=[
            Resource(
                uri="file://config.json",
                name="Configuración del servidor",
                description="Archivo de configuración en JSON",
                mimeType="application/json"
            ),
            Resource(
                uri="file://README.md",
                name="Documentación",
                description="Documentación del servidor MCP",
                mimeType="text/markdown"
            )
        ]
    )

@server.get_resource()
async def get_resource(uri: str) -> GetResourceResult:
    """Obtiene un recurso específico"""
    
    if uri == "file://config.json":
        config = {
            "server_name": "python-mcp-server",
            "version": "0.1.0",
            "capabilities": ["tools", "prompts", "resources"],
            "tools_enabled": ["get_time", "http_request", "calculate"]
        }
        
        return GetResourceResult(
            contents=[
                ResourceContents(
                    uri=uri,
                    mimeType="application/json",
                    text=json.dumps(config, indent=2)
                )
            ]
        )
    
    elif uri == "file://README.md":
        readme_content = """# Servidor MCP Python

Este es un servidor MCP de ejemplo que demuestra:

## Herramientas disponibles
- `get_time`: Obtiene fecha y hora actual
- `http_request`: Realiza peticiones HTTP GET
- `calculate`: Realiza cálculos matemáticos básicos

## Prompts disponibles
- `code_review`: Genera prompts para revisión de código
- `explain_concept`: Genera prompts para explicar conceptos técnicos

## Recursos disponibles
- `config.json`: Configuración del servidor
- `README.md`: Esta documentación

## Uso
```bash
python -m mcp_server.main
```
"""
        
        return GetResourceResult(
            contents=[
                ResourceContents(
                    uri=uri,
                    mimeType="text/markdown",
                    text=readme_content
                )
            ]
        )
    
    else:
        raise ValueError(f"Recurso no encontrado: {uri}")

async def main():
    """Función principal del servidor"""
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options()
        )

if __name__ == "__main__":
    asyncio.run(main())
