export class SalesByChannelTypeDTO {
    type: string;
    channelType: string;
    totalSales: number;

    constructor(data: any) {
        this.type = data.type;
        this.channelType = data.channel_type;
        this.totalSales = Number(data.total_sales) || 0;
    }
}
