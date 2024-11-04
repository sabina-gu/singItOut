import {MyContext} from "../../index";
import {randomUUID} from "crypto";
import console from "console";
import createInvoiceInDatabase from "../../DB/createInvoiceInDatabase";

export async function sendInvoice(
    ctx: MyContext,
    chatId: number,
    amount: number = 1
) {
    const product = "Premium-version";
    const payload:string = randomUUID();
    try {
        await ctx.telegram.sendInvoice(chatId, {
            currency: "XTR",
            prices: [{ label: product, amount }],
            title: "Новая песня",
            provider_token: "",
            description: `Оплатите, пожалуйста, полную версию трэка`,
            payload,
            start_parameter: "no_pay",
        });

        console.log("Инвойс отправлен пользователю:", chatId);
        await createInvoiceInDatabase({ amount, product, payload, user_id: chatId });

    } catch (e) {
        // handle error
        console.log(e)
        console.log("err")
    }
}
