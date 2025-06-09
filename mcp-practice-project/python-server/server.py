#!/usr/bin/env python3
#Punto de entrada del servidor MCP Python#

import asyncio
from src.mcp_server.main import main

if __name__ == "__main__":
    asyncio.run(main())
