import DashboardRepositoryInterface from "../../domain/Interfaces/DashboardRepositoryInterface";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import CustomerRetentionOutput from "./CustomerRetentionOutput";

export default class CustomerRetention {

    readonly dashboard: DashboardRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.dashboard = repositoryFactory.createDashboardRepository();
    }

    async execute(): Promise<CustomerRetentionOutput> {
        const data = await this.dashboard.getCustomerRetention();
        if (!data || data.length === 0) {
            throw new Error("Sem dados para query");
        }
        return { data };
    }
}