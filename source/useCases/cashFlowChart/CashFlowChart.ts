import { TemporalInputDto } from "../../domain/DTO/TemporalInputDto";
import DashboardRepositoryInterface from "../../domain/Interfaces/DashboardRepositoryInterface";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import CashFlowChartInput from "./CashFlowChartInput";
import CashFlowChartOutput from "./CashFlowChartOutput";

export default class CashFlowChart {

    readonly dashboard: DashboardRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.dashboard = repositoryFactory.createDashboardRepository();
    }

    async execute(input: CashFlowChartInput): Promise<CashFlowChartOutput> {
        const data = await this.dashboard.getCashFlow(input);
        if (!data || data.length === 0) {
            throw new Error("Sem dados para query");
        }
        return { data };
    }
}