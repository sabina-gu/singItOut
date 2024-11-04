// Создаем функцию для обработки нажатия кнопки "Изменить"
import {MyContext} from "../index";
import {Markup} from "telegraf";
import {Answer} from "../constants";

export async function handleChangeAction(ctx: MyContext):Promise<void> {

    const sentMessage = await ctx.reply("Довольны ли вы текстом?", Markup.inlineKeyboard([
        [Markup.button.callback('Принять', Answer.accept)],
        [Markup.button.callback('Изменить', Answer.change)]
    ]));

    ctx.session.messageToDelete = sentMessage.message_id;
}
