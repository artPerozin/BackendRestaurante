import RepositoryFactory from "../../../domain/Interfaces/RepositoryFactoryInterface";
import DashboardController from "../../controller/DashboardController";
import Http from "../Http";
import ModelRoutes from "./ModelRoutes";

export default class DashboardRoutes implements ModelRoutes {

    protected dashboardController: DashboardController;

    constructor(readonly http: Http, repositoryFactory: RepositoryFactory) {
        this.dashboardController = new DashboardController(repositoryFactory);
    }

    init(): void {
        this.http.route("post", "/dashboard/cashFlowChart", false, async (params: any, body: any) => {
            return await this.dashboardController.cashFlowChart(body);
        });

        this.http.route("post", "/dashboard/deliveryLocationsChart", false, async (params: any, body: any) => {
            return this.dashboardController.deliveryLocationsChart(body);
        });

        this.http.route("post", "/dashboard/paymentsByTypeChart", false, async (params: any, body: any) => {
            return this.dashboardController.paymentsByTypeChart(body);
        });

        this.http.route("post", "/dashboard/performanceByRegionChart", false, async (params: any, body: any) => {
            return this.dashboardController.performanceByRegionChart(body);
        });

        this.http.route("post", "/dashboard/salesByChannelDescriptionChart", false, async (params: any, body: any) => {
            return this.dashboardController.salesByChannelDescriptionChart(body);
        });

        this.http.route("post", "/dashboard/salesByChannelTypeChart", false, async (params: any, body: any) => {
            return this.dashboardController.salesByChannelTypeChart(body);
        });

        this.http.route("post", "/dashboard/topItemsChart", false, async (params: any, body: any) => {
            return this.dashboardController.topItemsChart(body);
        });
    }
}