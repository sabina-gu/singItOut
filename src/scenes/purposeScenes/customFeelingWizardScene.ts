import {handleStartCommand} from "../../utils/handleStartCommand";
import {Scenes} from "telegraf";
import {MyContext} from "../../index";
import asyncWrapper from "../../utils/error-handler";
import {WizardScene} from "telegraf/typings/scenes";

const customFeelingWizardScene:WizardScene<MyContext> = new Scenes.WizardScene<MyContext>(
    'customFeelingWizardScene',


    asyncWrapper(async (ctx: MyContext):Promise<void> => {
        await ctx.reply('Опиши свои чувства 🌼');
        await ctx.wizard.next();
    }),


    asyncWrapper(async (ctx: MyContext):Promise<void> => {
        ctx.session.subPurpose = 'text' in ctx.message ? ctx.message.text : "";
        await ctx.scene.enter('recipientStatusScene');
    })
);

// Обработка команды /start для перезапуска сцены
customFeelingWizardScene.command("start", asyncWrapper(handleStartCommand));

export default  customFeelingWizardScene;
