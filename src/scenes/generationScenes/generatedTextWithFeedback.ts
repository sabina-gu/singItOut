import {BaseScene} from "telegraf/typings/scenes";
import {MyContext} from "../../index";
import {Scenes} from "telegraf";
import asyncWrapper from "../../utils/error-handler";
import {handleChangeAction} from "../../utils/handleChangeAction";
import {handleTextWithReplyForChoosingButton} from "../../utils/handleTextWithReplyForChoosingButton";
import {handleStartCommand} from "../../utils/handleStartCommand";
import {deletePreviousMessage} from "../../utils/deletePreviousMessage";
import {Answer} from "../../constants";

const generatedTextWithFeedback:BaseScene<MyContext> = new Scenes.BaseScene<MyContext>('generatedTextWithFeedback');


generatedTextWithFeedback.enter(asyncWrapper(async (ctx:MyContext):Promise<void> => {
    await ctx.reply(ctx.session.songText);
    await handleChangeAction(ctx);
}));


generatedTextWithFeedback.on('text', handleTextWithReplyForChoosingButton("generatedTextWithFeedback"));


generatedTextWithFeedback.command("start", asyncWrapper(handleStartCommand));


generatedTextWithFeedback.on('callback_query', asyncWrapper(async (ctx:MyContext):Promise<unknown> => {
    await deletePreviousMessage(ctx);

    const answerAboutChange:string = 'data' in ctx.callbackQuery ? (ctx.callbackQuery?.data as string) : "";

    if (answerAboutChange === Answer.accept) {
        return ctx.scene.enter('generationSongScene');
    } else if (answerAboutChange === Answer.change) {
        return ctx.scene.enter('subsequentGenerationTextScene');
    }
}));

generatedTextWithFeedback.command("start", asyncWrapper(handleStartCommand));


export default generatedTextWithFeedback;
