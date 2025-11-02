import DashboardRepositoryInterface from "../../domain/Interfaces/DashboardRepositoryInterface";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import SalesByChannelDescriptionChartInput from "./SalesByChannelDescriptionChartInput";
import SalesByChannelDescriptionChartOutput from "./SalesByChannelDescriptionChartOutput";

export default class SalesByChannelDescriptionChart {

    readonly dashboard: DashboardRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.dashboard = repositoryFactory.createDashboardRepository();
    }

    async execute(input: SalesByChannelDescriptionChartInput): Promise<SalesByChannelDescriptionChartOutput> {
        const data = await this.dashboard.getSalesByChannelDescription(input.data);
        if (!data || data.length === 0) {
            throw new Error("Sem dados para query");
        }
        return { data };
    }
}