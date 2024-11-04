import axios from 'axios';

async function downloadAudioFile(url: string): Promise<Buffer> {
    const maxAttempts = 3;  // Количество попыток
    const retryDelay = 10000;  // Задержка между попытками (в миллисекундах)

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            console.log(`Попытка ${attempt}: Загрузка файла с URL: ${url}`);
            const response = await axios.get(url, {
                responseType: 'arraybuffer',  // Загрузка файла как бинарные данные
                timeout: 500000  // Тайм-аут 180 секунд (3 минуты)
            });


            // Логируем детали ответа для проверки
            console.log('HTTP статус ответа:', response.status);
            console.log('Заголовки ответа:', response.headers);
            console.log('Тип контента:', response.headers['content-type']);

            // Проверяем, действительно ли пришли бинарные данные
            if (!response.data || response.data.length === 0) {
                throw new Error('Получен пустой ответ или данные отсутствуют');
            }

            console.log('Файл загружен успешно на попытке:', attempt);
            return Buffer.from(response.data);  // Возвращаем Buffer данных
        } catch (error) {
            console.error(`Попытка ${attempt} загрузки файла не удалась:`, error.message || error);

            // Если это последняя попытка — выбрасываем ошибку
            if (attempt === maxAttempts) {
                throw new Error('Не удалось загрузить аудиофайл после нескольких попыток');
            }

            // Ожидание перед следующей попыткой
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
}

export default downloadAudioFile;
