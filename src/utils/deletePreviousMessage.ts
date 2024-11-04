// Вспомогательная функция для удаления предыдущего сообщения
import {MyContext} from "../index";

export async function deletePreviousMessage(ctx: MyContext):Promise<void> {
    if (ctx.session.messageToDelete) {
        try {
            await ctx.deleteMessage(ctx.session.messageToDelete);
        } catch (err) {
            console.error('Не удалось удалить сообщение:', err);
        }
    }
}
