import { Client } from "pg";
import * as dotenv from 'dotenv';
import * as process from "process";
import console from "console";

dotenv.config();

// Инициализация клиента PostgreSQL
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();



type CreatePaymentType = {
    user_id: number;
    payment_id: string;
    amount: number;
    invoice_id: number;

}

// Функция для создания или обновления информации о платеже в базе данных
 const createPaymentInDatabase = async ({ user_id, payment_id, amount, invoice_id }: CreatePaymentType) => {
    try {
        // Запрос на вставку или обновление данных в таблицу payments
        const query = `
      INSERT INTO payments (user_id, payment_id, amount, invoice_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (payment_id) 
      DO UPDATE SET 
        user_id = EXCLUDED.user_id,
        amount = EXCLUDED.amount,
        invoice_id = EXCLUDED.invoice_id
      RETURNING *;
    `;

        const values = [user_id, payment_id, amount, invoice_id];

        // Выполнение запроса
        const res = await client.query(query, values);
        console.log("Информация о платеже успешно сохранена в базе данных:", res.rows[0]);
        return res.rows[0]; // Возвращаем данные для дальнейшего использования
    } catch (err) {
        console.error("Ошибка при сохранении информации о платеже в базе данных:", err);
        throw err;
    }
};

export default createPaymentInDatabase
