import { PaymentsByTypeDTO } from "../source/domain/DTO/PaymentsByTypeDto";
import { TemporalInputDto } from "../source/domain/DTO/TemporalInputDto";
import DashboardRepositoryInterface from "../source/domain/Interfaces/DashboardRepositoryInterface";
import RepositoryFactoryInterface from "../source/domain/Interfaces/RepositoryFactoryInterface";
import PaymentsByTypeChartChart from "../source/useCases/paymentsByTypeChart/PaymentsByTypeChart";
import PaymentsByTypeChartInput from "../source/useCases/paymentsByTypeChart/PaymentsByTypeChartInput";

describe("PaymentsByTypeChartChart", () => {
    let useCase: PaymentsByTypeChartChart;
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

        useCase = new PaymentsByTypeChartChart(mockRepositoryFactory);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("execute", () => {
        it("deve retornar pagamentos por tipo quando houver resultados", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: PaymentsByTypeChartInput = {
                data: period,
            };

            const mockPaymentsData: PaymentsByTypeDTO[] = [
                new PaymentsByTypeDTO({
                    tipo_pagamento: "Cartão de Crédito",
                    valor_total: 15000.50,
                }),
                new PaymentsByTypeDTO({
                    tipo_pagamento: "Dinheiro",
                    valor_total: 8500.25,
                }),
                new PaymentsByTypeDTO({
                    tipo_pagamento: "PIX",
                    valor_total: 12300.75,
                }),
                new PaymentsByTypeDTO({
                    tipo_pagamento: "Cartão de Débito",
                    valor_total: 6700.00,
                }),
            ];

            mockDashboardRepository.getPaymentsByType.mockResolvedValue(mockPaymentsData);

            const result = await useCase.execute(input);

            expect(mockRepositoryFactory.createDashboardRepository).toHaveBeenCalledTimes(1);
            expect(mockDashboardRepository.getPaymentsByType).toHaveBeenCalledWith(period);
            expect(mockDashboardRepository.getPaymentsByType).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ data: mockPaymentsData });
            expect(result.data).toHaveLength(4);
        });

        it("deve lançar erro quando não houver dados (array vazio)", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: PaymentsByTypeChartInput = {
                data: period,
            };

            mockDashboardRepository.getPaymentsByType.mockResolvedValue([]);

            await expect(useCase.execute(input)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getPaymentsByType).toHaveBeenCalledWith(period);
            expect(mockDashboardRepository.getPaymentsByType).toHaveBeenCalledTimes(1);
        });

        it("deve lançar erro quando retornar null", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: PaymentsByTypeChartInput = {
                data: period,
            };

            mockDashboardRepository.getPaymentsByType.mockResolvedValue(null as any);

            await expect(useCase.execute(input)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getPaymentsByType).toHaveBeenCalledWith(period);
        });

        it("deve lançar erro quando retornar undefined", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: PaymentsByTypeChartInput = {
                data: period,
            };

            mockDashboardRepository.getPaymentsByType.mockResolvedValue(undefined as any);

            await expect(useCase.execute(input)).rejects.toThrow("Sem dados para query");
            expect(mockDashboardRepository.getPaymentsByType).toHaveBeenCalledWith(period);
        });

        it("deve propagar erro do repository", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: PaymentsByTypeChartInput = {
                data: period,
            };

            const dbError = new Error("Database connection failed");
            mockDashboardRepository.getPaymentsByType.mockRejectedValue(dbError);

            await expect(useCase.execute(input)).rejects.toThrow("Database connection failed");
            expect(mockDashboardRepository.getPaymentsByType).toHaveBeenCalledWith(period);
        });

        it("deve retornar valores corretos para cada tipo de pagamento", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-06-01 00:00:00",
                end_date: "2024-06-30 23:59:59",
            });

            const input: PaymentsByTypeChartInput = {
                data: period,
            };

            const mockPaymentsData: PaymentsByTypeDTO[] = [
                new PaymentsByTypeDTO({
                    tipo_pagamento: "PIX",
                    valor_total: 25000.00,
                }),
            ];

            mockDashboardRepository.getPaymentsByType.mockResolvedValue(mockPaymentsData);

            const result = await useCase.execute(input);

            expect(result.data[0]).toHaveProperty('tipo_pagamento');
            expect(result.data[0]).toHaveProperty('valor_total');
            expect(result.data).toEqual(mockPaymentsData);
        });

        it("deve ordenar pagamentos por valor total (maior para menor)", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: PaymentsByTypeChartInput = {
                data: period,
            };

            const mockPaymentsData: PaymentsByTypeDTO[] = [
                new PaymentsByTypeDTO({
                    tipo_pagamento: "Cartão de Crédito",
                    valor_total: 20000.00,
                }),
                new PaymentsByTypeDTO({
                    tipo_pagamento: "PIX",
                    valor_total: 15000.00,
                }),
                new PaymentsByTypeDTO({
                    tipo_pagamento: "Dinheiro",
                    valor_total: 10000.00,
                }),
            ];

            mockDashboardRepository.getPaymentsByType.mockResolvedValue(mockPaymentsData);

            const result = await useCase.execute(input);

            expect(result.data[0].valor_total).toBeGreaterThanOrEqual(result.data[1].valor_total);
            expect(result.data[1].valor_total).toBeGreaterThanOrEqual(result.data[2].valor_total);
        });

        it("deve processar diferentes tipos de pagamento", async () => {
            const period = new TemporalInputDto({
                start_date: "2024-01-01 00:00:00",
                end_date: "2024-01-31 23:59:59",
            });

            const input: PaymentsByTypeChartInput = {
                data: period,
            };

            const mockPaymentsData: PaymentsByTypeDTO[] = [
                new PaymentsByTypeDTO({
                    tipo_pagamento: "Cartão de Crédito",
                    valor_total: 18000.00,
                }),
                new PaymentsByTypeDTO({
                    tipo_pagamento: "Cartão de Débito",
                    valor_total: 12000.00,
                }),
                new PaymentsByTypeDTO({
                    tipo_pagamento: "PIX",
                    valor_total: 15000.00,
                }),
                new PaymentsByTypeDTO({
                    tipo_pagamento: "Dinheiro",
                    valor_total: 5000.00,
                }),
                new PaymentsByTypeDTO({
                    tipo_pagamento: "Vale Alimentação",
                    valor_total: 3000.00,
                }),
            ];

            mockDashboardRepository.getPaymentsByType.mockResolvedValue(mockPaymentsData);

            const result = await useCase.execute(input);

            expect(result.data).toHaveLength(5);
            const tipos = result.data.map(p => p.tipo_pagamento);
            expect(tipos).toContain("Cartão de Crédito");
            expect(tipos).toContain("Cartão de Débito");
            expect(tipos).toContain("PIX");
            expect(tipos).toContain("Dinheiro");
            expect(tipos).toContain("Vale Alimentação");
        });
    });
});