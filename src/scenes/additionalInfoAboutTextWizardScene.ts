import {Scenes} from "telegraf";
import {MyContext} from "../index";
import asyncWrapper from "../utils/error-handler";
import {handleStartCommand} from "../utils/handleStartCommand";
import {WizardScene} from "telegraf/typings/scenes";

const additionalInfoAboutTextWizardScene:WizardScene<MyContext> = new Scenes.WizardScene<MyContext>(
    'additionalInfoAboutTextWizardScene',

    asyncWrapper(async (ctx:MyContext):Promise<void> => {
        await ctx.reply('Хочешь ли ты добавить в трек важные воспоминания или моменты, которые вас связывают? 💭 Например, совместные события или любимые шутки?', {
            reply_markup: {
                keyboard: [['Пропустить']],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
        await ctx.wizard.next();
    }),


    asyncWrapper(async (ctx:MyContext):Promise<void> => {
        ctx.session.memories = 'text' in ctx.message ? ctx.message?.text : "";
        await ctx.scene.enter('voiceScene');
    })
);

additionalInfoAboutTextWizardScene.command("start", asyncWrapper(handleStartCommand));


export default additionalInfoAboutTextWizardScene
