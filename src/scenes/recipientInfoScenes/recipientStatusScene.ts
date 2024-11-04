import {Markup, Scenes} from "telegraf";
import {MyContext} from "../../../index";
import {deletePreviousMessage} from "../../utils/deletePreviousMessage";
import {handleStartCommand} from "../../utils/handleStartCommand";
import motivationScene from "../purposeScenes/motivationWizardScene";
import asyncWrapper from "../../utils/error-handler";
import {BaseScene} from "telegraf/typings/scenes";
import {RecipientTypes} from "../../constants";
import {handleTextWithReplyForChoosingButton} from "../../utils/handleTextWithReplyForChoosingButton";
import mainScene from "../mainScene";

const recipientStatusScene:BaseScene<MyContext> = new Scenes.BaseScene<MyContext>('recipientStatusScene');


// Вспомогательная функция для отправки инлайн-кнопок с выбором получателя
async function sendRecipientButtons(ctx: MyContext):Promise<void> {
    const sentMessage = await ctx.reply(
        'Для кого будет этот трек? 👤',
        Markup.inlineKeyboard([
            [Markup.button.callback('Любимый человек 💑', RecipientTypes.Partner)],
            [Markup.button.callback('Друг/подруга 👯', RecipientTypes.Friend)],
            [Markup.button.callback('Мама 👩‍👦', RecipientTypes.Mother)],
            [Markup.button.callback('Папа 👨‍👧', RecipientTypes.Father)],
            [Markup.button.callback('Сестра 👧', RecipientTypes.Sister)],
            [Markup.button.callback('Брат 👦', RecipientTypes.Brother)],
            [Markup.button.callback('Жена 💍👰', RecipientTypes.Wife)],
            [Markup.button.callback('Муж 💍🤵', RecipientTypes.Husband)],
            [Markup.button.callback('Коллега 💼', RecipientTypes.Colleague)],
            [Markup.button.callback('Я сам 😎', RecipientTypes.Myself)],
            [Markup.button.callback('Другое ✍️', RecipientTypes.Other)],
        ])
    );
    ctx.session.messageToDelete = sentMessage.message_id;
}


recipientStatusScene.enter(asyncWrapper(async (ctx:MyContext):Promise<void> => {
    await sendRecipientButtons(ctx);
}));

recipientStatusScene.command("start", asyncWrapper(handleStartCommand));


recipientStatusScene.on('text', handleTextWithReplyForChoosingButton("recipientStatusScene"));


recipientStatusScene.command("start", asyncWrapper(handleStartCommand));

recipientStatusScene.on('callback_query', asyncWrapper(async (ctx:MyContext):Promise<unknown> => {
    const status:string = 'data' in ctx.callbackQuery ? (ctx.callbackQuery?.data as string) : "";
    ctx.session.recipientStatus = status || '';

    await deletePreviousMessage(ctx);

    if (status === RecipientTypes.Other) {
        return ctx.scene.enter('customRecipientWizardScene');
    } else {
        return ctx.scene.enter('recipientNameWizardScene');
    }
}));

recipientStatusScene.command("start", asyncWrapper(handleStartCommand));



export default recipientStatusScene;
