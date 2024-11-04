import { Markup, Scenes } from "telegraf";
import { MyContext } from "../index";
import { Purpose } from "../constants";
import {deletePreviousMessage} from "../utils/deletePreviousMessage";
import {handleStartCommand} from "../utils/handleStartCommand";
import asyncWrapper from "../utils/error-handler";
import {handleTextWithReplyForChoosingButton} from "../utils/handleTextWithReplyForChoosingButton";
import {BaseScene} from "telegraf/typings/scenes";

async function sendPurposeMessage(ctx: MyContext):Promise<void> {

    const sentMessage = await ctx.reply(
        'А теперь расскажи, для чего ты хочешь создать этот трек? 🎯',
        Markup.inlineKeyboard([
            [Markup.button.callback('Для поздравления 🎉', Purpose.congratulation)],
            [Markup.button.callback('Для извинения 🙏', Purpose.apology)],
            [Markup.button.callback('Выражение чувств 💖', Purpose.feeling)],
            [Markup.button.callback('Мотивация 💪', Purpose.motivation)],
            [Markup.button.callback('Другое ✍️', Purpose.other)],
        ])
    );
    ctx.session.messageToDelete = sentMessage.message_id;
}

const mainScene:BaseScene<MyContext> = new Scenes.BaseScene<MyContext>('mainScene');

mainScene.enter(asyncWrapper(async (ctx:MyContext):Promise<void> => {
    await ctx.reply('Привет! 👋 Я помогу тебе создать уникальный трек 🎶, который точно понравится! 😊');
    await sendPurposeMessage(ctx);
}));

mainScene.command("start", asyncWrapper(handleStartCommand));

mainScene.on('text', handleTextWithReplyForChoosingButton("mainScene"));

mainScene.on('callback_query', asyncWrapper(async (ctx:MyContext):Promise<void> => {
    await deletePreviousMessage(ctx);

    ctx.session.purpose = 'data' in ctx.callbackQuery ? ctx.callbackQuery?.data as string : "";

    switch (ctx.session.purpose) {
        case Purpose.congratulation:
            await ctx.scene.enter('congratulationWizardScene');
            break;
        case Purpose.apology:
            await ctx.scene.enter('apologyScene');
            break;
        case Purpose.feeling:
            await ctx.scene.enter('feelingsScene');
            break;
        case Purpose.motivation:
            await ctx.scene.enter('motivationWizardScene');
            break;
        case Purpose.other:
            await ctx.scene.enter('anotherGoalForTrackScene');
            break;
        default:
            await ctx.scene.enter('anotherGoalForTrackScene');
            break;
    }
}));

mainScene.command("start", asyncWrapper(handleStartCommand));

export default mainScene;
