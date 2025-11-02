import { SalesByChannelTypeDTO } from "../source/domain/DTO/SalesByChannelTypeDto";
import { TemporalInputDto } from "../source/domain/DTO/TemporalInputDto";
import DashboardRepositoryInterface from "../source/domain/Interfaces/DashboardRepositoryInterface";
import RepositoryFactoryInterface from "../source/domain/Interfaces/RepositoryFactoryInterface";
import SalesByChannelTypeChart from "../source/useCases/salesByChannelTypeChart/SalesByChannelTypeChart";
import SalesByChannelTypeChartInput from "../source/useCases/salesByChannelTypeChart/SalesByChannelTypeChartInput";

describe("SalesByChannelTypeChart", () => {
    let useCase: SalesByChannelTypeChart;
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
            getCustomerRetention: jest.fn(),
            getPaymentsByType: jest.fn(),
        };

        mockRepositoryFactory = {
            createDashboardRepository: jest.fn().mockReturnValue(mockDashboardRepository),
        } as any;

        useCase = new SalesByChannelTypeChart(mockRepositoryFactory);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("execute", () => {
        it("deve retornar vendas por tipo de canal quando houver resultados", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const mockSalesData: SalesByChannelTypeDTO[] = [
                new SalesByChannelTypeDTO({
                    type: "D",
                    channel_type: "Delivery",
                    total_sales: 850,
                }),
                new SalesByChannelTypeDTO({
                    type: "P",
                    channel_type: "Presencial",
                    total_sales: 350,
                }),
            ];

            mockDashboardRepository.getSalesByChannelType.mockResolvedValue(mockSalesData);

            const result = await useCase.execute(period);

            expect(mockRepositoryFactory.createDashboardRepository).toHaveBeenCalledTimes(1);
            expect(mockDashboardRepository.getSalesByChannelType).toHaveBeenCalledWith(period);
            expect(mockDashboardRepository.getSalesByChannelType).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ data: mockSalesData });
            expect(result.data).toHaveLength(2);
        });

        it("deve lançar erro quando não houver dados (array vazio)", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            mockDashboardRepository.getSalesByChannelType.mockResolvedValue([]);

            await expect(useCase.execute(period)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getSalesByChannelType).toHaveBeenCalledWith(period);
            expect(mockDashboardRepository.getSalesByChannelType).toHaveBeenCalledTimes(1);
        });

        it("deve lançar erro quando retornar null", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            mockDashboardRepository.getSalesByChannelType.mockResolvedValue(null as any);

            await expect(useCase.execute(period)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getSalesByChannelType).toHaveBeenCalledWith(period);
        });

        it("deve lançar erro quando retornar undefined", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            mockDashboardRepository.getSalesByChannelType.mockResolvedValue(undefined as any);

            await expect(useCase.execute(period)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getSalesByChannelType).toHaveBeenCalledWith(period);
        });

        it("deve propagar erro do repository", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const dbError = new Error("Database connection failed");
            mockDashboardRepository.getSalesByChannelType.mockRejectedValue(dbError);

            await expect(useCase.execute(period)).rejects.toThrow("Database connection failed");
            expect(mockDashboardRepository.getSalesByChannelType).toHaveBeenCalledWith(period);
        });

        it("deve validar mapeamento de tipos de canal (D = Delivery, P = Presencial)", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-06-01 00:00:00",
                end_date: "2024-06-30 23:59:59",
            });

            const mockSalesData: SalesByChannelTypeDTO[] = [
                new SalesByChannelTypeDTO({
                    type: "D",
                    channel_type: "Delivery",
                    total_sales: 600,
                }),
                new SalesByChannelTypeDTO({
                    type: "P",
                    channel_type: "Presencial",
                    total_sales: 400,
                }),
            ];

            mockDashboardRepository.getSalesByChannelType.mockResolvedValue(mockSalesData);

            const result = await useCase.execute(period);

            expect(result.data[0].type).toBe("D");
            expect(result.data[0].channelType).toBe("Delivery");
            expect(result.data[1].type).toBe("P");
            expect(result.data[1].channelType).toBe("Presencial");
        });

        it("deve retornar tipos ordenados por total de vendas (maior para menor)", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const mockSalesData: SalesByChannelTypeDTO[] = [
                new SalesByChannelTypeDTO({
                    type: "D",
                    channel_type: "Delivery",
                    total_sales: 1000,
                }),
                new SalesByChannelTypeDTO({
                    type: "P",
                    channel_type: "Presencial",
                    total_sales: 500,
                }),
            ];

            mockDashboardRepository.getSalesByChannelType.mockResolvedValue(mockSalesData);

            const result = await useCase.execute(period);

            expect(result.data[0].totalSales).toBeGreaterThanOrEqual(result.data[1].totalSales);
        });

        it("deve processar apenas tipo Delivery quando não houver vendas presenciais", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const mockSalesData: SalesByChannelTypeDTO[] = [
                new SalesByChannelTypeDTO({
                    type: "D",
                    channel_type: "Delivery",
                    total_sales: 750,
                }),
            ];

            mockDashboardRepository.getSalesByChannelType.mockResolvedValue(mockSalesData);

            const result = await useCase.execute(period);

            expect(result.data).toHaveLength(1);
            expect(result.data[0].type).toBe("D");
            expect(result.data[0].channelType).toBe("Delivery");
            expect(result.data[0].totalSales).toBe(750);
        });
    });
});