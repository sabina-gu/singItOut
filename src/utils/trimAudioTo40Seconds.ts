import ffmpeg from "fluent-ffmpeg";
import { PassThrough, Readable } from 'stream';
import console from "console";

// Функция для преобразования Buffer в Readable поток
function bufferToStream(buffer: Buffer): Readable {
    const stream = new PassThrough();
    stream.end(buffer);
    return stream;
}

// Функция для обрезки аудиофайла до 20 секунд
export async function trimAudioTo40Seconds(audioBuffer: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject):void => {
        console.log("Начало обрезки аудио до 40 секунд");

        const outputStream = new PassThrough();
        const chunks: Buffer[] = [];

        ffmpeg()
            .input(bufferToStream(audioBuffer))  // Преобразуем Buffer в поток
            .inputFormat('mp3')
            .outputFormat('mp3')
            .duration(40) // Обрезаем до 40 секунд
            .on('start', () => console.log("ffmpeg: процесс обрезки запущен"))
            .on('progress', (progress) => console.log(`ffmpeg: прогресс - ${progress.percent}%`))
            .on('end', () => {
                console.log("ffmpeg: обрезка завершена");
                resolve(Buffer.concat(chunks));
            })
            .on('error', (err: unknown) => {
                console.error("Ошибка при обрезке аудио:", err);
                reject(err);
            })
            .pipe(outputStream);

        outputStream.on('data', (chunk) => chunks.push(chunk));
        outputStream.on('end', () => console.log("Чтение данных из потока завершено"));
        outputStream.on('error', (err) => {
            console.error("Ошибка в outputStream:", err);
            reject(err);
        });
    });
}
