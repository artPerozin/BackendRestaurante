import { CashFlowByDayDTO } from "../DTO/CashFlowByDayDto";
import { DeliveryLocationDTO } from "../DTO/DeliveryLocationDto";
import { PaymentsByTypeDTO } from "../DTO/PaymentsByTypeDto";
import { RegionPerformanceDTO } from "../DTO/RegionPerformanceDto";
import { SalesByChannelDescriptionDTO } from "../DTO/SalesByChannelDescriptionDto";
import { TopItemDTO } from "../DTO/TopItemDto";
import { TemporalInputDto } from "../DTO/TemporalInputDto";
import { CustomerRetentionDTO } from "../DTO/CustomerRetentionDto";
import { WeeklyAverageTicketDTO } from "../DTO/WeeklyAverageTicketDto";
import { WeeklyRevenueDTO } from "../DTO/WeeklyRevenueDTO ";
import { WeeklyDeliveriesDTO } from "../DTO/WeeklyDeliveriesDTO";

export default interface DashboardRepositoryInterface {
    getTopItems(data: TemporalInputDto): Promise<TopItemDTO[]>
    getDeliveryLocations(data: TemporalInputDto): Promise<DeliveryLocationDTO[]>
    getCashFlow(data: TemporalInputDto): Promise<CashFlowByDayDTO[]>
    getSalesByChannelDescription(data: TemporalInputDto): Promise<SalesByChannelDescriptionDTO[]>
    getPaymentsByType(data: TemporalInputDto): Promise<PaymentsByTypeDTO[]>
    getCustomerRetention(data: TemporalInputDto): Promise<CustomerRetentionDTO[]>
    
    getPerformanceByRegion(): Promise<RegionPerformanceDTO[]>
    getWeeklyAverageTicket(): Promise<WeeklyAverageTicketDTO[]>
    getWeeklyRevenue(): Promise<WeeklyRevenueDTO[]>
    getWeeklyDeliveries(): Promise<WeeklyDeliveriesDTO[]>
}
