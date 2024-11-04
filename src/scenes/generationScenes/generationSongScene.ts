import {Markup, Scenes} from "telegraf";
import {MyContext} from "../../index";
import {getTags} from "../../utils/getTags";
import customGenerateAudio, {GenerateTrackPayload} from "../../clients/sunoClient";
import console from "console";
import downloadAudioFile from "../../utils/downloadAudioFile";
import {trimAudioTo40Seconds} from "../../utils/trimAudioTo40Seconds";
import asyncWrapper from "../../utils/error-handler";
import {handleStartCommand} from "../../utils/handleStartCommand";
import {BaseScene} from "telegraf/typings/scenes";

const generationSongScene:BaseScene<MyContext> = new Scenes.BaseScene<MyContext>('generationSongScene');

generationSongScene.enter(asyncWrapper(async (ctx:MyContext):Promise<void> => {
    await ctx.reply("Сейчас сгенерирую песню");
    const tags:string = getTags(ctx.session.purpose, ctx.session.styleOfTrack, ctx.session.voice, ctx.session.genre);

    const payload: GenerateTrackPayload = {
        prompt: ctx.session.songText,
        tags: tags,
        title: `${ctx.session.nameOfRecipient}`,
        make_instrumental: false,
        wait_audio: true
    };

    console.log(payload);

    try {
        const audioUrl:string = await customGenerateAudio(payload);

        if (audioUrl) {
            const audioBuffer:Buffer = await downloadAudioFile(audioUrl);

            // Обрезаем аудио до 20 секунд
            const shortAudioBuffer:Buffer = await trimAudioTo40Seconds(audioBuffer);

            // Отправляем обрезанную версию
            await ctx.sendAudio({ source: shortAudioBuffer, filename: `${ctx.session.nameOfRecipient}.mp3` });

            const sentMessage = await ctx.reply(
                'Вы получили сокращенную версию песни (20 секунд). Для получения полной версии необходимо оплатить.',
                Markup.inlineKeyboard([
                    [Markup.button.callback('Получить полную версию', "Получить")],
                    [Markup.button.callback('Полная версия не нужна', "Отказаться")]
                ])
            );

            ctx.session.messageToDelete = sentMessage.message_id;

            // Сохраняем полный трек в сессии или базе данных, чтобы его можно было отправить после оплаты
            ctx.session.fullAudioBuffer = audioBuffer;
        } else {
            await ctx.reply('Не удалось сгенерировать аудио.');
        }
    } catch (error) {
        console.error('Ошибка при генерации аудио:', error);
        await ctx.reply('Извините, произошла ошибка при генерации аудио.');
    }
}));

generationSongScene.command("start", asyncWrapper(handleStartCommand));

export default generationSongScene;
