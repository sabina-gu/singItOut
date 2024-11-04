import {Scenes} from "telegraf";
import {MyContext} from "../../../index";
import asyncWrapper from "../../utils/error-handler";
import {handleStartCommand} from "../../utils/handleStartCommand";
import {WizardScene} from "telegraf/typings/scenes";


const motivationWizardScene:WizardScene<MyContext> = new Scenes.WizardScene<MyContext>(
    'motivationWizardScene',


    asyncWrapper(async (ctx: MyContext):Promise<void> => {
        await ctx.reply('В чем именно ты хочешь поддержать или на что вдохновить человека? 💪');
        await ctx.wizard.next();
    }),

    asyncWrapper(async (ctx: MyContext):Promise<void> => {
        const userMotivationReason: string= 'text' in ctx.message ? ctx.message.text : '';
        ctx.session.subPurpose = userMotivationReason;
        await ctx.scene.enter('recipientStatusScene');
    })
);

motivationWizardScene.command("start", asyncWrapper(handleStartCommand));


export default motivationWizardScene;
