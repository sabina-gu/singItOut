import { Scenes } from "telegraf";
import { MyContext } from "../../../index";
import asyncWrapper from "../../utils/error-handler";
import {WizardScene} from "telegraf/typings/scenes";
import {handleStartCommand} from "../../utils/handleStartCommand";
import mainScene from "../mainScene";


const recipientNameWizardScene:WizardScene<MyContext> = new Scenes.WizardScene<MyContext>(
    'recipientNameWizardScene',
    asyncWrapper(async (ctx: MyContext):Promise<void> => {
        await ctx.reply('Как зовут человека, для которого ты хочешь создать трек? 📝');
        await ctx.wizard.next();
    }),

    asyncWrapper(async (ctx: MyContext):Promise<void> => {
        ctx.session.nameOfRecipient = 'text' in ctx.message ? ctx.message.text : '';
        await ctx.reply("Есть ли что-то важное, что нужно учесть про этого человека? 🧐 (черты характера, увлечения, профессия)");
        await ctx.wizard.next();
    }),

    asyncWrapper(async (ctx: MyContext):Promise<void> => {
        ctx.session.recipientDescription = 'text' in ctx.message ? ctx.message.text : '';
        await ctx.scene.enter('styleOfTrackScene');
    })
);

recipientNameWizardScene.command("start", asyncWrapper(handleStartCommand));


export default recipientNameWizardScene;
