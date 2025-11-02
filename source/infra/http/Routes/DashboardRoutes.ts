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

        this.http.route("get", "/dashboard/performanceByRegionChart", false, async () => {
            return this.dashboardController.performanceByRegionChart();
        });

        this.http.route("post", "/dashboard/salesByChannelDescriptionChart", false, async (params: any, body: any) => {
            return this.dashboardController.salesByChannelDescriptionChart(body);
        });

        this.http.route("post", "/dashboard/topItemsChart", false, async (params: any, body: any) => {
            return this.dashboardController.topItemsChart(body);
        });
        
        this.http.route("post", "/dashboard/customerRetention", false, async (params: any, body: any) => {
            return this.dashboardController.customerRetention(body);
        });

        this.http.route("get", "/dashboard/weeklyAverageTicket", false, async () => {
            return this.dashboardController.weeklyAverageTicket();
        });

        this.http.route("get", "/dashboard/weeklyRevenue", false, async () => {
            return this.dashboardController.weeklyRevenue();
        });

        this.http.route("get", "/dashboard/weeklyDeliveries", false, async () => {
            return this.dashboardController.weeklyDeliveries();
        });
    }
}
