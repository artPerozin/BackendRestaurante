import DashboardRepositoryInterface from "../../domain/Interfaces/DashboardRepositoryInterface";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import WeeklyAverageTicketOutput from "./WeeklyAverageTicketOutput";

export default class WeeklyAverageTicket {

    readonly dashboard: DashboardRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.dashboard = repositoryFactory.createDashboardRepository();
    }

    async execute(): Promise<WeeklyAverageTicketOutput> {
        const data = await this.dashboard.getWeeklyAverageTicket();
        if (!data || data.length === 0) {
            throw new Error("Sem dados para query");
        }
        return { data };
    }
}