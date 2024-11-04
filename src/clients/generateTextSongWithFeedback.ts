import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import * as process from "process";
import console from "console";
import {openaiClient} from "./openaiClient";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function generateTextSongWithFeedback(initialSongText: string, userFeedback: string): Promise<string> {
    // Создаем новый prompt для OpenAI, учитывая замечания пользователя
    const prompt:string = `
Вы ранее сгенерировали следующий текст песни:

"${initialSongText}"

Пользователь предоставил следующие замечания или пожелания:

"${userFeedback}"

Пожалуйста, перепишите текст песни, учитывая эти замечания, чтобы получился более подходящий вариант.
`;

    const songText:string = await openaiClient(prompt)

    return songText;
}
