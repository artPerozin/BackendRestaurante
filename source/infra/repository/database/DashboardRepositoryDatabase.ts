import { CashFlowByDayDTO } from "../../../domain/DTO/CashFlowByDayDto";
import { CustomerRetentionDTO } from "../../../domain/DTO/CustomerRetentionDto";
import { DeliveryLocationDTO } from "../../../domain/DTO/DeliveryLocationDto";
import { PaymentsByTypeDTO } from "../../../domain/DTO/PaymentsByTypeDto";
import { RegionPerformanceDTO } from "../../../domain/DTO/RegionPerformanceDto";
import { SalesByChannelDescriptionDTO } from "../../../domain/DTO/SalesByChannelDescriptionDto";
import { TopItemDTO } from "../../../domain/DTO/TopItemDto";
import { TemporalInputDto } from "../../../domain/DTO/TemporalInputDto";
import DashboardRepositoryInterface from "../../../domain/Interfaces/DashboardRepositoryInterface";
import Connection from "../../database/Connection";
import { WeeklyAverageTicketDTO } from "../../../domain/DTO/WeeklyAverageTicketDto";
import { WeeklyRevenueDTO } from "../../../domain/DTO/WeeklyRevenueDTO ";
import { WeeklyDeliveriesDTO } from "../../../domain/DTO/WeeklyDeliveriesDTO";

export default class DashboardRepositoryDatabase implements DashboardRepositoryInterface {
    constructor(protected readonly connection: Connection) {}

    async getPerformanceByRegion(period: TemporalInputDto): Promise<RegionPerformanceDTO[]> {
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
              AND s.created_at >= $1
              AND s.created_at <= $2
            GROUP BY da.neighborhood, da.city
            HAVING COUNT(*) >= 10
            ORDER BY avg_delivery_minutes DESC;
        `;

        const result = await this.connection.execute(query, [period.start_date, period.end_date]);
        return result.map((row: any) => new RegionPerformanceDTO(row));
    }

    async getTopItems(period: TemporalInputDto): Promise<TopItemDTO[]> {
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
              AND s.created_at >= $1
              AND s.created_at <= $2
            GROUP BY i.name
            ORDER BY times_added DESC
            LIMIT 20;
        `;

        const result = await this.connection.execute(query, [period.start_date, period.end_date]);
        return result.map((row: any) => new TopItemDTO(row));
    }

    async getDeliveryLocations(period: TemporalInputDto): Promise<DeliveryLocationDTO[]> {
        const query = `
            SELECT
                da.latitude AS lat,
                da.longitude AS lng
            FROM delivery_addresses da
            JOIN sales s ON s.id = da.sale_id
            WHERE s.sale_status_desc = 'COMPLETED'
              AND s.created_at >= $1
              AND s.created_at <= $2
            LIMIT 100
        `;

        const result = await this.connection.execute(query, [period.start_date, period.end_date]);
        return result.map((row: any) => new DeliveryLocationDTO(row));
    }

    async getCashFlow(period: TemporalInputDto): Promise<CashFlowByDayDTO[]> {
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
                    ELSE 0 
                END AS average_ticket
            FROM sales s
            WHERE s.created_at >= $1
              AND s.created_at <= $2
              AND s.sale_status_desc = 'COMPLETED'
            GROUP BY DATE(s.created_at)
            ORDER BY DATE(s.created_at);
        `;

        const result = await this.connection.execute(query, [period.start_date, period.end_date]);
        return result.map((row: any) => new CashFlowByDayDTO(row));
    }
    
    async getSalesByChannelDescription(period: TemporalInputDto): Promise<SalesByChannelDescriptionDTO[]> {
        const query = `
            SELECT
                c.description,
                COUNT(*) AS total_sales
            FROM sales s
            JOIN channels c ON c.id = s.channel_id
            WHERE s.sale_status_desc = 'COMPLETED'
              AND s.created_at >= $1
              AND s.created_at <= $2
            GROUP BY c.description
            ORDER BY total_sales DESC;
        `;

        const result = await this.connection.execute(query, [period.start_date, period.end_date]);
        return result.map((row: any) => new SalesByChannelDescriptionDTO(row));
    }

    async getCustomerRetention(period: TemporalInputDto): Promise<CustomerRetentionDTO[]> {
        const query = `
            WITH last_order_per_customer AS (
                SELECT
                    customer_id,
                    MAX(created_at) AS last_order_date
                FROM sales
                WHERE customer_id IS NOT NULL
                AND created_at >= $1
                AND created_at <= $2
                GROUP BY customer_id
            )
            SELECT
                CASE
                    WHEN last_order_date < $2::timestamp - INTERVAL '30 days' THEN 'perdido'
                    ELSE 'fiel'
                END AS status,
                COUNT(*) AS quantidade
            FROM last_order_per_customer
            GROUP BY status;
        `;

        const result = await this.connection.execute(query, [period.start_date, period.end_date]);
        return result.map((row: any) => new CustomerRetentionDTO(row));
    }

    async getPaymentsByType(period: TemporalInputDto): Promise<PaymentsByTypeDTO[]> {
        const query = `
            SELECT
                pt.description AS tipo_pagamento,
                SUM(p.value) AS valor_total
            FROM payments p
            JOIN payment_types pt ON pt.id = p.payment_type_id
            JOIN sales s ON s.id = p.sale_id
            WHERE s.sale_status_desc = 'COMPLETED'
              AND s.created_at >= $1
              AND s.created_at <= $2
            GROUP BY pt.description
            ORDER BY valor_total DESC;
        `;

        const result = await this.connection.execute(query, [period.start_date, period.end_date]);
        return result.map((row: any) => new PaymentsByTypeDTO(row));
    }

    async getWeeklyAverageTicket(): Promise<WeeklyAverageTicketDTO[]> {
        const query = `
            SELECT COALESCE(SUM(value_paid) / COUNT(*), 0) AS ticket_medio
            FROM sales
            WHERE created_at >= NOW() - INTERVAL '7 days';
        `;
        const result = await this.connection.execute(query);
        return result.map((row: any) => new WeeklyAverageTicketDTO(row));    
    }

    async getWeeklyRevenue(): Promise<WeeklyRevenueDTO[]> {
        const query = `
            SELECT COALESCE(SUM(value_paid), 0) AS faturamento
            FROM sales
            WHERE created_at >= NOW() - INTERVAL '7 days';
        `;
        const result = await this.connection.execute(query);
        return result.map((row: any) => new WeeklyRevenueDTO(row));
    }

    async getWeeklyDeliveries(): Promise<WeeklyDeliveriesDTO[]> {
        const query = `
            SELECT COUNT(*) AS total_deliveries
            FROM delivery_sales ds
            JOIN sales s ON s.id = ds.sale_id
            WHERE ds.status = 'DELIVERED' 
            AND s.created_at >= NOW() - INTERVAL '30 days';
        `;
        const result = await this.connection.execute(query);
        return [new WeeklyDeliveriesDTO(result[0])];
    }
}
