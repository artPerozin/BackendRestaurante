import { SalesByChannelDescriptionDTO } from "../source/domain/DTO/SalesByChannelDescriptionDto";
import { TemporalInputDto } from "../source/domain/DTO/TemporalInputDto";
import DashboardRepositoryInterface from "../source/domain/Interfaces/DashboardRepositoryInterface";
import RepositoryFactoryInterface from "../source/domain/Interfaces/RepositoryFactoryInterface";
import SalesByChannelDescriptionChart from "../source/useCases/salesByChannelDescriptionChart/SalesByChannelDescriptionChart";
import SalesByChannelDescriptionChartInput from "../source/useCases/salesByChannelDescriptionChart/SalesByChannelDescriptionChartInput";

describe("SalesByChannelDescriptionChart", () => {
    let useCase: SalesByChannelDescriptionChart;
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

        useCase = new SalesByChannelDescriptionChart(mockRepositoryFactory);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("execute", () => {
        it("deve retornar vendas por descrição de canal quando houver resultados", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: SalesByChannelDescriptionChartInput = {
                data: period,
            };

            const mockSalesData: SalesByChannelDescriptionDTO[] = [
                new SalesByChannelDescriptionDTO({
                    description: "iFood",
                    total_sales: 450,
                }),
                new SalesByChannelDescriptionDTO({
                    description: "Uber Eats",
                    total_sales: 320,
                }),
                new SalesByChannelDescriptionDTO({
                    description: "Rappi",
                    total_sales: 280,
                }),
                new SalesByChannelDescriptionDTO({
                    description: "Balcão",
                    total_sales: 150,
                }),
            ];

            mockDashboardRepository.getSalesByChannelDescription.mockResolvedValue(mockSalesData);

            const result = await useCase.execute(input);

            expect(mockRepositoryFactory.createDashboardRepository).toHaveBeenCalledTimes(1);
            expect(mockDashboardRepository.getSalesByChannelDescription).toHaveBeenCalledWith(period);
            expect(mockDashboardRepository.getSalesByChannelDescription).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ data: mockSalesData });
            expect(result.data).toHaveLength(4);
        });

        it("deve lançar erro quando não houver dados (array vazio)", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: SalesByChannelDescriptionChartInput = {
                data: period,
            };

            mockDashboardRepository.getSalesByChannelDescription.mockResolvedValue([]);

            await expect(useCase.execute(input)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getSalesByChannelDescription).toHaveBeenCalledWith(period);
            expect(mockDashboardRepository.getSalesByChannelDescription).toHaveBeenCalledTimes(1);
        });

        it("deve lançar erro quando retornar null", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: SalesByChannelDescriptionChartInput = {
                data: period,
            };

            mockDashboardRepository.getSalesByChannelDescription.mockResolvedValue(null as any);

            await expect(useCase.execute(input)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getSalesByChannelDescription).toHaveBeenCalledWith(period);
        });

        it("deve lançar erro quando retornar undefined", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: SalesByChannelDescriptionChartInput = {
                data: period,
            };

            mockDashboardRepository.getSalesByChannelDescription.mockResolvedValue(undefined as any);

            await expect(useCase.execute(input)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getSalesByChannelDescription).toHaveBeenCalledWith(period);
        });

        it("deve propagar erro do repository", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: SalesByChannelDescriptionChartInput = {
                data: period,
            };

            const dbError = new Error("Database connection failed");
            mockDashboardRepository.getSalesByChannelDescription.mockRejectedValue(dbError);

            await expect(useCase.execute(input)).rejects.toThrow("Database connection failed");
            expect(mockDashboardRepository.getSalesByChannelDescription).toHaveBeenCalledWith(period);
        });

        it("deve retornar canais ordenados por total de vendas (maior para menor)", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-06-01 00:00:00",
                end_date: "2024-06-30 23:59:59",
            });

            const input: SalesByChannelDescriptionChartInput = {
                data: period,
            };

            const mockSalesData: SalesByChannelDescriptionDTO[] = [
                new SalesByChannelDescriptionDTO({
                    description: "iFood",
                    total_sales: 500,
                }),
                new SalesByChannelDescriptionDTO({
                    description: "Uber Eats",
                    total_sales: 300,
                }),
                new SalesByChannelDescriptionDTO({
                    description: "Rappi",
                    total_sales: 200,
                }),
            ];

            mockDashboardRepository.getSalesByChannelDescription.mockResolvedValue(mockSalesData);

            const result = await useCase.execute(input);

            expect(result.data[0].totalSales).toBeGreaterThanOrEqual(result.data[1].totalSales);
            expect(result.data[1].totalSales).toBeGreaterThanOrEqual(result.data[2].totalSales);
        });

        it("deve validar dados específicos de um canal", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: SalesByChannelDescriptionChartInput = {
                data: period,
            };

            const mockSalesData: SalesByChannelDescriptionDTO[] = [
                new SalesByChannelDescriptionDTO({
                    description: "iFood",
                    total_sales: 450,
                }),
            ];

            mockDashboardRepository.getSalesByChannelDescription.mockResolvedValue(mockSalesData);

            const result = await useCase.execute(input);

            expect(result.data[0].description).toBe("iFood");
            expect(result.data[0].totalSales).toBe(450);
            expect(result.data).toEqual(mockSalesData);
        });
    });
});