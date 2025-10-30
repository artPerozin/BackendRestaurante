export class CustomerRetentionDTO {
    readonly status: string;
    readonly quantidade: number;

    constructor(data: any) {
        this.status = data.status;
        this.quantidade = Number(data.quantidade);
    }
}
