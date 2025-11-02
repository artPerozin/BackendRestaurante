import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

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
  apis: [
    path.join(__dirname, "./routes/*.js"),  // Arquivos compilados na mesma estrutura
    path.join(__dirname, "../swagger/routes/*.js"),  // Caso esteja um nível acima
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
