import { Client } from "pg";
import * as dotenv from 'dotenv';
import * as process from "process";
import console from "console";

dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

const getInvoiceFromDatabase = async (payload: string) => {
    try {
        const query:string = `
      SELECT * FROM invoices
      WHERE payload = $1
      LIMIT 1;
    `;

        const values = [payload];

        // Выполнение запроса
        const res = await client.query(query, values);

        if (res.rows.length > 0) {
            console.log("Информация о счете найдена:", res.rows[0]);
            return res.rows[0];  // Возвращаем данные счета
        } else {
            console.log("Счет с данным payload не найден.");
            return null;  // Возвращаем null, если счет не найден
        }
    } catch (err) {
        console.error("Ошибка при получении информации о счете из базы данных:", err);
        throw err;
    }
};

export default getInvoiceFromDatabase
