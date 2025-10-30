export class DeliveryLocationDTO {
    lat: number;
    lng: number;

    constructor(data: any) {
        this.lat = Number(data.lat);
        this.lng = Number(data.lng);
    }
}
