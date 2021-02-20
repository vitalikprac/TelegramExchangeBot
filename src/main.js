import dotenv from 'dotenv'
dotenv.config();

import TelegramBot from 'node-telegram-bot-api';

const TOKEN = process.env.TELEGRAM_TOKEN;
export const API_URL = process.env.API_URL;
export const bot = new TelegramBot(TOKEN, {polling: true});
export const localDB = {}

import {listCommand} from "./commands/listCommand.js";
import {exchangeCommand} from "./commands/exchangeCommand.js";
import {historyCommand} from "./commands/historyCommand.js";

const INCORRECT_TEXT = `Type: /list, /exchange /history`;

bot.on('message', (msg) => {
    const {text} = msg;
    if (!text){
        bot.sendMessage(msg.chat.id,INCORRECT_TEXT);
        return;
    }
    if (text.startsWith('/list') || text.startsWith('/lst')){
        listCommand(msg);
    }else if (text.startsWith('/exchange')){
        exchangeCommand(msg);
    }else if (text.startsWith('/history')){
        historyCommand(msg);
    }else {
        bot.sendMessage(msg.chat.id, INCORRECT_TEXT);
    }
});






