import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import Http from "./Http";
import DashboardRoutes from "./Routes/DashboardRoutes";
export default class Router {

	protected dashboardRoutes: DashboardRoutes;

	constructor(readonly http: Http, readonly repositoryFactory: RepositoryFactoryInterface) {
		this.dashboardRoutes = new DashboardRoutes(this.http, this.repositoryFactory);
	}

	init() {
		this.http.route("get", "/", true, async (params: any, body: any) => {
			return {
				message: "welcome"
			}
		});
		this.dashboardRoutes.init();
	}
}