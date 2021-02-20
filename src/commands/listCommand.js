import {bot, localDB} from "../main.js";
import {getNewDataFromApi} from "../util.js";

export const listCommand = async (msg)=>{
    const data = await getNewDataFromApi() ?? localDB.rates;
    const ratesList = Object.entries(data.rates).map(([currency,value])=>{
        return `${currency}: ${value.toFixed(2)}`
    })
    const ratesText = ratesList.join('\n');
    await bot.sendMessage(msg.chat.id,`Base USD\n${ratesText}`);
}
