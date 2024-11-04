import {handleStartCommand} from "../../utils/handleStartCommand";
import {Scenes} from "telegraf";
import {MyContext} from "../../index";
import asyncWrapper from "../../utils/error-handler";
import {WizardScene} from "telegraf/typings/scenes";

const customRecipientWizardScene:WizardScene<MyContext> = new Scenes.WizardScene<MyContext>(
    'customRecipientWizardScene',

    asyncWrapper(async (ctx: MyContext):Promise<void> => {
        await ctx.reply('Напишите для кого будет этот трек?');
        await ctx.wizard.next();
    }),

    asyncWrapper(async (ctx: MyContext):Promise<void> => {
        ctx.session.recipientStatus = 'text' in ctx.message ? ctx.message.text : '';
        await ctx.scene.enter('recipientNameWizardScene');
    })
);

customRecipientWizardScene.command("start", asyncWrapper(handleStartCommand));


export default customRecipientWizardScene;
