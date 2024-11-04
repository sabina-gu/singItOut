import {Scenes} from "telegraf";
import {MyContext} from "../../../index";
import {handleStartCommand} from "../../utils/handleStartCommand";
import asyncWrapper from "../../utils/error-handler";
import {WizardScene} from "telegraf/typings/scenes";


const anotherPurposeForTrackWizardScene:WizardScene<MyContext> = new Scenes.WizardScene<MyContext>(
    'anotherGoalForTrackWizardScene',

    asyncWrapper(async (ctx: MyContext):Promise<void> => {
        await ctx.reply('Для чего ты хочешь создать этот трек? 🎯');
        await ctx.wizard.next();
    }),

    asyncWrapper(async (ctx: MyContext):Promise<void> => {
        const trackReason:string= 'text' in ctx.message ? ctx.message.text : '';
        ctx.session.purpose = trackReason;
        await ctx.scene.enter('recipientStatusScene');
    })
);

anotherPurposeForTrackWizardScene.command("start", asyncWrapper(handleStartCommand));

export default anotherPurposeForTrackWizardScene;
