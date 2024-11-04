import {Scenes} from "telegraf";
import {MyContext} from "../../../index";
import asyncWrapper from "../../utils/error-handler";
import {handleStartCommand} from "../../utils/handleStartCommand";
import {BaseScene} from "telegraf/typings/scenes";


const paidGenerationFullSongScene:BaseScene<MyContext> = new Scenes.BaseScene<MyContext>('paidGenerationFullSongScene');

paidGenerationFullSongScene.enter(asyncWrapper(async (ctx:MyContext):Promise<void> => {
    await ctx.sendAudio({ source: ctx.session.fullAudioBuffer, filename: `${ctx.session.nameOfRecipient}.mp3` });
}));

paidGenerationFullSongScene.command("start", asyncWrapper(handleStartCommand));

export default paidGenerationFullSongScene;
