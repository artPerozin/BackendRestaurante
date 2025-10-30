import DashboardRepositoryInterface from "../../domain/Interfaces/DashboardRepositoryInterface";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import DeliveryLocationsChartInput from "./DeliveryLocationsChartInput";
import DeliveryLocationsChartOutput from "./DeliveryLocationsChartOutput";

export default class DeliveryLocationsChart {

    readonly dashboard: DashboardRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.dashboard = repositoryFactory.createDashboardRepository();
    }

    async execute(input: DeliveryLocationsChartInput): Promise<DeliveryLocationsChartOutput> {
        const data = await this.dashboard.getDeliveryLocations(input.days);
        if (!data || data.length === 0) {
            throw new Error("Sem dados para query");
        }
        return { data };
    }
}