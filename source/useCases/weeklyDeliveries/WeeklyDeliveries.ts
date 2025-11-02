import DashboardRepositoryInterface from "../../domain/Interfaces/DashboardRepositoryInterface";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import WeeklyDeliveriesOutput from "./WeeklyDeliveriesOutput";

export default class WeeklyDeliveries {

    readonly dashboard: DashboardRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.dashboard = repositoryFactory.createDashboardRepository();
    }

    async execute(): Promise<WeeklyDeliveriesOutput> {
        const data = await this.dashboard.getWeeklyDeliveries();
        if (!data || data.length === 0) {
            throw new Error("Sem dados para query");
        }
        return { data };
    }
}