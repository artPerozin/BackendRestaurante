export class RegionPerformanceDTO {
    neighborhood: string;
    city: string;
    deliveries: number;
    avgDeliveryMinutes: number;
    p90DeliveryMinutes: number;

    constructor(data: any) {
        this.neighborhood = data.neighborhood;
        this.city = data.city;
        this.deliveries = Number(data.deliveries) || 0;
        this.avgDeliveryMinutes = Number(data.avg_delivery_minutes) || 0;
        this.p90DeliveryMinutes = Number(data.p90_delivery_minutes) || 0;
    }
}
