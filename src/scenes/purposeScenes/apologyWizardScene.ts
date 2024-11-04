import {Scenes} from "telegraf";
import {MyContext} from "../../../index";
import {handleStartCommand} from "../../utils/handleStartCommand";
import asyncWrapper from "../../utils/error-handler";
import {WizardScene} from "telegraf/typings/scenes";


const apologyWizardScene:WizardScene<MyContext> = new Scenes.WizardScene<MyContext>(
    'apologyWizardScene',

    asyncWrapper(async (ctx: MyContext):Promise<void> => {
        await ctx.reply('За что Вы хотите извиниться? 😔');
        await ctx.wizard.next();
    }),

    asyncWrapper(async (ctx: MyContext):Promise<void> => {
        const userApologyReason = 'text' in ctx.message ? ctx.message.text : '';
        ctx.session.subPurpose = userApologyReason;
        await ctx.scene.enter('recipientStatusScene');
    })
);

apologyWizardScene.command("start", asyncWrapper(handleStartCommand));


export default apologyWizardScene;
