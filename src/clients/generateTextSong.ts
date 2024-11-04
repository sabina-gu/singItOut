import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import * as process from "process";
import {generatePromptForLyrics} from "../utils/generatePromptForLyrics";
import {openaiClient} from "./openaiClient";

dotenv.config();

const openai:OpenAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function generateTextSong(purpose: string, recipient: string, recipientDescription: string, includedPhrases: string, subPurpose: string, recipientRelative: string, memories: string, styleOfTrack: string, genre: string): Promise<string> {

    const prompt:string = generatePromptForLyrics(purpose, recipient, recipientDescription, includedPhrases, subPurpose, recipientRelative, memories, styleOfTrack, genre)

    const songText:string = await openaiClient(prompt)

    return songText;
}
