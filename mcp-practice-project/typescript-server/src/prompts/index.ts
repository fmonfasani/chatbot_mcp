import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

export function setupPrompts(server: Server): void {
  // Listar prompts
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
      prompts: [
        {
          name: "tech_interview",
          description: "Genera preguntas para entrevistas técnicas",
          arguments: [
            {
              name: "role",
              description: "Rol para la entrevista (frontend, backend, fullstack, devops)",
              required: true,
            },
            {
              name: "level",
              description: "Nivel de experiencia (junior, mid, senior)",
              required: true,
            },
            {
              name: "technology",
              description: "Tecnología específica",
              required: false,
            },
          ],
        },
        {
          name: "architecture_review",
          description: "Genera un prompt para revisión de arquitectura",
          arguments: [
            {
              name: "system_type",
              description: "Tipo de sistema (web, mobile, microservices, etc.)",
              required: true,
            },
            {
              name: "scale",
              description: "Escala esperada (small, medium, large)",
              required: true,
            },
          ],
        },
        {
          name: "debug_helper",
          description: "Ayuda a estructurar el proceso de debugging",
          arguments: [
            {
              name: "problem_description",
              description: "Descripción del problema",
              required: true,
            },
            {
              name: "technology_stack",
              description: "Stack tecnológico involucrado",
              required: false,
            },
          ],
        },
      ],
    };
  });

  // Obtener prompt específico
  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "tech_interview": {
        const role = args?.role as string;
        const level = args?.level as string;
        const technology = args?.technology as string;

        let prompt = `Genera preguntas para una entrevista técnica:

**Perfil del candidato:**
- Rol: ${role}
- Nivel: ${level}`;

        if (technology) {
          prompt += `\n- Tecnología específica: ${technology}`;
        }

        prompt += `

**Incluye preguntas sobre:**
1. Conocimientos técnicos fundamentales
2. Experiencia práctica y proyectos
3. Resolución de problemas
4. Arquitectura y diseño
5. Mejores prácticas
6. Situaciones hipotéticas

**Formato:**
- 10-15 preguntas graduales en dificultad
- Incluye preguntas de código cuando sea apropiado
- Proporciona criterios de evaluación para cada pregunta`;

        return {
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: prompt,
              },
            },
          ],
        };
      }

      case "architecture_review": {
        const systemType = args?.system_type as string;
        const scale = args?.scale as string;

        const prompt = `Revisa la arquitectura de un sistema ${systemType} para escala ${scale}:

**Aspectos a evaluar:**

1. **Arquitectura General**
   - Patrones arquitectónicos utilizados
   - Separación de responsabilidades
   - Escalabilidad y mantenibilidad

2. **Componentes Técnicos**
   - Base de datos y persistencia
   - APIs y comunicación entre servicios
   - Autenticación y autorización
   - Manejo de errores y logging

3. **Operaciones**
   - Estrategia de deployment
   - Monitoreo y observabilidad
   - Backup y recuperación
   - Seguridad

4. **Rendimiento**
   - Optimizaciones implementadas
   - Puntos de bottleneck potenciales
   - Estrategias de caching

**Proporciona:**
- Análisis detallado de cada aspecto
- Recomendaciones específicas de mejora
- Alternativas arquitectónicas cuando sea apropiado
- Consideraciones de costos y complejidad`;

        return {
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: prompt,
              },
            },
          ],
        };
      }

      case "debug_helper": {
        const problemDescription = args?.problem_description as string;
        const technologyStack = args?.technology_stack as string;

        let prompt = `Ayuda a debuggear el siguiente problema:

**Descripción del problema:**
${problemDescription}`;

        if (technologyStack) {
          prompt += `\n\n**Stack tecnológico:**
${technologyStack}`;
        }

        prompt += `

**Proceso de debugging sistemático:**

1. **Reproducción del problema**
   - ¿Cómo reproducir el error de manera consistente?
   - ¿En qué condiciones específicas ocurre?

2. **Recolección de información**
   - ¿Qué logs o mensajes de error están disponibles?
   - ¿Qué herramientas de debugging se pueden usar?

3. **Hipótesis iniciales**
   - ¿Cuáles son las causas más probables?
   - ¿Qué componentes están involucrados?

4. **Estrategia de investigación**
   - ¿Qué verificar primero?
   - ¿Cómo aislar el problema?

5. **Solución y prevención**
   - ¿Cómo resolver el problema?
   - ¿Cómo prevenir que ocurra nuevamente?

Proporciona un plan de acción detallado paso a paso.`;

        return {
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: prompt,
              },
            },
          ],
        };
      }

      default:
        throw new Error(`Prompt desconocido: ${name}`);
    }
  });
}
