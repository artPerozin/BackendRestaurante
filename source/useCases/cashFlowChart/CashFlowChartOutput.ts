import { CashFlowByDayDTO } from "../../domain/DTO/CashFlowByDayDto";

export default interface CashFlowChartOutput {
    data: CashFlowByDayDTO[];
}