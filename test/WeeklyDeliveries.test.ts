import DashboardRepositoryInterface from "../source/domain/Interfaces/DashboardRepositoryInterface";
import RepositoryFactoryInterface from "../source/domain/Interfaces/RepositoryFactoryInterface";
import WeeklyDeliveries from "../source/useCases/weeklyDeliveries/WeeklyDeliveries";

describe("WeeklyDeliveries", () => {
    let useCase: WeeklyDeliveries;
    let mockDashboardRepository: jest.Mocked<DashboardRepositoryInterface>;
    let mockRepositoryFactory: jest.Mocked<RepositoryFactoryInterface>;

    beforeEach(() => {
        mockDashboardRepository = { getWeeklyDeliveries: jest.fn() } as any;
        mockRepositoryFactory = { createDashboardRepository: jest.fn().mockReturnValue(mockDashboardRepository) } as any;
        useCase = new WeeklyDeliveries(mockRepositoryFactory);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("execute", () => {
        it("deve retornar quantidade de entregas semanais quando houver resultados", async () => {
            const mockData = [{ total_deliveries: 320 }];
            mockDashboardRepository.getWeeklyDeliveries.mockResolvedValue(mockData);

            const result = await useCase.execute();

            expect(mockRepositoryFactory.createDashboardRepository).toHaveBeenCalledTimes(1);
            expect(mockDashboardRepository.getWeeklyDeliveries).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ data: mockData });
        });

        it("deve lançar erro quando não houver dados", async () => {
            mockDashboardRepository.getWeeklyDeliveries.mockResolvedValue([]);
            await expect(useCase.execute()).rejects.toThrow("Sem dados para query");
        });

        it("deve propagar erro do repository", async () => {
            const dbError = new Error("Database connection failed");
            mockDashboardRepository.getWeeklyDeliveries.mockRejectedValue(dbError);
            await expect(useCase.execute()).rejects.toThrow("Database connection failed");
        });
    });
});
