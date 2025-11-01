    import swaggerJSDoc from "swagger-jsdoc";

    const swaggerDefinition = {
        openapi: "3.0.0",
        info: {
          title: "API Dashboard",
          version: "1.0.0",
          description: "Documentação da API gerada com Swagger",
        },
        servers: [
          {
            url: "http://localhost:8000",
            description: "Servidor local",
          },
        ],
    };

    const options = {
      swaggerDefinition,
      apis: ["./source/infra/http/Routes/*.ts", "./source/infra/http/Routes/DashboardRoutesSwagger.ts"],
    };

export const swaggerSpec = swaggerJSDoc(options);
