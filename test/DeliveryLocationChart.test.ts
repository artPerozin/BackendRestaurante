import { DeliveryLocationDTO } from "../source/domain/DTO/DeliveryLocationDto";
import { TemporalInputDto } from "../source/domain/DTO/TemporalInputDto";
import DashboardRepositoryInterface from "../source/domain/Interfaces/DashboardRepositoryInterface";
import RepositoryFactoryInterface from "../source/domain/Interfaces/RepositoryFactoryInterface";
import DeliveryLocationsChart from "../source/useCases/deliveryLocationsChart/DeliveryLocationsChart";
import DeliveryLocationsChartInput from "../source/useCases/deliveryLocationsChart/DeliveryLocationsChartInput";

describe("DeliveryLocationsChart", () => {
    let useCase: DeliveryLocationsChart;
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
            getCustomerRetention: jest.fn(),
            getWeeklyAverageTicket: jest.fn(),
            getWeeklyRevenue: jest.fn(),
            getWeeklyDeliveries: jest.fn(),
        };

        mockRepositoryFactory = {
            createDashboardRepository: jest.fn().mockReturnValue(mockDashboardRepository),
        } as any;

        useCase = new DeliveryLocationsChart(mockRepositoryFactory);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("execute", () => {
        it("deve retornar localizações de entrega quando houver resultados", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const mockDeliveryLocations: DeliveryLocationDTO[] = [
                new DeliveryLocationDTO({
                    lat: -26.3045,
                    lng: -48.8487,
                }),
                new DeliveryLocationDTO({
                    lat: -26.3123,
                    lng: -48.8567,
                }),
                new DeliveryLocationDTO({
                    lat: -26.2987,
                    lng: -48.8401,
                }),
            ];

            mockDashboardRepository.getDeliveryLocations.mockResolvedValue(mockDeliveryLocations);

            const result = await useCase.execute(period);

            expect(mockRepositoryFactory.createDashboardRepository).toHaveBeenCalledTimes(1);
            expect(mockDashboardRepository.getDeliveryLocations).toHaveBeenCalledWith(period);
            expect(mockDashboardRepository.getDeliveryLocations).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ data: mockDeliveryLocations });
            expect(result.data).toHaveLength(3);
        });

        it("deve lançar erro quando não houver dados (array vazio)", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            mockDashboardRepository.getDeliveryLocations.mockResolvedValue([]);

            await expect(useCase.execute(period)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getDeliveryLocations).toHaveBeenCalledWith(period);
            expect(mockDashboardRepository.getDeliveryLocations).toHaveBeenCalledTimes(1);
        });

        it("deve lançar erro quando retornar null", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            mockDashboardRepository.getDeliveryLocations.mockResolvedValue(null as any);

            await expect(useCase.execute(period)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getDeliveryLocations).toHaveBeenCalledWith(period);
        });

        it("deve lançar erro quando retornar undefined", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            mockDashboardRepository.getDeliveryLocations.mockResolvedValue(undefined as any);

            await expect(useCase.execute(period)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getDeliveryLocations).toHaveBeenCalledWith(period);
        });

        it("deve propagar erro do repository", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const dbError = new Error("Database connection failed");
            mockDashboardRepository.getDeliveryLocations.mockRejectedValue(dbError);

            await expect(useCase.execute(period)).rejects.toThrow("Database connection failed");
            expect(mockDashboardRepository.getDeliveryLocations).toHaveBeenCalledWith(period);
        });

        it("deve validar coordenadas das localizações retornadas", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-06-01 00:00:00",
                end_date: "2024-06-30 23:59:59",
            });

            const mockDeliveryLocations: DeliveryLocationDTO[] = [
                new DeliveryLocationDTO({
                    lat: -26.3045,
                    lng: -48.8487,
                }),
            ];

            mockDashboardRepository.getDeliveryLocations.mockResolvedValue(mockDeliveryLocations);

            const result = await useCase.execute(period);

            expect(result.data[0].lat).toBe(-26.3045);
            expect(result.data[0].lng).toBe(-48.8487);
            expect(result.data[0]).toEqual(mockDeliveryLocations[0]);
        });
    });
});