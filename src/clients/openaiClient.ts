import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import * as process from "process";
import console from "console";
import {generatePromptForLyrics} from "../utils/generatePromptForLyrics";
import {Chat} from "openai/resources";
import ChatCompletion = Chat.ChatCompletion;

dotenv.config();

const openai:OpenAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function openaiClient(prompt:string): Promise<string> {

    try {
        const completion:ChatCompletion = await openai.chat.completions.create({
            model: 'gpt-4o',  // Используем модель GPT-4 для улучшенной генерации текста
            messages: [
                { role: 'system', content: prompt },
                { role: 'user', content: prompt }  // Сам запрос
            ],
            max_tokens: 800,  // Увеличиваем количество токенов для завершения песни
            temperature: 0.9,  // Оставляем креативность на умеренном уровне
            frequency_penalty: 0.3,  // Слегка увеличиваем штраф за частое повторение одних и тех же слов
            presence_penalty: 0.6  // Увеличиваем разнообразие слов
        });
        console.log('message' in completion.choices[0] ? completion.choices[0]?.message.content : 'Sorry, I could not generate a song at the moment.')
        return 'message' in completion.choices[0] ? completion.choices[0]?.message.content : 'Sorry, I could not generate a song at the moment.';

    } catch (error) {
        console.error("Ошибка при генерации текста песни:", error);
        throw new Error("Ошибка при генерации текста песни.");
    }
}
