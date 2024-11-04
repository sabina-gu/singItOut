import { Scenes} from "telegraf";
import { MyContext } from "../../index";
import asyncWrapper from "../../utils/error-handler";
import {BaseScene} from "telegraf/typings/scenes";
import {generateTextSong} from "../../clients/generateTextSong";


const firstGenerationTextScene:BaseScene<MyContext> = new Scenes.BaseScene<MyContext>('firstGenerationTextScene');

firstGenerationTextScene.enter(asyncWrapper(async (ctx:MyContext):Promise<void> => {
    // Увеличиваем счетчик сгенерированных песен
    await ctx.reply('Подождите немного. Сейчас я сгенерирую текст песни. У вас будет 3 бесплатные попытки исправить его.');

    // Логика генерации или отправки запроса на генерацию
    const songText:string = await generateTextSong(
        ctx.session.purpose,
        ctx.session.nameOfRecipient,
        ctx.session.recipientDescription,
        ctx.session.includedPhrases,
        ctx.session.subPurpose,
        ctx.session.recipientStatus,
        ctx.session.memories,
        ctx.session.styleOfTrack,
        ctx.session.genre
    );

    ctx.session.songText = songText;

    await ctx.scene.enter("generatedTextWithFeedback")


}));




export default firstGenerationTextScene;
