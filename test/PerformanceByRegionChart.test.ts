import { RegionPerformanceDTO } from "../source/domain/DTO/RegionPerformanceDto";
import { TemporalInputDto } from "../source/domain/DTO/TemporalInputDto";
import DashboardRepositoryInterface from "../source/domain/Interfaces/DashboardRepositoryInterface";
import RepositoryFactoryInterface from "../source/domain/Interfaces/RepositoryFactoryInterface";
import PerformanceByRegionChart from "../source/useCases/performanceByRegionChart/PerformanceByRegionChart";
import PerformanceByRegionChartInput from "../source/useCases/performanceByRegionChart/PerformanceByRegionChartInput";

describe("PerformanceByRegionChart", () => {
    let useCase: PerformanceByRegionChart;
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

        useCase = new PerformanceByRegionChart(mockRepositoryFactory);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("execute", () => {
        it("deve retornar performance por região quando houver resultados", async () => {
            // Arrange
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: PerformanceByRegionChartInput = {
                data: period,
            };

            const mockPerformanceData: RegionPerformanceDTO[] = [
                new RegionPerformanceDTO({
                    neighborhood: "Centro",
                    city: "Joinville",
                    deliveries: 150,
                    avg_delivery_minutes: 35.5,
                    p90_delivery_minutes: 45.2,
                }),
                new RegionPerformanceDTO({
                    neighborhood: "América",
                    city: "Joinville",
                    deliveries: 120,
                    avg_delivery_minutes: 28.3,
                    p90_delivery_minutes: 38.7,
                }),
                new RegionPerformanceDTO({
                    neighborhood: "Aventureiro",
                    city: "Joinville",
                    deliveries: 95,
                    avg_delivery_minutes: 32.1,
                    p90_delivery_minutes: 42.5,
                }),
            ];

            mockDashboardRepository.getPerformanceByRegion.mockResolvedValue(mockPerformanceData);

            // Act
            const result = await useCase.execute(input);

            // Assert
            expect(mockRepositoryFactory.createDashboardRepository).toHaveBeenCalledTimes(1);
            expect(mockDashboardRepository.getPerformanceByRegion).toHaveBeenCalledWith(period);
            expect(mockDashboardRepository.getPerformanceByRegion).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ data: mockPerformanceData });
            expect(result.data).toHaveLength(3);
        });

        it("deve lançar erro quando não houver dados (array vazio)", async () => {
            // Arrange
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: PerformanceByRegionChartInput = {
                data: period,
            };

            mockDashboardRepository.getPerformanceByRegion.mockResolvedValue([]);

            // Act & Assert
            await expect(useCase.execute(input)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getPerformanceByRegion).toHaveBeenCalledWith(period);
            expect(mockDashboardRepository.getPerformanceByRegion).toHaveBeenCalledTimes(1);
        });

        it("deve lançar erro quando retornar null", async () => {
            // Arrange
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: PerformanceByRegionChartInput = {
                data: period,
            };

            mockDashboardRepository.getPerformanceByRegion.mockResolvedValue(null as any);

            // Act & Assert
            await expect(useCase.execute(input)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getPerformanceByRegion).toHaveBeenCalledWith(period);
        });

        it("deve lançar erro quando retornar undefined", async () => {
            // Arrange
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: PerformanceByRegionChartInput = {
                data: period,
            };

            mockDashboardRepository.getPerformanceByRegion.mockResolvedValue(undefined as any);

            // Act & Assert
            await expect(useCase.execute(input)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getPerformanceByRegion).toHaveBeenCalledWith(period);
        });

        it("deve propagar erro do repository", async () => {
            // Arrange
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: PerformanceByRegionChartInput = {
                data: period,
            };

            const dbError = new Error("Database connection failed");
            mockDashboardRepository.getPerformanceByRegion.mockRejectedValue(dbError);

            // Act & Assert
            await expect(useCase.execute(input)).rejects.toThrow("Database connection failed");
            expect(mockDashboardRepository.getPerformanceByRegion).toHaveBeenCalledWith(period);
        });

        it("deve validar métricas de performance da região", async () => {
            // Arrange
            const period = new TemporalInputDto({
                start_date: "2024-06-01 00:00:00",
                end_date: "2024-06-30 23:59:59",
            });

            const input: PerformanceByRegionChartInput = {
                data: period,
            };

            const mockPerformanceData: RegionPerformanceDTO[] = [
                new RegionPerformanceDTO({
                    neighborhood: "Centro",
                    city: "Joinville",
                    deliveries: 200,
                    avg_delivery_minutes: 30.0,
                    p90_delivery_minutes: 40.0,
                }),
            ];

            mockDashboardRepository.getPerformanceByRegion.mockResolvedValue(mockPerformanceData);

            // Act
            const result = await useCase.execute(input);

            // Assert
            expect(result.data[0].neighborhood).toBe("Centro");
            expect(result.data[0].city).toBe("Joinville");
            expect(result.data[0].deliveries).toBe(200);
            expect(result.data[0].avgDeliveryMinutes).toBe(30.0);
            expect(result.data[0].p90DeliveryMinutes).toBe(40.0);
        });

        it("deve retornar regiões ordenadas por tempo médio de entrega (decrescente)", async () => {
            // Arrange
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: PerformanceByRegionChartInput = {
                data: period,
            };

            const mockPerformanceData: RegionPerformanceDTO[] = [
                new RegionPerformanceDTO({
                    neighborhood: "Bairro A",
                    city: "Joinville",
                    deliveries: 50,
                    avg_delivery_minutes: 45.0,
                    p90_delivery_minutes: 55.0,
                }),
                new RegionPerformanceDTO({
                    neighborhood: "Bairro B",
                    city: "Joinville",
                    deliveries: 75,
                    avg_delivery_minutes: 35.0,
                    p90_delivery_minutes: 45.0,
                }),
                new RegionPerformanceDTO({
                    neighborhood: "Bairro C",
                    city: "Joinville",
                    deliveries: 100,
                    avg_delivery_minutes: 25.0,
                    p90_delivery_minutes: 35.0,
                }),
            ];

            mockDashboardRepository.getPerformanceByRegion.mockResolvedValue(mockPerformanceData);

            // Act
            const result = await useCase.execute(input);

            // Assert
            expect(result.data[0].avgDeliveryMinutes).toBeGreaterThanOrEqual(result.data[1].avgDeliveryMinutes);
            expect(result.data[1].avgDeliveryMinutes).toBeGreaterThanOrEqual(result.data[2].avgDeliveryMinutes);
        });

        it("deve filtrar regiões com mínimo de entregas (>= 10)", async () => {
            // Arrange
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: PerformanceByRegionChartInput = {
                data: period,
            };

            const mockPerformanceData: RegionPerformanceDTO[] = [
                new RegionPerformanceDTO({
                    neighborhood: "Centro",
                    city: "Joinville",
                    deliveries: 50,
                    avg_delivery_minutes: 30.0,
                    p90_delivery_minutes: 40.0,
                }),
                new RegionPerformanceDTO({
                    neighborhood: "América",
                    city: "Joinville",
                    deliveries: 25,
                    avg_delivery_minutes: 28.0,
                    p90_delivery_minutes: 38.0,
                }),
            ];

            mockDashboardRepository.getPerformanceByRegion.mockResolvedValue(mockPerformanceData);

            // Act
            const result = await useCase.execute(input);

            // Assert
            result.data.forEach(region => {
                expect(region.deliveries).toBeGreaterThanOrEqual(10);
            });
        });
    });
});