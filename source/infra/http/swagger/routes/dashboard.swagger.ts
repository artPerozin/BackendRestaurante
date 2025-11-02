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
 *           example: "2024-01-01 00:00:00"
 *         end_date:
 *           type: string
 *           format: date-time
 *           description: Data de fim do período
 *           example: "2024-01-31 23:59:59"
 * 
 *     CashFlowData:
 *       type: object
 *       properties:
 *         day:
 *           type: string
 *           format: date
 *           example: "2024-01-15"
 *         total_sales_amount:
 *           type: number
 *         total_value_paid:
 *           type: number
 *         total_discount:
 *           type: number
 *         total_increase:
 *           type: number
 *         total_delivery_fee:
 *           type: number
 *         total_service_tax_fee:
 *           type: number
 *         average_ticket:
 *           type: number
 * 
 *     DeliveryLocation:
 *       type: object
 *       properties:
 *         lat:
 *           type: number
 *         lng:
 *           type: number
 * 
 *     PaymentByType:
 *       type: object
 *       properties:
 *         tipo_pagamento:
 *           type: string
 *         valor_total:
 *           type: number
 * 
 *     RegionPerformance:
 *       type: object
 *       properties:
 *         neighborhood:
 *           type: string
 *         city:
 *           type: string
 *         deliveries:
 *           type: integer
 *         avgDeliveryMinutes:
 *           type: number
 *         p90DeliveryMinutes:
 *           type: number
 * 
 *     SalesByChannelDescription:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *         total_sales:
 *           type: integer
 * 
 *     SalesByChannelType:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *         channel_type:
 *           type: string
 *         total_sales:
 *           type: integer
 * 
 *     TopItem:
 *       type: object
 *       properties:
 *         item:
 *           type: string
 *         times_added:
 *           type: integer
 *         revenue_generated:
 *           type: number
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
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
 */

/**
 * @swagger
 * /dashboard/deliveryLocationsChart:
 *   post:
 *     summary: Retorna as coordenadas geográficas das entregas
 *     tags: [Dashboard]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TemporalInput'
 *     responses:
 *       200:
 *         description: Localizações de entrega retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DeliveryLocation'
 *       422:
 *         description: Erro de validação ou ausência de dados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
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
 */

/**
 * @swagger
 * /dashboard/performanceByRegionChart:
 *   post:
 *     summary: Retorna o gráfico de desempenho de entregas por região
 *     tags: [Dashboard]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TemporalInput'
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
 *         description: Erro de validação ou ausência de dados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
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
 */

/**
 * @swagger
 * /dashboard/salesByChannelTypeChart:
 *   post:
 *     summary: Retorna o gráfico de vendas por tipo geral de canal
 *     tags: [Dashboard]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TemporalInput'
 *     responses:
 *       200:
 *         description: Dados de vendas por tipo de canal retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SalesByChannelType'
 *       422:
 *         description: Erro de validação ou ausência de dados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
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
 */