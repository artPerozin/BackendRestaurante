import DashboardRepositoryInterface from "../../domain/Interfaces/DashboardRepositoryInterface";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import SalesByChannelTypeChartInput from "./SalesByChannelTypeChartInput";
import SalesByChannelTypeChartOutput from "./SalesByChannelTypeChartOutput";

export default class SalesByChannelTypeChart {

    readonly dashboard: DashboardRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.dashboard = repositoryFactory.createDashboardRepository();
    }

    async execute(input: SalesByChannelTypeChartInput): Promise<SalesByChannelTypeChartOutput> {
        const data = await this.dashboard.getSalesByChannelType(input.days);
        if (!data || data.length === 0) {
            throw new Error("Sem dados para query");
        }
        return { data };
    }
}