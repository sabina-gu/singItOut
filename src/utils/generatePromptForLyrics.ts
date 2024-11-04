import {Style, Genres, Purpose, RecipientTypes} from "../constants";


export function generatePromptForLyrics(purpose: string, recipient: string, recipientDescription: string, includedPhrases: string, subPurpose: string, recipientRelative: string, memories: string, styleOfTrack: string, genre: string): string {


    const FirstPart:string = "Ты – опытный поэт и лирик, создающий красивые и мелодичные тексты песен с качественными рифмами. Напиши текст для песни."

    const LastPart:string = "Текст песни должен состоять из 3 куплетов и припева.  В каждом куплете и припеве последнее слово первой строчки должно рифмоваться с последним словом третьей строчки, а последнее слово второй строчки должно рифмоваться с последним словом четвертой строчки. Куплеты и припев должны быть ритмическими, с хорошими рифмами и без обрывов текста. Куплет обозначь так: [Verse], а припев так: [Chorus]. ";

    const PurposePart:string = purpose === Purpose.other ? `Цель песни: ${subPurpose}.` : `Цель песни: ${purpose}, а именно: ${subPurpose}.`

    const MemoriesPart:string = memories === "Пропустить" ? "" : `Общие с заказчиком текста воспоминания: ${memories}.`;

    const IncludedPhrasesPart:string = includedPhrases === "Пропустить" ? "" : `Используй фразы:"${includedPhrases}."`;

    const recipientStatus:string = recipientRelative === RecipientTypes.Myself ? "Песня посвящена заказчику" : `Он приходится заказчику песни: ${recipientRelative}`;
    let GenrePart:string = "Напиши текст для жанра ";

    let StyleOfLyrics:string = "Текст должен быть ";

    switch (styleOfTrack) {
        case Style.joy:
            StyleOfLyrics += "с юмором. Сделай его веселым.";
            break;
        case Style.romantic:
            StyleOfLyrics += "романтичным и нежным.";
            break;
        case Style.serious:
            StyleOfLyrics += "серьезным и глубоким по смыслу.";
            break;
        case Style.nostalgic:
            StyleOfLyrics += "ностальгическим.";
            break;
        case Style.calm:
            StyleOfLyrics += "спокойным и расслабляющим.";
            break;
        default:
            StyleOfLyrics = "";
            break;
    }


    switch (genre) {
        case Genres.pop:
            GenrePart += "русский поп.";
            break;
        case Genres.rap:
            GenrePart += "рэп, в стиле рэпера Басты.";
            break;
        case Genres.rock:
            GenrePart += "русский рок, в стиле Король и Шут.";
            break;
        case Genres.chanson:
            GenrePart += "русский шансон.";
            break;
        case Genres.jazz:
            GenrePart += "джазз.";
            break;
        default:
            GenrePart = "";
            break;
    }



    const prompt:string = `${FirstPart} ${PurposePart} Имя человека, которому посвящена песня: ${recipient}. Используй имя как можно чаще, особенно в припеве. ${recipientStatus}. Дополнительная информация о человеке, которому посвящена песня: ${recipientDescription} ${IncludedPhrasesPart} ${MemoriesPart} ${StyleOfLyrics} ${GenrePart} ${LastPart}`;

    console.log(prompt)
    return prompt;


}
