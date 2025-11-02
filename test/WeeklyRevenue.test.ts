import DashboardRepositoryInterface from "../source/domain/Interfaces/DashboardRepositoryInterface";
import RepositoryFactoryInterface from "../source/domain/Interfaces/RepositoryFactoryInterface";
import WeeklyRevenue from "../source/useCases/weeklyRevenue/WeeklyRevenue";

describe("WeeklyRevenue", () => {
    let useCase: WeeklyRevenue;
    let mockDashboardRepository: jest.Mocked<DashboardRepositoryInterface>;
    let mockRepositoryFactory: jest.Mocked<RepositoryFactoryInterface>;

    beforeEach(() => {
        mockDashboardRepository = { getWeeklyRevenue: jest.fn() } as any;
        mockRepositoryFactory = { createDashboardRepository: jest.fn().mockReturnValue(mockDashboardRepository) } as any;
        useCase = new WeeklyRevenue(mockRepositoryFactory);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("execute", () => {
        it("deve retornar faturamento semanal quando houver resultados", async () => {
            const mockData = [{ faturamento: 50000 }];
            mockDashboardRepository.getWeeklyRevenue.mockResolvedValue(mockData);

            const result = await useCase.execute();

            expect(mockRepositoryFactory.createDashboardRepository).toHaveBeenCalledTimes(1);
            expect(mockDashboardRepository.getWeeklyRevenue).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ data: mockData });
        });

        it("deve lançar erro quando não houver dados", async () => {
            mockDashboardRepository.getWeeklyRevenue.mockResolvedValue([]);
            await expect(useCase.execute()).rejects.toThrow("Sem dados para query");
        });

        it("deve propagar erro do repository", async () => {
            const dbError = new Error("Database connection failed");
            mockDashboardRepository.getWeeklyRevenue.mockRejectedValue(dbError);
            await expect(useCase.execute()).rejects.toThrow("Database connection failed");
        });
    });
});
