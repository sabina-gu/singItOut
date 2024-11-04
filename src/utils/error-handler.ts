import { MyContext} from "../index";
import console from "console";
import {BaseScene} from "telegraf/typings/scenes";


function asyncWrapper(fn: (ctx: MyContext) => Promise<void> | Promise<unknown> | void) {
    return async (ctx: any):Promise<void> => {
        try {
            await fn(ctx);
        } catch (err) {
            console.error('Произошла ошибка:', err);
            await ctx.reply('Произошла неожиданная ошибка. Нажмите на кнопку меню, и начните сначала.');
        }
    };
}

export default asyncWrapper;
