import {Markup, Scenes} from "telegraf";
import {MyContext} from "../index";
import {Genres} from "../constants";
import {handleStartCommand} from "../utils/handleStartCommand";
import {deletePreviousMessage} from "../utils/deletePreviousMessage";
import asyncWrapper from "../utils/error-handler";
import {BaseScene} from "telegraf/typings/scenes";

const genreScene:BaseScene<MyContext> = new Scenes.BaseScene<MyContext>('genreScene');

genreScene.enter(asyncWrapper(async (ctx:MyContext):Promise<void> => {
    const sentMessage = await ctx.reply(
        'Какой жанр песни вы хотите? 🎤',
        Markup.inlineKeyboard([
            [Markup.button.callback('Поп 🕺', Genres.pop)],
            [Markup.button.callback('Рэп 🎧', Genres.rap)],
            [Markup.button.callback('Джаз 🎷', Genres.jazz)],
            [Markup.button.callback('Шансон 🎤', Genres.chanson)],
            [Markup.button.callback('Рок 🤘', Genres.rock)],
        ])
    );
    ctx.session.messageToDelete = sentMessage.message_id;
}));

genreScene.on('text', asyncWrapper(async (ctx:MyContext):Promise<void> => {
    await deletePreviousMessage(ctx);
    await ctx.reply('Пожалуйста, выбери один из предложенных вариантов с кнопок 👇.');
    await ctx.scene.enter("voiceScene")
}));

genreScene.command("start", asyncWrapper(handleStartCommand));


genreScene.on('callback_query', asyncWrapper(async (ctx:MyContext):Promise<void> => {
    const genre = 'data' in ctx.callbackQuery ? (ctx.callbackQuery?.data as string) : "";
    ctx.session.genre = genre || '';

    await deletePreviousMessage(ctx);

    // Переход на финальную сцену
    await ctx.scene.enter('firstGenerationTextScene');
}));

genreScene.command("start", asyncWrapper(handleStartCommand));


export default genreScene;
