import { Markup, Scenes } from "telegraf";
import { MyContext } from "../../index";
import { Style } from "../constants";
import {deletePreviousMessage} from "../utils/deletePreviousMessage";
import asyncWrapper from "../utils/error-handler";
import {handleStartCommand} from "../utils/handleStartCommand";
import {handleTextWithReplyForChoosingButton} from "../utils/handleTextWithReplyForChoosingButton";
import {BaseScene} from "telegraf/typings/scenes";

async function sendStyleButtons(ctx: MyContext):Promise<void> {
    const sentMessage = await ctx.reply(
        'Какое настроение ты хочешь передать в треке? 🎶',
        Markup.inlineKeyboard([
            [Markup.button.callback('Веселое и энергичное 😄🎉', Style.joy)],
            [Markup.button.callback('Романтичное и нежное 💕', Style.romantic)],
            [Markup.button.callback('Серьезное и глубокое 🌊', Style.serious)],
            [Markup.button.callback('Ностальгическое 💭', Style.nostalgic)],
            [Markup.button.callback('Спокойное и расслабляющее 🧘‍♂️', Style.calm)]
        ])
    );
    ctx.session.messageToDelete = sentMessage.message_id;
}


const styleOfTrackScene:BaseScene<MyContext> = new Scenes.BaseScene<MyContext>('styleOfTrackScene');

styleOfTrackScene.enter(asyncWrapper(async (ctx:MyContext):Promise<void> => {
    await sendStyleButtons(ctx);
}));

styleOfTrackScene.command("start", asyncWrapper(handleStartCommand));


styleOfTrackScene.on('text', handleTextWithReplyForChoosingButton("styleOfTrackScene"));

styleOfTrackScene.command("start", asyncWrapper(handleStartCommand));


styleOfTrackScene.on('callback_query', asyncWrapper(async (ctx:MyContext):Promise<void> => {
    await deletePreviousMessage(ctx);

    const style:string = 'data' in ctx.callbackQuery ? (ctx.callbackQuery?.data as string) : "";
    ctx.session.styleOfTrack = style || '';

    await ctx.scene.enter('includedPhrasesWizardScene');

}));


styleOfTrackScene.command("start", asyncWrapper(handleStartCommand));



export default styleOfTrackScene;
