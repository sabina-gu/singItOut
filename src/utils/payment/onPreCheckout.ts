import {MyContext} from "../../../index";
import getInvoiceFromDatabase from "../../DB/getInvoiceFromDatabase";


export async function onPreCheckout(ctx: MyContext):Promise<void>{
    const { id, invoice_payload } = ctx.preCheckoutQuery;
    // here you can check if this invoice can be fulfilled
    const invoice = await getInvoiceFromDatabase(invoice_payload);
    try {
        // Если инвойс найден
        if (invoice) {
            await ctx.telegram.answerPreCheckoutQuery(id, true);
        } else {
            await ctx.telegram.answerPreCheckoutQuery(id, false);
            await ctx.reply('К сожалению, инвойс не найден или истёк.');
        }
    } catch (e) {
        // handle error
        throw e;
    }
}

