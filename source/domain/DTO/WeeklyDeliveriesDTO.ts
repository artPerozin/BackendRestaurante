export class WeeklyDeliveriesDTO {
    readonly total_deliveries: number;

    constructor(data: any) {
        this.total_deliveries = Number(data.total_deliveries);
    }
}