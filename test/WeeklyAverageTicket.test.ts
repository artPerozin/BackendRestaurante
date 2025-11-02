import DashboardRepositoryInterface from "../source/domain/Interfaces/DashboardRepositoryInterface";
import RepositoryFactoryInterface from "../source/domain/Interfaces/RepositoryFactoryInterface";
import WeeklyAverageTicket from "../source/useCases/weeklyAvaregeTicket/WeeklyAverageTicket";

describe("WeeklyAverageTicket", () => {
    let useCase: WeeklyAverageTicket;
    let mockDashboardRepository: jest.Mocked<DashboardRepositoryInterface>;
    let mockRepositoryFactory: jest.Mocked<RepositoryFactoryInterface>;

    beforeEach(() => {
        mockDashboardRepository = { getWeeklyAverageTicket: jest.fn() } as any;
        mockRepositoryFactory = { createDashboardRepository: jest.fn().mockReturnValue(mockDashboardRepository) } as any;
        useCase = new WeeklyAverageTicket(mockRepositoryFactory);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("execute", () => {
        it("deve retornar ticket médio quando houver resultados", async () => {
            const mockData = [{ ticket_medio: 120.5 }];
            mockDashboardRepository.getWeeklyAverageTicket.mockResolvedValue(mockData);

            const result = await useCase.execute();

            expect(mockRepositoryFactory.createDashboardRepository).toHaveBeenCalledTimes(1);
            expect(mockDashboardRepository.getWeeklyAverageTicket).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ data: mockData });
        });

        it("deve lançar erro quando não houver dados", async () => {
            mockDashboardRepository.getWeeklyAverageTicket.mockResolvedValue([]);
            await expect(useCase.execute()).rejects.toThrow("Sem dados para query");
        });

        it("deve propagar erro do repository", async () => {
            const dbError = new Error("Database connection failed");
            mockDashboardRepository.getWeeklyAverageTicket.mockRejectedValue(dbError);
            await expect(useCase.execute()).rejects.toThrow("Database connection failed");
        });
    });
});
