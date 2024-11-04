import {Scenes} from "telegraf";
import {MyContext} from "../../index";
import {handleStartCommand} from "../../utils/handleStartCommand";
import asyncWrapper from "../../utils/error-handler";
import {WizardScene} from "telegraf/typings/scenes";


const congratulationWizardScene:WizardScene<MyContext> = new Scenes.WizardScene<MyContext>(
    'congratulationWizardScene',


    asyncWrapper(async (ctx:MyContext):Promise<void> => {
        await ctx.reply('C чем Вы хотите поздравить?');
        await ctx.wizard.next();
    }),


    asyncWrapper(async (ctx:MyContext):Promise<void> => {
        ctx.session.subPurpose = 'text' in ctx.message ? ctx.message?.text : "";
        await ctx.scene.enter('recipientStatusScene');
    })
);


congratulationWizardScene.command("start", asyncWrapper(handleStartCommand));


export default congratulationWizardScene;
