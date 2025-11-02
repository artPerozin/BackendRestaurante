import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import CashFlowChart from "../../useCases/cashFlowChart/CashFlowChart";
import CashFlowChartInput from "../../useCases/cashFlowChart/CashFlowChartInput";
import CashFlowChartOutput from "../../useCases/cashFlowChart/CashFlowChartOutput";
import CustomerRetention from "../../useCases/customerRetention/CustomerRetention";
import CustomerRetentionInput from "../../useCases/customerRetention/CustomerRetentionInput";
import CustomerRetentionOutput from "../../useCases/customerRetention/CustomerRetentionOutput";
import DeliveryLocationsChart from "../../useCases/deliveryLocationsChart/DeliveryLocationsChart";
import DeliveryLocationsChartInput from "../../useCases/deliveryLocationsChart/DeliveryLocationsChartInput";
import DeliveryLocationsChartOutput from "../../useCases/deliveryLocationsChart/DeliveryLocationsChartOutput";
import PaymentsByTypeChartChart from "../../useCases/paymentsByTypeChart/PaymentsByTypeChart";
import PaymentsByTypeChartInput from "../../useCases/paymentsByTypeChart/PaymentsByTypeChartInput";
import PaymentsByTypeChartOutput from "../../useCases/paymentsByTypeChart/PaymentsByTypeChartOutput";
import PerformanceByRegionChart from "../../useCases/performanceByRegionChart/PerformanceByRegionChart";
import PerformanceByRegionChartInput from "../../useCases/performanceByRegionChart/PerformanceByRegionChartInput";
import PerformanceByRegionChartOutput from "../../useCases/performanceByRegionChart/PerformanceByRegionChartOutput";
import SalesByChannelDescriptionChart from "../../useCases/salesByChannelDescriptionChart/SalesByChannelDescriptionChart";
import SalesByChannelDescriptionChartInput from "../../useCases/salesByChannelDescriptionChart/SalesByChannelDescriptionChartInput";
import SalesByChannelDescriptionChartOutput from "../../useCases/salesByChannelDescriptionChart/SalesByChannelDescriptionChartOutput";
import SalesByChannelTypeChart from "../../useCases/salesByChannelTypeChart/SalesByChannelTypeChart";
import SalesByChannelTypeChartInput from "../../useCases/salesByChannelTypeChart/SalesByChannelTypeChartInput";
import SalesByChannelTypeChartOutput from "../../useCases/salesByChannelTypeChart/SalesByChannelTypeChartOutput";
import TopItemsChart from "../../useCases/topItemsChart/TopItemsChart";
import TopItemsChartInput from "../../useCases/topItemsChart/TopItemsChartInput";
import TopItemsChartOutput from "../../useCases/topItemsChart/TopItemsChartOutput";
import WeeklyRevenue from "../../useCases/weeklyRevenue/WeeklyRevenue";
import WeeklyRevenueOutput from "../../useCases/weeklyRevenue/WeeklyRevenueOutput";
import WeeklyDeliveries from "../../useCases/weeklyDeliveries/WeeklyDeliveries";
import WeeklyDeliveriesOutput from "../../useCases/weeklyDeliveries/WeeklyDeliveriesOutput";
import WeeklyAverageTicketOutput from "../../useCases/weeklyAvaregeTicket/WeeklyAverageTicketOutput";
import WeeklyAverageTicket from "../../useCases/weeklyAvaregeTicket/WeeklyAverageTicket";

export default class DashboardController {

    constructor(protected repositoryFactory: RepositoryFactoryInterface) {}

    async cashFlowChart(input: CashFlowChartInput): Promise<CashFlowChartOutput> {
        const cashFlowChart = new CashFlowChart(this.repositoryFactory);
        return await cashFlowChart.execute(input);
    }
    
    async deliveryLocationsChart(input: DeliveryLocationsChartInput): Promise<DeliveryLocationsChartOutput> {
        const deliveryLocationsChart = new DeliveryLocationsChart(this.repositoryFactory);
        return await deliveryLocationsChart.execute(input);
    }

    async paymentsByTypeChart(input: PaymentsByTypeChartInput): Promise<PaymentsByTypeChartOutput> {
        const paymentsByTypeChart = new PaymentsByTypeChartChart(this.repositoryFactory);
        return await paymentsByTypeChart.execute(input);
    }

    async performanceByRegionChart(input: PerformanceByRegionChartInput): Promise<PerformanceByRegionChartOutput> {
        const performanceByRegionChart = new PerformanceByRegionChart(this.repositoryFactory);
        return await performanceByRegionChart.execute(input);
    }

    async salesByChannelDescriptionChart(input: SalesByChannelDescriptionChartInput): Promise<SalesByChannelDescriptionChartOutput> {
        const salesByChannelDescriptionChart = new SalesByChannelDescriptionChart(this.repositoryFactory);
        return await salesByChannelDescriptionChart.execute(input);
    }

    async salesByChannelTypeChart(input: SalesByChannelTypeChartInput): Promise<SalesByChannelTypeChartOutput> {
        const salesByChannelTypeChart = new SalesByChannelTypeChart(this.repositoryFactory);
        return await salesByChannelTypeChart.execute(input);
    }
    
    async topItemsChart(input: TopItemsChartInput): Promise<TopItemsChartOutput> {
        const topItemsChart = new TopItemsChart(this.repositoryFactory);
        return await topItemsChart.execute(input);
    }

    async customerRetention(input: CustomerRetentionInput): Promise<CustomerRetentionOutput> {
        const customerRetentionChart = new CustomerRetention(this.repositoryFactory);
        return await customerRetentionChart.execute(input);
    }

    async weeklyAverageTicket(): Promise<WeeklyAverageTicketOutput> {
        const useCase = new WeeklyAverageTicket(this.repositoryFactory);
        return await useCase.execute();
    }

    async weeklyRevenue(): Promise<WeeklyRevenueOutput> {
        const useCase = new WeeklyRevenue(this.repositoryFactory);
        return await useCase.execute();
    }

    async weeklyDeliveries(): Promise<WeeklyDeliveriesOutput> {
        const useCase = new WeeklyDeliveries(this.repositoryFactory);
        return await useCase.execute();
    }
}
