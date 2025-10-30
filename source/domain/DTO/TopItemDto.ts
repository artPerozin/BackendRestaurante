export class TopItemDTO {
    item: string;
    timesAdded: number;
    revenueGenerated: number;

    constructor(data: any) {
        this.item = data.item;
        this.timesAdded = Number(data.times_added) || 0;
        this.revenueGenerated = Number(data.revenue_generated) || 0;
    }
}
