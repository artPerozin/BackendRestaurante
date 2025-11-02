import DashboardRepositoryInterface from "../../domain/Interfaces/DashboardRepositoryInterface";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import PerformanceByRegionChartInput from "./PerformanceByRegionChartInput";
import PerformanceByRegionChartOutput from "./PerformanceByRegionChartOutput";

export default class PerformanceByRegionChart {

    readonly dashboard: DashboardRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.dashboard = repositoryFactory.createDashboardRepository();
    }

    async execute(input: PerformanceByRegionChartInput): Promise<PerformanceByRegionChartOutput> {
        const data = await this.dashboard.getPerformanceByRegion(input.data);
        if (!data || data.length === 0) {
            throw new Error("Sem dados para query");
        }
        return { data };
    }
}