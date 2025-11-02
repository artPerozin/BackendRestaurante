import { CashFlowByDayDTO } from "../source/domain/DTO/CashFlowByDayDto";
import { TemporalInputDto } from "../source/domain/DTO/TemporalInputDto";
import DashboardRepositoryInterface from "../source/domain/Interfaces/DashboardRepositoryInterface";
import RepositoryFactoryInterface from "../source/domain/Interfaces/RepositoryFactoryInterface";
import CashFlowChart from "../source/useCases/cashFlowChart/CashFlowChart";
import CashFlowChartInput from "../source/useCases/cashFlowChart/CashFlowChartInput";

describe("CashFlowChart", () => {
    let useCase: CashFlowChart;
    let mockDashboardRepository: jest.Mocked<DashboardRepositoryInterface>;
    let mockRepositoryFactory: jest.Mocked<RepositoryFactoryInterface>;

    beforeEach(() => {
        mockDashboardRepository = {
            getCashFlow: jest.fn(),
            getPerformanceByRegion: jest.fn(),
            getTopItems: jest.fn(),
            getDeliveryLocations: jest.fn(),
            getSalesByChannelType: jest.fn(),
            getSalesByChannelDescription: jest.fn(),
            getPaymentsByType: jest.fn(),
            getCustomerRetention: jest.fn()
        };

        mockRepositoryFactory = {
            createDashboardRepository: jest.fn().mockReturnValue(mockDashboardRepository),
        } as any;

        useCase = new CashFlowChart(mockRepositoryFactory);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("execute", () => {
        it("deve retornar dados de cash flow quando houver resultados", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const mockCashFlowData: CashFlowByDayDTO[] = [
                new CashFlowByDayDTO({
                    day: "2024-01-01",
                    total_sales_amount: 1000,
                    total_value_paid: 950,
                    total_discount: 50,
                    total_increase: 0,
                    total_delivery_fee: 100,
                    total_service_tax_fee: 50,
                    average_ticket: 95,
                }),
                new CashFlowByDayDTO({
                    day: "2024-01-02",
                    total_sales_amount: 1500,
                    total_value_paid: 1450,
                    total_discount: 50,
                    total_increase: 0,
                    total_delivery_fee: 150,
                    total_service_tax_fee: 75,
                    average_ticket: 145,
                }),
            ];

            mockDashboardRepository.getCashFlow.mockResolvedValue(mockCashFlowData);

            const result = await useCase.execute(period);

            expect(mockRepositoryFactory.createDashboardRepository).toHaveBeenCalledTimes(1);
            expect(mockDashboardRepository.getCashFlow).toHaveBeenCalledWith(period);
            expect(mockDashboardRepository.getCashFlow).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ data: mockCashFlowData });
            expect(result.data).toHaveLength(2);
        });

        it("deve lançar erro quando não houver dados (array vazio)", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            mockDashboardRepository.getCashFlow.mockResolvedValue([]);

            await expect(useCase.execute(period)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getCashFlow).toHaveBeenCalledWith(period);
            expect(mockDashboardRepository.getCashFlow).toHaveBeenCalledTimes(1);
        });

        it("deve lançar erro quando retornar null", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            mockDashboardRepository.getCashFlow.mockResolvedValue(null as any);

            await expect(useCase.execute(period)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getCashFlow).toHaveBeenCalledWith(period);
        });

        it("deve lançar erro quando retornar undefined", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            mockDashboardRepository.getCashFlow.mockResolvedValue(undefined as any);

            await expect(useCase.execute(period)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getCashFlow).toHaveBeenCalledWith(period);
        });

        it("deve propagar erro do repository", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const dbError = new Error("Database connection failed");
            mockDashboardRepository.getCashFlow.mockRejectedValue(dbError);

            await expect(useCase.execute(period)).rejects.toThrow("Database connection failed");
            expect(mockDashboardRepository.getCashFlow).toHaveBeenCalledWith(period);
        });

        it("deve funcionar com diferentes períodos de datas", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-06-01 00:00:00",
                end_date: "2024-06-30 23:59:59",
            });

            const mockCashFlowData: CashFlowByDayDTO[] = [
                new CashFlowByDayDTO({
                    day: "2024-06-15",
                    total_sales_amount: 2000,
                    total_value_paid: 1900,
                    total_discount: 100,
                    total_increase: 0,
                    total_delivery_fee: 200,
                    total_service_tax_fee: 100,
                    average_ticket: 190,
                }),
            ];

            mockDashboardRepository.getCashFlow.mockResolvedValue(mockCashFlowData);

            const result = await useCase.execute(period);

            expect(mockDashboardRepository.getCashFlow).toHaveBeenCalledWith(period);
            expect(result.data).toEqual(mockCashFlowData);
            expect(result.data[0].day).toEqual(mockCashFlowData[0].day);
            expect(result.data).toHaveLength(1);
        });
    });
});