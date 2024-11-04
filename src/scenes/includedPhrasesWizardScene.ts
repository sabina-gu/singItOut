// Сцена для ввода включённых фраз
import {MyContext} from "../index";
import {Scenes} from "telegraf";
import asyncWrapper from "../utils/error-handler";
import {handleStartCommand} from "../utils/handleStartCommand";
import { WizardScene} from "telegraf/typings/scenes";

const includedPhrasesWizardScene:WizardScene<MyContext> = new Scenes.WizardScene<MyContext>(
    'includedPhrasesWizardScene',

    asyncWrapper(async (ctx: MyContext):Promise<void> => {
        await ctx.reply('Есть ли слова или фразы, которые ты хочешь обязательно включить в песню? 📝', {
            reply_markup: {
                keyboard: [['Пропустить']],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
        await ctx.wizard.next();
    }),

    asyncWrapper(async (ctx: MyContext):Promise<void> => {
        const includedPhrases = 'text' in ctx.message ? ctx.message.text : '';
        ctx.session.includedPhrases = includedPhrases;
        await ctx.scene.enter('additionalInfoAboutTextWizardScene');
    })
);


includedPhrasesWizardScene.command("start", asyncWrapper(handleStartCommand));

export default includedPhrasesWizardScene;
