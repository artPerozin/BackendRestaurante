import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../swagger/swagger.config";
import Http from "../Http";
import ModelRoutes from "./ModelRoutes";

export default class SwaggerRoutes implements ModelRoutes {
  constructor(private http: Http) {}

  init(): void {
    const app = (this.http as any).app;

    if (!app) {
      console.error("❌ Não foi possível acessar o app Express dentro de Http.");
      return;
    }

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("📘 Swagger UI disponível em: http://localhost/api-docs");
  }
}
