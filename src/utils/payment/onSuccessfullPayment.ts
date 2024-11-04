import {MyContext} from "../../index";
import getInvoiceFromDatabase from "../../DB/getInvoiceFromDatabase";
import createPaymentInDatabase from "../../DB/createPaymentInDatabase";
import console from "console";

export async function onSuccessfullPayment(ctx: MyContext):Promise<void> {

    // Проверяем наличие поля message в ctx.update
    const message = "message" in ctx.update ? ctx.update.message : null;

    if (message) {

        // Проверяем наличие поля successful_payment в message
        const successful_payment = "successful_payment" in message ? message.successful_payment : null;

        if (successful_payment) {
            try {
                // Извлекаем необходимые данные из successful_payment
                const { total_amount, invoice_payload, telegram_payment_charge_id } = successful_payment;

                // Получаем инвойс из базы данных по payload
                const invoice = await getInvoiceFromDatabase(invoice_payload);

                if (invoice) {
                    // Создаем запись в базе данных о платеже
                    await createPaymentInDatabase({
                        payment_id: telegram_payment_charge_id,
                        user_id: ctx.from!.id,
                        amount: total_amount,
                        invoice_id: invoice.id,
                    });

                    console.log(`Платеж успешно создан для пользователя ${ctx.from!.id} на сумму ${total_amount}.`);
                } else {
                    // Логирование и сообщение пользователю в случае отсутствия инвойса в базе данных
                    console.error(`Инвойс с payload ${invoice_payload} не найден в базе данных.`);
                    await ctx.reply('Произошла ошибка: инвойс не найден. Пожалуйста, свяжитесь с поддержкой.');
                }
            } catch (error) {
                // Обработка и логирование ошибки
                console.error('Ошибка при обработке успешного платежа:', error);
                await ctx.reply('Произошла ошибка при обработке вашего платежа. Пожалуйста, попробуйте позже или свяжитесь с поддержкой.');
            }
        } else {
            // Если successful_payment отсутствует, отправляем уведомление
            console.error('successful_payment не найдено в сообщении.');
            await ctx.reply('Произошла ошибка: данные платежа не найдены.');
        }
    } else {
        // Если message отсутствует, отправляем уведомление
        console.error('Сообщение с успешным платежом не найдено в обновлении.');
        await ctx.reply('Произошла ошибка: сообщение не найдено.');
    }
}
