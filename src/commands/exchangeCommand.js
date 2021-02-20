import {bot, localDB} from "../main.js";
import {getNewDataFromApi} from "../util.js";

export const exchangeCommand = async (msg)=>{
    const text = msg.text.slice(10).trim();
    let result;
    if (text.startsWith('$')){
        const [from,toKeyword,to] = text.split(' ');
        const parsedValue = parseFloat(from.slice(1));
        result = await convert(parsedValue,'usd',to,toKeyword);
    }else{
        const [value,from,toKeyword,to] = text.split(' ');
        const parsedValue = parseFloat(value);
        result = await convert(parsedValue,from,to,toKeyword);
    }

    if (result){
        await bot.sendMessage(msg.chat.id,result);
    }else{
        await bot.sendMessage(msg.chat.id,'Incorrect input try again (/exchange $10 to CAD)');
    }
}

const convert = async (value,from,to,toKeyword)=>{
    if (!value || !from || !to || toKeyword?.toUpperCase() !== 'TO'){
        return;
    }
    from = from.toUpperCase();
    to = to.toUpperCase();
    const data = await getNewDataFromApi() ?? localDB.rates;
    const convertedValue = data.rates[to]*value;
    return `${value} ${from} to ${to} : ${convertedValue.toFixed(2)} ${to}`;
}
