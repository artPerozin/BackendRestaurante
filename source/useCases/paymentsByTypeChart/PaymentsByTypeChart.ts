import DashboardRepositoryInterface from "../../domain/Interfaces/DashboardRepositoryInterface";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import PaymentsByTypeChartInput from "./PaymentsByTypeChartInput";
import PaymentsByTypeChartOutput from "./PaymentsByTypeChartOutput";

export default class PaymentsByTypeChartChart {

    readonly dashboard: DashboardRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.dashboard = repositoryFactory.createDashboardRepository();
    }

    async execute(input: PaymentsByTypeChartInput): Promise<PaymentsByTypeChartOutput> {
        const data = await this.dashboard.getPaymentsByType(input);
        if (!data || data.length === 0) {
            throw new Error("Sem dados para query");
        }
        return { data };
    }
}