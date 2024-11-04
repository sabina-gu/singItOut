// Общая функция для обработки команды /start и повторного входа в сцену
import {MyContext} from "../index";
import console from "console";
import {BaseScene} from "telegraf/typings/scenes";
import mainScene from "../scenes/mainScene";

export async function handleStartCommand(ctx: MyContext):Promise<void> {
    console.log("handleStartCommand")
    ctx.session = { cursor: 0 };
    await ctx.scene.leave();
    await ctx.scene.enter('mainScene');
}
