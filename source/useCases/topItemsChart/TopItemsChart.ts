import DashboardRepositoryInterface from "../../domain/Interfaces/DashboardRepositoryInterface";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import TopItemsChartInput from "./TopItemsChartInput";
import TopItemsChartOutput from "./TopItemsChartOutput";

export default class TopItemsChart {

    readonly dashboard: DashboardRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.dashboard = repositoryFactory.createDashboardRepository();
    }

    async execute(input: TopItemsChartInput): Promise<TopItemsChartOutput> {
        const data = await this.dashboard.getTopItems(input.data);
        if (!data || data.length === 0) {
            throw new Error("Sem dados para query");
        }
        return { data };
    }
}