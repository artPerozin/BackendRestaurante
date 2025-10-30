import { CashFlowByDayDTO } from "../../../domain/DTO/CashFlowByDayDto";
import { CustomerRetentionDTO } from "../../../domain/DTO/CustomerRetentionDto";
import { DeliveryLocationDTO } from "../../../domain/DTO/DeliveryLocationDto";
import { PaymentsByTypeDTO } from "../../../domain/DTO/PaymentsByTypeDto";
import { RegionPerformanceDTO } from "../../../domain/DTO/RegionPerformanceDto";
import { SalesByChannelDescriptionDTO } from "../../../domain/DTO/SalesByChannelDescriptionDto";
import { SalesByChannelTypeDTO } from "../../../domain/DTO/SalesByChannelTypeDto";
import { TopItemDTO } from "../../../domain/DTO/TopItemDto";
import { TemporalEnum } from "../../../domain/Enums/TemporalEnum";
import DashboardRepositoryInterface from "../../../domain/Interfaces/DashboardRepositoryInterface";
import Connection from "../../database/Connection";

export default class DashboardRepositoryDatabase implements DashboardRepositoryInterface {
    constructor(protected connection: Connection) {}

    async getPerformanceByRegion(days: TemporalEnum): Promise<RegionPerformanceDTO[]> {
        const query = `
            SELECT 
                da.neighborhood,
                da.city,
                COUNT(*) AS deliveries,
                AVG(s.delivery_seconds / 60.0) AS avg_delivery_minutes,
                PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY s.delivery_seconds / 60.0) AS p90_delivery_minutes
            FROM sales s
            JOIN delivery_addresses da ON da.sale_id = s.id
            WHERE s.sale_status_desc = 'COMPLETED'
              AND s.delivery_seconds IS NOT NULL
              AND s.created_at >= NOW() - INTERVAL $1 DAY
            GROUP BY da.neighborhood, da.city
            HAVING COUNT(*) >= 10
            ORDER BY avg_delivery_minutes DESC
        `;

        const result = await this.connection.execute(query, [days]);
        return result.map((row: any) => new RegionPerformanceDTO(row));
    }

    async getTopItems(days: TemporalEnum): Promise<TopItemDTO[]> {
        const query = `
            SELECT 
                i.name AS item,
                COUNT(*) AS times_added,
                SUM(ips.additional_price) AS revenue_generated
            FROM item_product_sales ips
            JOIN items i ON i.id = ips.item_id
            JOIN product_sales ps ON ps.id = ips.product_sale_id
            JOIN sales s ON s.id = ps.sale_id
            WHERE s.sale_status_desc = 'COMPLETED'
              AND s.created_at >= NOW() - INTERVAL $1 DAY
            GROUP BY i.name
            ORDER BY times_added DESC
            LIMIT 20
        `;

        const result = await this.connection.execute(query, [days]);
        return result.map((row: any) => new TopItemDTO(row));
    }

    async getDeliveryLocations(days: TemporalEnum): Promise<DeliveryLocationDTO[]> {
        const query = `
            SELECT
                da.latitude AS lat,
                da.longitude AS lng
            FROM delivery_addresses da
            JOIN sales s ON s.id = da.sale_id
            WHERE s.sale_status_desc = 'COMPLETED'
              AND s.created_at >= NOW() - INTERVAL $1 DAY
        `;

        const result = await this.connection.execute(query, [days]);
        return result.map((row: any) => new DeliveryLocationDTO(row));
    }

    async getCashFlow(days: TemporalEnum): Promise<CashFlowByDayDTO[]> {
        const query = `
            SELECT 
                DATE(s.created_at) AS day,
                SUM(s.total_amount_items) AS total_sales_amount,
                SUM(s.value_paid) AS total_value_paid,
                SUM(s.total_discount) AS total_discount,
                SUM(s.total_increase) AS total_increase,
                SUM(s.delivery_fee) AS total_delivery_fee,
                SUM(s.service_tax_fee) AS total_service_tax_fee,
                CASE WHEN COUNT(*) > 0 
                    THEN SUM(s.total_amount) / COUNT(*) 
                    ELSE 0 END AS average_ticket
            FROM sales s
            WHERE s.created_at >= NOW() - INTERVAL $1 DAY
              AND s.sale_status_desc = 'COMPLETED'
            GROUP BY DATE(s.created_at)
            ORDER BY DATE(s.created_at);
        `;

        const result = await this.connection.execute(query, [days]);
        return result.map((row: any) => new CashFlowByDayDTO(row));
    }

    async getSalesByChannelType(days: TemporalEnum): Promise<SalesByChannelTypeDTO[]> {
        const query = `
            SELECT
                c.type,
                CASE 
                    WHEN c.type = 'P' THEN 'Presencial'
                    WHEN c.type = 'D' THEN 'Delivery'
                END AS channel_type,
                COUNT(*) AS total_sales
            FROM sales s
            JOIN channels c ON c.id = s.channel_id
            WHERE s.sale_status_desc = 'COMPLETED'
              AND s.created_at >= NOW() - INTERVAL $1 DAY
            GROUP BY c.type
            ORDER BY total_sales DESC;
        `;

        const result = await this.connection.execute(query, [days]);
        return result.map((row: any) => new SalesByChannelTypeDTO(row));
    }

    async getSalesByChannelDescription(days: TemporalEnum): Promise<SalesByChannelDescriptionDTO[]> {
        const query = `
            SELECT
                c.description,
                COUNT(*) AS total_sales
            FROM sales s
            JOIN channels c ON c.id = s.channel_id
            WHERE s.sale_status_desc = 'COMPLETED'
              AND s.created_at >= NOW() - INTERVAL $1 DAY
            GROUP BY c.description
            ORDER BY total_sales DESC;
        `;

        const result = await this.connection.execute(query, [days]);
        return result.map((row: any) => new SalesByChannelDescriptionDTO(row));
    }

    async getCustomerRetention(): Promise<CustomerRetentionDTO[]> {
        const query = `
            WITH last_order_per_customer AS (
                SELECT
                    customer_id,
                    MAX(created_at) AS last_order_date
                FROM sales
                WHERE customer_id IS NOT NULL
                GROUP BY customer_id
            )
            SELECT
                CASE
                    WHEN last_order_date < NOW() - INTERVAL '30 days' THEN 'perdido'
                    ELSE 'fiel'
                END AS status,
                COUNT(*) AS quantidade
            FROM last_order_per_customer
            GROUP BY status;
        `;

        const result = await this.connection.execute(query);
        return result.map((row: any) => new CustomerRetentionDTO(row));
    }

    async getPaymentsByType(days: TemporalEnum): Promise<PaymentsByTypeDTO[]> {
        const query = `
            SELECT
                pt.description AS tipo_pagamento,
                SUM(p.value) AS valor_total
            FROM payments p
            JOIN payment_types pt ON pt.id = p.payment_type_id
            JOIN sales s ON s.id = p.sale_id
            WHERE s.created_at >= NOW() - INTERVAL $1 DAY
            GROUP BY pt.description
            ORDER BY valor_total DESC;
        `;

        const result = await this.connection.execute(query, [days]);
        return result.map((row: any) => new PaymentsByTypeDTO(row));
    }
}
