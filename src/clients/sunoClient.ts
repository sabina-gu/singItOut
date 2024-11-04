import console from "console";

import axios from "axios";

// replace your vercel domain
const baseUrl:string = "http://localhost:3000";

export interface GenerateTrackPayload {
    prompt: string;
    tags: string;
    title: string;
    make_instrumental: boolean;
    wait_audio: boolean;
}

async function customGenerateAudio (payload: GenerateTrackPayload) {
    const url:string = `${baseUrl}/api/custom_generate`;
console.log("suno")
    try {
        // Выполнение запроса к API
        const response = await axios.post(url, payload, {
            headers: { "Content-Type": "application/json" },
            timeout: 1800000,
        });
        console.log("suno2")
        // Возвращаем данные ответа
        return response.data[0].audio_url;

    } catch (error) {
        // Обработка ошибки запроса
        console.error('Ошибка при генерации аудио:', error);

        // Можете вернуть значение по умолчанию или выбросить ошибку дальше
        throw new Error('Не удалось сгенерировать аудио');
    }
}


export default customGenerateAudio;
