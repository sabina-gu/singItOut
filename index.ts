import { Telegraf, Scenes, session } from 'telegraf';
import * as dotenv from 'dotenv';
import * as process from "process";
import console from "console";
import mainScene from './src/scenes/mainScene';
import congratulationWizardScene from './src/scenes/purposeScenes/congratulationWizardScene';


import styleOfTrackScene from "./src/scenes/styleOfTrackScene";
import additionalInfoAboutTextWizardScene from "./src/scenes/additionalInfoAboutTextWizardScene";
import firstGenerationTextScene from "./src/scenes/generationScenes/firstGenerationTextScene";
import voiceScene  from "./src/scenes/voiceScene";
import apologyWizardScene from "./src/scenes/purposeScenes/apologyWizardScene";
import feelingsScene from "./src/scenes/purposeScenes/feelingsScene";
import motivationWizardScene from "./src/scenes/purposeScenes/motivationWizardScene";

import customRecipientWizardScene from "./src/scenes/recipientInfoScenes/customRecipientWizardScene";

import genreScene from "./src/scenes/genreScene";
import paymentScene from "./src/scenes/paymentScene";

import paidGenerationFullSongScene from "./src/scenes/generationScenes/paidGenerationFullSongScene";
import generationSongScene from "./src/scenes/generationScenes/generationSongScene";
import subsequentGenerationTextScene from "./src/scenes/generationScenes/subsequentGenerationTextScene";
import textPaymentScene from "./src/scenes/generationScenes/textPaymentScene";
import recipientStatusScene from "./src/scenes/recipientInfoScenes/recipientStatusScene";
import includedPhrasesWizardScene from "./src/scenes/includedPhrasesWizardScene";
import recipientNameWizardScene from "./src/scenes/recipientInfoScenes/recipientNameWizardScene";
import anotherPurposeForTrackWizardScene from "./src/scenes/purposeScenes/anotherPurposeForTrackWizardScene";
import customFeelingWizardScene from "./src/scenes/purposeScenes/customFeelingWizardScene";
import generatedTextWithFeedback from "./src/scenes/generationScenes/generatedTextWithFeedback";
import {Stage} from "telegraf/typings/scenes";
import {onSuccessfullPayment} from "./src/utils/payment/onSuccessfullPayment";
import {onPreCheckout} from "./src/utils/payment/onPreCheckout";

dotenv.config();


interface MySceneSession extends Scenes.WizardSessionData {
    purpose?: string;
    subPurpose?: string;
    nameOfRecipient?: string;
    recipientStatus?: string;
    recipientDescription?: string;
    styleOfTrack?: string;
    messageToDelete?: number;
    includedPhrases?: string;
    memories?: string;
    voice?: string;
    genre?:string;
    songText?: string;
    fullAudioBuffer?: Buffer;
    waitingForFeedback?:boolean;
    attempts?:number;
    isPaymentForAdditionalChangesInText?:boolean;
}

interface MyContext extends  Scenes.WizardContext<MySceneSession>  {
    scene: Scenes.SceneContextScene<MyContext, MySceneSession>;
    session: Scenes.SceneSession<MySceneSession> & MySceneSession | null
}

// Инициализация бота
const bot:Telegraf<MyContext> = new Telegraf<MyContext>(process.env.BOT_TOKEN as string,  {handlerTimeout: 9_000_000});


// Создаем Stage для сцены
const stage:Stage<MyContext> = new Scenes.Stage<MyContext>([mainScene, generationSongScene, congratulationWizardScene,generatedTextWithFeedback, recipientStatusScene, recipientNameWizardScene, recipientNameWizardScene, firstGenerationTextScene,customRecipientWizardScene, styleOfTrackScene, includedPhrasesWizardScene, additionalInfoAboutTextWizardScene, voiceScene, firstGenerationTextScene, apologyWizardScene, feelingsScene, customFeelingWizardScene, anotherPurposeForTrackWizardScene, motivationWizardScene,paymentScene, genreScene, paidGenerationFullSongScene, subsequentGenerationTextScene, textPaymentScene]);


// Используем сессии
bot.use(session());
bot.use(stage.middleware());

bot.start( (ctx ):void => {
    ctx.session.attempts=0
    ctx.scene.leave();
    ctx.scene.enter('mainScene');
});


// Запуск бота
bot.launch().catch(err => {
    console.log(err)
});


bot.on("pre_checkout_query", async (ctx):Promise<void> => {
    console.log("pre_checkout_query")
    await onPreCheckout(ctx);
});

bot.on("successful_payment", async (ctx):Promise<unknown> => {
    await onSuccessfullPayment(ctx)
    await ctx.reply('Оплата успешно прошла!');
    if (ctx.session.isPaymentForAdditionalChangesInText) {
        ctx.session.isPaymentForAdditionalChangesInText = false;
        return ctx.scene.enter('subsequentGenerationTextScene');

    }

    return ctx.scene.enter('paymentScene');
});

console.log('Бот запущен');


export { MyContext, MySceneSession };
