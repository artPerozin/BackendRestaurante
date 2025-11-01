import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import Http from "./Http";
import DashboardRoutes from "./Routes/DashboardRoutes";
import SwaggerRoutes from "./Routes/SwaggerRoutes";
export default class Router {

	protected dashboardRoutes: DashboardRoutes;
	protected swaggerRoutes: SwaggerRoutes;

	constructor(readonly http: Http, readonly repositoryFactory: RepositoryFactoryInterface) {
		this.dashboardRoutes = new DashboardRoutes(this.http, this.repositoryFactory);
		this.swaggerRoutes = new SwaggerRoutes(this.http);
	}

	init() {
		this.http.route("get", "/", true, async (params: any, body: any) => {
			return {
				message: "welcome"
			}
		});
		this.dashboardRoutes.init();
		this.swaggerRoutes.init();
	}
}