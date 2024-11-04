import { Genres, Style, Voice } from "../constants";
import console from "console";

export function getTags(purpose: string, styleOfTrack: string, voice: string, genre: string): string {
    let tags = "";

    // Добавляем теги по стилю трека
    switch (styleOfTrack) {
        case Style.joy:
            tags += "funny, chillout, emotional, ";
            break;
        case Style.romantic:
            tags += "lyric, emotional, ";
            break;
        case Style.serious:
            tags += "deep, ";
            break;
        case Style.nostalgic:
            tags += "nostalgic, ";
            break;
        case Style.calm:
            tags += "meditative, peaceful, ";
            break;
        default:
            tags += "";
    }

    // Добавляем теги по голосу
    switch (voice) {
        case Voice.male:
            if (genre === Genres.chanson){
                tags += "bass male vocal, ";
                break;
            }
            tags += "male voice, ";
            break;
        case Voice.woman:
            if (genre === Genres.chanson){
                tags += "Low dramatic female voice, ";
                break;
            }
            tags += "female voice, ";
            break;
        default:
            tags += "male voice, ";
    }

    // Добавляем теги по жанру
    switch (genre) {
        case Genres.pop:
            tags += "Russian Dance Pop, ";
            break;
        case Genres.rap:
            tags += "rap, ";
            break;
        case Genres.rock:
            tags += "Russian rock, ";
            break;
        case Genres.jazz:
            tags += "1950s jazz scat, jazz ";
            break;
        case Genres.chanson:
            tags += "lyrics, Russian chanson, 1990 Russia, ";
            break;
        default:
            tags += "";
    }

    // Убираем последнюю запятую и пробел, если они есть
    tags = tags.trim().replace(/,\s*$/, "");

    console.log(tags)
    return tags;
}
