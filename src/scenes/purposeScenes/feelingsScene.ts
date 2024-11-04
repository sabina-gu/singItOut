import { MyContext } from "../../../index";
import { Markup, Scenes } from "telegraf";
import {deletePreviousMessage} from "../../utils/deletePreviousMessage";
import {handleStartCommand} from "../../utils/handleStartCommand";
import asyncWrapper from "../../utils/error-handler";
import {handleTextWithReplyForChoosingButton} from "../../utils/handleTextWithReplyForChoosingButton";
import {BaseScene} from "telegraf/typings/scenes";
import {EmotionTypes} from "../../constants";

// Функция для отправки сообщения с кнопками
async function sendFeelingsMessage(ctx: MyContext):Promise<void> {
    const sentMessage = await ctx.reply(
        'Какие чувства ты хочешь передать? 💕',
        Markup.inlineKeyboard([
            [Markup.button.callback('Любовь ❤️', EmotionTypes.Love)],
            [Markup.button.callback('Благодарность 🙏', EmotionTypes.Gratitude)],
            [Markup.button.callback('Дружбу 🤗', EmotionTypes.Friendship)],
            [Markup.button.callback('Сочувствие 🤍', EmotionTypes.Sympathy)],
            [Markup.button.callback('Уважение 🌟', EmotionTypes.Respect)],
            [Markup.button.callback('Поддержку 💪', EmotionTypes.Support)],
            [Markup.button.callback('Другое (опиши) 🌼', EmotionTypes.Other)],
        ])
    );
    ctx.session.messageToDelete = sentMessage.message_id;
}

const feelingsScene:BaseScene<MyContext> = new Scenes.BaseScene<MyContext>('feelingsScene');

feelingsScene.enter(asyncWrapper(async (ctx:MyContext):Promise<void> => {
    await sendFeelingsMessage(ctx);
}));

feelingsScene.command("start", asyncWrapper(handleStartCommand));


feelingsScene.on('text', handleTextWithReplyForChoosingButton("feelingsScene"));


feelingsScene.command("start", asyncWrapper(handleStartCommand));


feelingsScene.on('callback_query', asyncWrapper(async (ctx:MyContext):Promise<unknown> => {
    const feeling:string = 'data' in ctx.callbackQuery ? ctx.callbackQuery?.data as string : "";
    ctx.session.subPurpose = feeling;

    await deletePreviousMessage(ctx);

    if (feeling === EmotionTypes.Other) {
        return ctx.scene.enter('customFeelingScene');
    } else {
        await ctx.scene.enter('recipientStatusScene');
    }
}));

feelingsScene.command("start", asyncWrapper(handleStartCommand));



export default feelingsScene ;
