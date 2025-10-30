export class PaymentsByTypeDTO {
    readonly tipo_pagamento: string;
    readonly valor_total: number;

    constructor(data: any) {
        this.tipo_pagamento = data.tipo_pagamento;
        this.valor_total = Number(data.valor_total);
    }
}
