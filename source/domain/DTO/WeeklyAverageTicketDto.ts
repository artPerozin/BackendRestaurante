export class WeeklyAverageTicketDTO {
    readonly ticket_medio: number;

    constructor(data: any) {
        this.ticket_medio = Number(data.ticket_medio);
    }
}