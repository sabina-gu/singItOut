import {Scenes} from "telegraf";
import {MyContext} from "../../index";
import {generateTextSongWithFeedback} from "../../clients/generateTextSongWithFeedback";
import {handleChangeAction} from "../../utils/handleChangeAction";
import console from "console";
import {deletePreviousMessage} from "../../utils/deletePreviousMessage";
import asyncWrapper from "../../utils/error-handler";
import {handleStartCommand} from "../../utils/handleStartCommand";
import {handleTextWithReplyForChoosingButton} from "../../utils/handleTextWithReplyForChoosingButton";
import {BaseScene} from "telegraf/typings/scenes";
import {Answer} from "../../constants";


const subsequentGenerationTextScene:BaseScene<MyContext> = new Scenes.BaseScene<MyContext>('subsequentGenerationTextScene');

subsequentGenerationTextScene.enter(asyncWrapper(async (ctx:MyContext):Promise<void> => {
    ctx.session.attempts += 1;
    console.log(ctx.session.attempts);
    await ctx.reply('Пожалуйста, напишите, что вам не понравилось или что вы хотите изменить в тексте песни.');
}));

subsequentGenerationTextScene.command("start", asyncWrapper(handleStartCommand));

subsequentGenerationTextScene.on("text", asyncWrapper(async (ctx:MyContext):Promise<void> => {
    const userFeedback = 'text' in ctx.message ? ctx.message.text : '';
    await ctx.reply('Подождите немного, сейчас сгенерирую новый текст...');
    const songText = await generateTextSongWithFeedback(ctx.session.songText, userFeedback);
    ctx.session.songText = songText;
    await ctx.reply(songText);
    await handleChangeAction(ctx);
}));


subsequentGenerationTextScene.command("start", asyncWrapper(handleStartCommand));

subsequentGenerationTextScene.on('text', handleTextWithReplyForChoosingButton("subsequentGenerationTextScene"));

subsequentGenerationTextScene.on('callback_query', asyncWrapper(async (ctx:MyContext):Promise<unknown> => {
    await deletePreviousMessage(ctx);

    const answerAboutChange:string = 'data' in ctx.callbackQuery ? (ctx.callbackQuery.data as string) : "";

    if (answerAboutChange === Answer.accept) {
        return ctx.scene.enter('generationSongScene');
    } else if (answerAboutChange === Answer.change) {
        if (ctx.session.attempts <= 2) {
            return ctx.scene.enter('subsequentGenerationTextScene');
        } else {
            return ctx.scene.enter('textPaymentScene');
        }
    }
}));

subsequentGenerationTextScene.command("start", asyncWrapper(handleStartCommand));




export default subsequentGenerationTextScene;
