import {Markup, Scenes} from "telegraf";
import {MyContext} from "../../../index";
import {deletePreviousMessage} from "../../utils/deletePreviousMessage";
import {handleStartCommand} from "../../utils/handleStartCommand";
import asyncWrapper from "../../utils/error-handler";
import {handleTextWithReplyForChoosingButton} from "../../utils/handleTextWithReplyForChoosingButton";
import {BaseScene} from "telegraf/typings/scenes";
import {PaymentOptions} from "../../constants";
import {sendInvoice} from "../../utils/payment/sendInvoice";

const textPaymentScene:BaseScene<MyContext> = new Scenes.BaseScene<MyContext>('textPaymentScene');

textPaymentScene.enter(asyncWrapper(async (ctx:MyContext):Promise<void> => {
    ctx.session.isPaymentForAdditionalChangesInText = true;
    const sentMessage = await ctx.reply(
        'Вы превысили лимит исправлений, оплатите пожалуйста',
        Markup.inlineKeyboard([
            [Markup.button.callback('Оплатить', PaymentOptions.Pay)],
            [Markup.button.callback('Использовать текущий текст', PaymentOptions.UseCurrentText)]
        ])
    );
    ctx.session.messageToDelete = sentMessage.message_id;
}));

textPaymentScene.on('text', handleTextWithReplyForChoosingButton("textPaymentScene"));

textPaymentScene.command("start", asyncWrapper(handleStartCommand));

textPaymentScene.on('callback_query', async (ctx):Promise<unknown> => {
    let answerAboutPaymentText:string = 'data' in ctx.callbackQuery ? ctx.callbackQuery?.data as string : "";

    await deletePreviousMessage(ctx);

    switch (answerAboutPaymentText) {
        case PaymentOptions.Pay:
            await sendInvoice(ctx, ctx.chat.id, 200);

        case PaymentOptions.UseCurrentText:
            return ctx.scene.enter('generationSongScene');

        default:
            await ctx.reply("Неизвестный выбор. Пожалуйста, попробуйте снова.");
            break;
    }

})

textPaymentScene.command("start", asyncWrapper(handleStartCommand));


export default textPaymentScene;
