import { TemporalInputDto } from "../source/domain/DTO/TemporalInputDto";
import { TopItemDTO } from "../source/domain/DTO/TopItemDto";
import DashboardRepositoryInterface from "../source/domain/Interfaces/DashboardRepositoryInterface";
import RepositoryFactoryInterface from "../source/domain/Interfaces/RepositoryFactoryInterface";
import TopItemsChart from "../source/useCases/topItemsChart/TopItemsChart";
import TopItemsChartInput from "../source/useCases/topItemsChart/TopItemsChartInput";

describe("TopItemsChart", () => {
    let useCase: TopItemsChart;
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

        useCase = new TopItemsChart(mockRepositoryFactory);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("execute", () => {
        it("deve retornar top itens quando houver resultados", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: TopItemsChartInput = {
                data: period,
            };

            const mockTopItems: TopItemDTO[] = [
                new TopItemDTO({
                    item: "Bacon Extra",
                    times_added: 350,
                    revenue_generated: 1750.00,
                }),
                new TopItemDTO({
                    item: "Queijo Cheddar",
                    times_added: 280,
                    revenue_generated: 1120.00,
                }),
                new TopItemDTO({
                    item: "Cebola Caramelizada",
                    times_added: 220,
                    revenue_generated: 660.00,
                }),
                new TopItemDTO({
                    item: "Molho Especial",
                    times_added: 180,
                    revenue_generated: 360.00,
                }),
            ];

            mockDashboardRepository.getTopItems.mockResolvedValue(mockTopItems);

            const result = await useCase.execute(input);

            expect(mockRepositoryFactory.createDashboardRepository).toHaveBeenCalledTimes(1);
            expect(mockDashboardRepository.getTopItems).toHaveBeenCalledWith(period);
            expect(mockDashboardRepository.getTopItems).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ data: mockTopItems });
            expect(result.data).toHaveLength(4);
        });

        it("deve lançar erro quando não houver dados (array vazio)", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: TopItemsChartInput = {
                data: period,
            };

            mockDashboardRepository.getTopItems.mockResolvedValue([]);

            await expect(useCase.execute(input)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getTopItems).toHaveBeenCalledWith(period);
            expect(mockDashboardRepository.getTopItems).toHaveBeenCalledTimes(1);
        });

        it("deve lançar erro quando retornar null", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: TopItemsChartInput = {
                data: period,
            };

            mockDashboardRepository.getTopItems.mockResolvedValue(null as any);

            await expect(useCase.execute(input)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getTopItems).toHaveBeenCalledWith(period);
        });

        it("deve lançar erro quando retornar undefined", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: TopItemsChartInput = {
                data: period,
            };

            mockDashboardRepository.getTopItems.mockResolvedValue(undefined as any);

            await expect(useCase.execute(input)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getTopItems).toHaveBeenCalledWith(period);
        });

        it("deve propagar erro do repository", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: TopItemsChartInput = {
                data: period,
            };

            const dbError = new Error("Database connection failed");
            mockDashboardRepository.getTopItems.mockRejectedValue(dbError);

            await expect(useCase.execute(input)).rejects.toThrow("Database connection failed");
            expect(mockDashboardRepository.getTopItems).toHaveBeenCalledWith(period);
        });

        it("deve retornar no máximo 20 itens", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: TopItemsChartInput = {
                data: period,
            };

            const mockTopItems: TopItemDTO[] = Array.from({ length: 20 }, (_, i) => 
                new TopItemDTO({
                    item: `Item ${i + 1}`,
                    times_added: 100 - i,
                    revenue_generated: (100 - i) * 5,
                })
            );

            mockDashboardRepository.getTopItems.mockResolvedValue(mockTopItems);

            const result = await useCase.execute(input);

            expect(result.data).toHaveLength(20);
            expect(result.data.length).toBeLessThanOrEqual(20);
        });

        it("deve retornar itens ordenados por vezes adicionado (maior para menor)", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-06-01 00:00:00",
                end_date: "2024-06-30 23:59:59",
            });

            const input: TopItemsChartInput = {
                data: period,
            };

            const mockTopItems: TopItemDTO[] = [
                new TopItemDTO({
                    item: "Item A",
                    times_added: 500,
                    revenue_generated: 2500.00,
                }),
                new TopItemDTO({
                    item: "Item B",
                    times_added: 300,
                    revenue_generated: 1500.00,
                }),
                new TopItemDTO({
                    item: "Item C",
                    times_added: 100,
                    revenue_generated: 500.00,
                }),
            ];

            mockDashboardRepository.getTopItems.mockResolvedValue(mockTopItems);

            const result = await useCase.execute(input);

            expect(result.data[0].timesAdded).toBeGreaterThanOrEqual(result.data[1].timesAdded);
            expect(result.data[1].timesAdded).toBeGreaterThanOrEqual(result.data[2].timesAdded);
        });

        it("deve validar dados específicos de um item", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: TopItemsChartInput = {
                data: period,
            };

            const mockTopItems: TopItemDTO[] = [
                new TopItemDTO({
                    item: "Bacon Extra",
                    times_added: 350,
                    revenue_generated: 1750.00,
                }),
            ];

            mockDashboardRepository.getTopItems.mockResolvedValue(mockTopItems);

            const result = await useCase.execute(input);

            expect(result.data[0].item).toBe("Bacon Extra");
            expect(result.data[0].timesAdded).toBe(350);
            expect(result.data[0].revenueGenerated).toBe(1750.00);
            expect(result.data).toEqual(mockTopItems);
        });

        it("deve calcular receita corretamente para cada item", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: TopItemsChartInput = {
                data: period,
            };

            const mockTopItems: TopItemDTO[] = [
                new TopItemDTO({
                    item: "Item Premium",
                    times_added: 100,
                    revenue_generated: 2000.00,
                }),
                new TopItemDTO({
                    item: "Item Standard",
                    times_added: 200,
                    revenue_generated: 1000.00,
                }),
            ];

            mockDashboardRepository.getTopItems.mockResolvedValue(mockTopItems);

            const result = await useCase.execute(input);

            expect(result.data[0].revenueGenerated / result.data[0].timesAdded).toBe(20.00);
            expect(result.data[1].revenueGenerated / result.data[1].timesAdded).toBe(5.00);
        });
    });
});