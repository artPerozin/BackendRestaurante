export class CashFlowByDayDTO {
    day: Date;
    totalSales: number;
    totalValuePaid: number;
    averageTicket: number;

    constructor(data: any) {
        this.day = new Date(data.day);
        this.totalSales = Number(data.total_sales) || 0;
        this.totalValuePaid = Number(data.total_value_paid) || 0;
        this.averageTicket = Number(data.average_ticket) || 0;
    }
}
