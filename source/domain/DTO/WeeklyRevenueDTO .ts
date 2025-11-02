export class WeeklyRevenueDTO {
    readonly faturamento: number;

    constructor(data: any) {
        this.faturamento = Number(data.faturamento);
    }
}