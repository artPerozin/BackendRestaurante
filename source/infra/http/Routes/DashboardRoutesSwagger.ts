import { Router } from "express";

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Endpoints para gráficos e métricas do dashboard
 */
const router = Router();

/**
 * @swagger
 * /dashboard/cashFlowChart:
 *   post:
 *     summary: Retorna o gráfico de fluxo de caixa
 *     tags: [Dashboard]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Dados do gráfico de fluxo de caixa
 */
router.post("/dashboard/cashFlowChart", () => {});

export default router;
