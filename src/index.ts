import { Telegraf, Scenes, session } from 'telegraf';
import * as dotenv from 'dotenv';
import * as process from "process";
import console from "console";
import mainScene from './scenes/mainScene';
import congratulationWizardScene from './scenes/purposeScenes/congratulationWizardScene';


import styleOfTrackScene from "./scenes/styleOfTrackScene";
import additionalInfoAboutTextWizardScene from "./scenes/additionalInfoAboutTextWizardScene";
import firstGenerationTextScene from "./scenes/generationScenes/firstGenerationTextScene";
import voiceScene  from "./scenes/voiceScene";
import apologyWizardScene from "./scenes/purposeScenes/apologyWizardScene";
import feelingsScene from "./scenes/purposeScenes/feelingsScene";
import motivationWizardScene from "./scenes/purposeScenes/motivationWizardScene";

import customRecipientWizardScene from "./scenes/recipientInfoScenes/customRecipientWizardScene";

import genreScene from "./scenes/genreScene";
import paymentScene from "./scenes/paymentScene";

import paidGenerationFullSongScene from "./scenes/generationScenes/paidGenerationFullSongScene";
import generationSongScene from "./scenes/generationScenes/generationSongScene";
import subsequentGenerationTextScene from "./scenes/generationScenes/subsequentGenerationTextScene";
import textPaymentScene from "./scenes/generationScenes/textPaymentScene";
import recipientStatusScene from "./scenes/recipientInfoScenes/recipientStatusScene";
import includedPhrasesWizardScene from "./scenes/includedPhrasesWizardScene";
import recipientNameWizardScene from "./scenes/recipientInfoScenes/recipientNameWizardScene";
import anotherPurposeForTrackWizardScene from "./scenes/purposeScenes/anotherPurposeForTrackWizardScene";
import customFeelingWizardScene from "./scenes/purposeScenes/customFeelingWizardScene";
import generatedTextWithFeedback from "./scenes/generationScenes/generatedTextWithFeedback";
import {Stage} from "telegraf/typings/scenes";
import {onSuccessfullPayment} from "./utils/payment/onSuccessfullPayment";
import {onPreCheckout} from "./utils/payment/onPreCheckout";

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
