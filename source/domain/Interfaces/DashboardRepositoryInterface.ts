import { CashFlowByDayDTO } from "../DTO/CashFlowByDayDto";
import { DeliveryLocationDTO } from "../DTO/DeliveryLocationDto";
import { PaymentsByTypeDTO } from "../DTO/PaymentsByTypeDto";
import { RegionPerformanceDTO } from "../DTO/RegionPerformanceDto";
import { SalesByChannelDescriptionDTO } from "../DTO/SalesByChannelDescriptionDto";
import { SalesByChannelTypeDTO } from "../DTO/SalesByChannelTypeDto";
import { TopItemDTO } from "../DTO/TopItemDto";
import { TemporalEnum } from "../Enums/TemporalEnum";

export default interface DashboardRepositoryInterface {
    getPerformanceByRegion(days: TemporalEnum): Promise<RegionPerformanceDTO[]>
    getTopItems(days: TemporalEnum): Promise<TopItemDTO[]>
    getDeliveryLocations(days: TemporalEnum): Promise<DeliveryLocationDTO[]>
    getCashFlow(days: TemporalEnum): Promise<CashFlowByDayDTO[]>
    getSalesByChannelType(days: TemporalEnum): Promise<SalesByChannelTypeDTO[]>
    getSalesByChannelDescription(days: TemporalEnum): Promise<SalesByChannelDescriptionDTO[]>
    getPaymentsByType(days: TemporalEnum): Promise<PaymentsByTypeDTO[]>
}
