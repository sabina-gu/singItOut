import asyncWrapper from "./error-handler";
import {MyContext} from "../../index";
import {deletePreviousMessage} from "./deletePreviousMessage";

export const handleTextWithReplyForChoosingButton = (sceneName: string) => {
    return asyncWrapper(async (ctx: MyContext):Promise<unknown> => {
        await deletePreviousMessage(ctx);
        await ctx.reply("Пожалуйста, выбери один из предложенных вариантов с кнопок 👇.");
        return ctx.scene.enter(sceneName);
    });
};
