import RepositoryFactory from "../../../domain/Interfaces/RepositoryFactoryInterface";
import DashboardController from "../../controller/DashboardController";
import Http from "../Http";
import ModelRoutes from "./ModelRoutes";

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Endpoints para gráficos e métricas do dashboard
 */
export default class DashboardRoutes implements ModelRoutes {
    protected dashboardController: DashboardController;

    constructor(readonly http: Http, repositoryFactory: RepositoryFactory) {
        this.dashboardController = new DashboardController(repositoryFactory);
    }

    init(): void {
        /**
         * @swagger
         * /dashboard/cashFlowChart:
         *   post:
         *     summary: Retorna o gráfico de fluxo de caixa
         *     tags: [Dashboard]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               startDate:
         *                 type: string
         *                 format: date
         *               endDate:
         *                 type: string
         *                 format: date
         *     responses:
         *       200:
         *         description: Dados do gráfico de fluxo de caixa
         *       422:
         *         description: Erro de validação
         */
        this.http.route("post", "/dashboard/cashFlowChart", false, async (params: any, body: any) => {
            return await this.dashboardController.cashFlowChart(body);
        });

        /**
         * @swagger
         * /dashboard/deliveryLocationsChart:
         *   post:
         *     summary: Retorna o gráfico de entregas por localidade
         *     tags: [Dashboard]
         *     responses:
         *       200:
         *         description: Dados do gráfico de entregas
         *       422:
         *         description: Erro de validação
         */
        this.http.route("post", "/dashboard/deliveryLocationsChart", false, async (params: any, body: any) => {
            return this.dashboardController.deliveryLocationsChart(body);
        });

        /**
         * @swagger
         * /dashboard/paymentsByTypeChart:
         *   post:
         *     summary: Retorna o gráfico de pagamentos por tipo
         *     tags: [Dashboard]
         *     responses:
         *       200:
         *         description: Dados do gráfico de pagamentos
         *       422:
         *         description: Erro de validação
         */
        this.http.route("post", "/dashboard/paymentsByTypeChart", false, async (params: any, body: any) => {
            return this.dashboardController.paymentsByTypeChart(body);
        });

        /**
         * @swagger
         * /dashboard/performanceByRegionChart:
         *   post:
         *     summary: Retorna o gráfico de desempenho por região
         *     tags: [Dashboard]
         *     responses:
         *       200:
         *         description: Dados do gráfico de desempenho regional
         *       422:
         *         description: Erro de validação
         */
        this.http.route("post", "/dashboard/performanceByRegionChart", false, async (params: any, body: any) => {
            return this.dashboardController.performanceByRegionChart(body);
        });

        /**
         * @swagger
         * /dashboard/salesByChannelDescriptionChart:
         *   post:
         *     summary: Retorna o gráfico de vendas por descrição de canal
         *     tags: [Dashboard]
         *     responses:
         *       200:
         *         description: Dados do gráfico de vendas por descrição de canal
         *       422:
         *         description: Erro de validação
         */
        this.http.route("post", "/dashboard/salesByChannelDescriptionChart", false, async (params: any, body: any) => {
            return this.dashboardController.salesByChannelDescriptionChart(body);
        });

        /**
         * @swagger
         * /dashboard/salesByChannelTypeChart:
         *   post:
         *     summary: Retorna o gráfico de vendas por tipo de canal
         *     tags: [Dashboard]
         *     responses:
         *       200:
         *         description: Dados do gráfico de vendas por tipo de canal
         *       422:
         *         description: Erro de validação
         */
        this.http.route("post", "/dashboard/salesByChannelTypeChart", false, async (params: any, body: any) => {
            return this.dashboardController.salesByChannelTypeChart(body);
        });

        /**
         * @swagger
         * /dashboard/topItemsChart:
         *   post:
         *     summary: Retorna os itens mais vendidos
         *     tags: [Dashboard]
         *     responses:
         *       200:
         *         description: Lista dos itens mais vendidos
         *       422:
         *         description: Erro de validação
         */
        this.http.route("post", "/dashboard/topItemsChart", false, async (params: any, body: any) => {
            return this.dashboardController.topItemsChart(body);
        });
    }
}
