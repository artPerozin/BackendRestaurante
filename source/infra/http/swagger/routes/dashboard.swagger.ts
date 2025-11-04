/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Endpoints para gráficos e métricas do dashboard
 *
 * components:
 *   schemas:
 *     TemporalInput:
 *       type: object
 *       required:
 *         - start_date
 *         - end_date
 *       properties:
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: Data de início do período
 *           example: "2025-01-01 00:00:00"
 *         end_date:
 *           type: string
 *           format: date-time
 *           description: Data de fim do período
 *           example: "2025-12-30 23:59:59"
 *
 *     CashFlowData:
 *       type: object
 *       properties:
 *         day:
 *           type: string
 *           format: date
 *           example: "2025-01-15"
 *         total_sales:
 *           type: integer
 *           example: 45
 *         total_value_paid:
 *           type: number
 *           example: 1890.75
 *         average_ticket:
 *           type: number
 *           example: 42.02
 *
 *     PaymentByType:
 *       type: object
 *       properties:
 *         tipo_pagamento:
 *           type: string
 *           example: "Cartão de Crédito"
 *         valor_total:
 *           type: number
 *           example: 12000.5
 *
 *     RegionPerformance:
 *       type: object
 *       properties:
 *         neighborhood:
 *           type: string
 *           example: "Centro"
 *         city:
 *           type: string
 *           example: "São Paulo"
 *         deliveries:
 *           type: integer
 *           example: 230
 *         avgDeliveryMinutes:
 *           type: number
 *           example: 32.5
 *         p90DeliveryMinutes:
 *           type: number
 *           example: 45.8
 *
 *     SalesByChannelDescription:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *           example: "iFood"
 *         total_sales:
 *           type: integer
 *           example: 154
 *
 *     TopItem:
 *       type: object
 *       properties:
 *         item:
 *           type: string
 *           example: "Hambúrguer Artesanal"
 *         times_added:
 *           type: integer
 *           example: 320
 *         revenue_generated:
 *           type: number
 *           example: 9600.50
 *
 *     CustomerRetentionDTO:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: Status do cliente ("ativo" ou "perdido")
 *           example: "ativo"
 *         quantidade:
 *           type: integer
 *           description: Quantidade de clientes naquele status
 *           example: 10
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Sem dados para query"
 */

/**
 * @swagger
 * /dashboard/cashFlowChart:
 *   post:
 *     summary: Retorna o gráfico de fluxo de caixa por dia
 *     tags: [Dashboard]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TemporalInput'
 *     responses:
 *       200:
 *         description: Dados do fluxo de caixa retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CashFlowData'
 *       422:
 *         description: Erro de validação ou ausência de dados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /dashboard/paymentsByTypeChart:
 *   post:
 *     summary: Retorna o gráfico de pagamentos por tipo
 *     tags: [Dashboard]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TemporalInput'
 *     responses:
 *       200:
 *         description: Dados de pagamentos por tipo retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentByType'
 *       422:
 *         description: Erro de validação ou ausência de dados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /dashboard/performanceByRegionChart:
 *   get:
 *     summary: Retorna o gráfico de desempenho de entregas por região
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dados de performance por região retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RegionPerformance'
 *       422:
 *         description: Erro de ausência de dados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /dashboard/salesByChannelDescriptionChart:
 *   post:
 *     summary: Retorna o gráfico de vendas por descrição específica do canal
 *     tags: [Dashboard]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TemporalInput'
 *     responses:
 *       200:
 *         description: Dados de vendas por descrição de canal retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SalesByChannelDescription'
 *       422:
 *         description: Erro de validação ou ausência de dados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /dashboard/topItemsChart:
 *   post:
 *     summary: Retorna os 20 itens adicionais mais vendidos
 *     tags: [Dashboard]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TemporalInput'
 *     responses:
 *       200:
 *         description: Lista dos top itens retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               maxItems: 20
 *               items:
 *                 $ref: '#/components/schemas/TopItem'
 *       422:
 *         description: Erro de validação ou ausência de dados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /dashboard/customerRetention:
 *   get:
 *     summary: Retorna a retenção de clientes por status ("ativo" ou "perdido")
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dados de retenção de clientes retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CustomerRetentionDTO'
 *       422:
 *         description: Sem dados para query
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /dashboard/weeklyAverageTicket:
 *   get:
 *     summary: Retorna o ticket médio da semana
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Ticket médio retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ticket_medio:
 *                         type: number
 *                         example: 120.5
 *       422:
 *         description: Sem dados para query
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /dashboard/weeklyRevenue:
 *   get:
 *     summary: Retorna o faturamento da semana
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Faturamento retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       faturamento:
 *                         type: number
 *                         example: 50000
 *       422:
 *         description: Sem dados para query
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /dashboard/weeklyDeliveries:
 *   get:
 *     summary: Retorna a quantidade de entregas realizadas na semana
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Quantidade de entregas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       total_deliveries:
 *                         type: integer
 *                         example: 320
 *       422:
 *         description: Sem dados para query
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
