import { Client } from "pg";
import * as dotenv from 'dotenv';
import * as process from "process";
import console from "console";

dotenv.config();


type CreateInvoiceType = {
    user_id: number;
    product: string;
    amount: number;
    payload: string;

}

// Инициализация клиента PostgreSQL
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

// Функция для создания или обновления счета в базе данных
const createInvoiceInDatabase = async ({ user_id, payload, product, amount }: CreateInvoiceType) => {
    try {
        // Запрос на вставку или обновление данных в таблицу invoices
        const query:string = `
      INSERT INTO invoices (user_id, payload, product, amount)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (payload) 
      DO UPDATE SET 
        amount = EXCLUDED.amount,
        product = EXCLUDED.product,
        user_id = EXCLUDED.user_id
      RETURNING *;
    `;

        const values = [user_id, payload, product, amount];

        // Выполнение запроса
        const res = await client.query(query, values);
        console.log("Информация о счете успешно сохранена в базе данных:", res.rows[0]);
        return res.rows[0]; // Возвращаем данные для дальнейшего использования
    } catch (err) {
        console.error("Ошибка при сохранении информации о счете в базе данных:", err);
        throw err;
    }
};

export default createInvoiceInDatabase
