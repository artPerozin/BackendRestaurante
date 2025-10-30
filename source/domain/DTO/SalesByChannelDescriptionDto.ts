export class SalesByChannelDescriptionDTO {
    description: string;
    totalSales: number;

    constructor(data: any) {
        this.description = data.description;
        this.totalSales = Number(data.total_sales) || 0;
    }
}
