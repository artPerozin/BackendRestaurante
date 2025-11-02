import { CustomerRetentionDTO } from "../source/domain/DTO/CustomerRetentionDto";
import CustomerRetentionInput from "../source/useCases/customerRetention/CustomerRetentionInput";
import CustomerRetentionOutput from "../source/useCases/customerRetention/CustomerRetentionOutput";
import DashboardRepositoryInterface from "../source/domain/Interfaces/DashboardRepositoryInterface";
import RepositoryFactoryInterface from "../source/domain/Interfaces/RepositoryFactoryInterface";
import CustomerRetention from "../source/useCases/customerRetention/CustomerRetention";

describe("CustomerRetention", () => {
    let useCase: CustomerRetention;
    let mockDashboardRepository: jest.Mocked<DashboardRepositoryInterface>;
    let mockRepositoryFactory: jest.Mocked<RepositoryFactoryInterface>;

    beforeEach(() => {
        mockDashboardRepository = {
            getCustomerRetention: jest.fn(),
            getCashFlow: jest.fn(),
            getPerformanceByRegion: jest.fn(),
            getTopItems: jest.fn(),
            getDeliveryLocations: jest.fn(),
            getSalesByChannelDescription: jest.fn(),
            getPaymentsByType: jest.fn(),
            getWeeklyAverageTicket: jest.fn(),
            getWeeklyRevenue: jest.fn(),
            getWeeklyDeliveries: jest.fn(),
        };

        mockRepositoryFactory = {
            createDashboardRepository: jest.fn().mockReturnValue(mockDashboardRepository),
        } as any;

        useCase = new CustomerRetention(mockRepositoryFactory);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("execute", () => {
        it("deve retornar dados de CustomerRetention quando houver resultados", async () => {
            const input: CustomerRetentionInput = {
                start_date: "2025-01-01 00:00:00",
                end_date: "2025-01-31 23:59:59",
            };

            const mockData: CustomerRetentionDTO[] = [
                new CustomerRetentionDTO({ status: "fiel", quantidade: 10 }),
                new CustomerRetentionDTO({ status: "perdido", quantidade: 5 }),
            ];

            mockDashboardRepository.getCustomerRetention.mockResolvedValue(mockData);

            const result: CustomerRetentionOutput = await useCase.execute(input);

            expect(mockRepositoryFactory.createDashboardRepository).toHaveBeenCalledTimes(1);
            expect(mockDashboardRepository.getCustomerRetention).toHaveBeenCalledWith(input);
            expect(mockDashboardRepository.getCustomerRetention).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ data: mockData });
            expect(result.data).toHaveLength(2);
        });

        it("deve lançar erro quando não houver dados (array vazio)", async () => {
            const input: CustomerRetentionInput = {
                start_date: "2025-01-01 00:00:00",
                end_date: "2025-01-31 23:59:59",
            };

            mockDashboardRepository.getCustomerRetention.mockResolvedValue([]);

            await expect(useCase.execute(input)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getCustomerRetention).toHaveBeenCalledWith(input);
            expect(mockDashboardRepository.getCustomerRetention).toHaveBeenCalledTimes(1);
        });

        it("deve lançar erro quando retornar null", async () => {
            const input: CustomerRetentionInput = {
                start_date: "2025-01-01 00:00:00",
                end_date: "2025-01-31 23:59:59",
            };

            mockDashboardRepository.getCustomerRetention.mockResolvedValue(null as any);

            await expect(useCase.execute(input)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getCustomerRetention).toHaveBeenCalledWith(input);
        });

        it("deve lançar erro quando retornar undefined", async () => {
            const input: CustomerRetentionInput = {
                start_date: "2025-01-01 00:00:00",
                end_date: "2025-01-31 23:59:59",
            };

            mockDashboardRepository.getCustomerRetention.mockResolvedValue(undefined as any);

            await expect(useCase.execute(input)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getCustomerRetention).toHaveBeenCalledWith(input);
        });

        it("deve propagar erro do repository", async () => {
            const input: CustomerRetentionInput = {
                start_date: "2025-01-01 00:00:00",
                end_date: "2025-01-31 23:59:59",
            };

            const dbError = new Error("Database connection failed");
            mockDashboardRepository.getCustomerRetention.mockRejectedValue(dbError);

            await expect(useCase.execute(input)).rejects.toThrow("Database connection failed");
            expect(mockDashboardRepository.getCustomerRetention).toHaveBeenCalledWith(input);
        });

        it("deve funcionar com diferentes períodos de datas", async () => {
            const input: CustomerRetentionInput = {
                start_date: "2025-06-01 00:00:00",
                end_date: "2025-06-30 23:59:59",
            };

            const mockData: CustomerRetentionDTO[] = [
                new CustomerRetentionDTO({ status: "fiel", quantidade: 20 }),
            ];

            mockDashboardRepository.getCustomerRetention.mockResolvedValue(mockData);

            const result = await useCase.execute(input);

            expect(mockDashboardRepository.getCustomerRetention).toHaveBeenCalledWith(input);
            expect(result.data).toEqual(mockData);
            expect(result.data[0].status).toEqual("fiel");
            expect(result.data).toHaveLength(1);
        });
    });
});
