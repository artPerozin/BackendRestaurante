export class CashFlowByDayDTO {
    day: Date;
    totalSalesAmount: number;
    totalValuePaid: number;
    totalDiscount: number;
    totalIncrease: number;
    totalDeliveryFee: number;
    totalServiceTaxFee: number;
    averageTicket: number;

    constructor(data: any) {
        this.day = new Date(data.day);
        this.totalSalesAmount = parseFloat(data.total_sales_amount) || 0;
        this.totalValuePaid = parseFloat(data.total_value_paid) || 0;
        this.totalDiscount = parseFloat(data.total_discount) || 0;
        this.totalIncrease = parseFloat(data.total_increase) || 0;
        this.totalDeliveryFee = parseFloat(data.total_delivery_fee) || 0;
        this.totalServiceTaxFee = parseFloat(data.total_service_tax_fee) || 0;
        this.averageTicket = parseFloat(data.average_ticket) || 0;
    }
}
