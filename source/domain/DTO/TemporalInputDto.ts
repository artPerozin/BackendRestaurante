export class TemporalInputDto {
    readonly start_date: string;
    readonly end_date: string;

    constructor(data: any) {
        this.start_date = data.start_date;
        this.end_date = data.end_date;
    }
}