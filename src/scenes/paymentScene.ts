import {Scenes} from 'telegraf';
import { MyContext } from '../index';

import {handleStartCommand} from "../utils/handleStartCommand";
import asyncWrapper from "../utils/error-handler";
import {BaseScene} from "telegraf/typings/scenes";
import {sendInvoice} from "../utils/payment/sendInvoice";

const paymentScene:BaseScene<MyContext> = new Scenes.BaseScene<MyContext>('paymentScene');

paymentScene.enter(asyncWrapper(async (ctx:MyContext):Promise<void> => {
        await sendInvoice(ctx, ctx.chat.id, 400);
}));

paymentScene.command("start", asyncWrapper(handleStartCommand));


export default paymentScene;
