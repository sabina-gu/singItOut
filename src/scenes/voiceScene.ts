import { Markup, Scenes } from "telegraf";
import { MyContext } from "../index";
import { Voice } from "../constants";
import {deletePreviousMessage} from "../utils/deletePreviousMessage";
import asyncWrapper from "../utils/error-handler";
import {handleStartCommand} from "../utils/handleStartCommand";
import {handleTextWithReplyForChoosingButton} from "../utils/handleTextWithReplyForChoosingButton";
import {BaseScene} from "telegraf/typings/scenes";

async function sendVoiceButtons(ctx: MyContext):Promise<void> {
    const sentMessage = await ctx.reply(
        'Какой голос ты бы хотел услышать в треке? 🎤',
        Markup.inlineKeyboard([
            [Markup.button.callback('Женский 👩‍🦰', Voice.woman)],
            [Markup.button.callback('Мужской 🧔', Voice.male)]
        ])
    );
    ctx.session.messageToDelete = sentMessage.message_id;
}

const voiceScene:BaseScene<MyContext> = new Scenes.BaseScene<MyContext>('voiceScene');

voiceScene.enter(asyncWrapper(async (ctx:MyContext):Promise<void> => {

    await sendVoiceButtons(ctx);
}));

voiceScene.command("start", asyncWrapper(handleStartCommand));


voiceScene.on('text', handleTextWithReplyForChoosingButton("voiceScene"));


voiceScene.command("start", asyncWrapper(handleStartCommand));


voiceScene.on('callback_query', asyncWrapper(async (ctx:MyContext):Promise<unknown> => {
    const voice:string = 'data' in ctx.callbackQuery ? (ctx.callbackQuery?.data as string) : "";
    ctx.session.voice = voice || '';

    await deletePreviousMessage(ctx);

    return ctx.scene.enter('genreScene');
}));

voiceScene.command("start", asyncWrapper(handleStartCommand));

export default voiceScene ;
