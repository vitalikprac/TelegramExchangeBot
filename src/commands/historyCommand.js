import fetch from "node-fetch";
import {API_URL, bot} from "../main.js";
import {addDays,generateSvg} from "../util.js";
import svg2img from 'svg2img';


const INCORRECT_INPUT = `Incorrect input try again (/history USD/CAD)`;

export const historyCommand = async(msg)=>{
    const {text} = msg;
    let [from,to,_] = text.slice(8)?.trim()?.split('/');
    if (!from || !to || _){
        await bot.sendMessage(msg.chat.id,INCORRECT_INPUT)
        return;
    }
    from = from.toUpperCase();
    to = to.toUpperCase();
    const currentDate = new Date()
    const endDate = currentDate.toISOString().slice(0,10); // end date in ISO format
    const startDate = addDays(endDate,-7).toISOString().slice(0,10); // start date in ISO format
    const response = await fetch(`${API_URL}/history?start_at=${startDate}&end_at=${endDate}&base=${from}&symbols=${to}`);
    const json = await response.json();
    if (json.error){
        await bot.sendMessage(msg.chat.id,INCORRECT_INPUT)
        return;
    }

    let dates = Object.keys(json.rates);
    // get dates for the last 7 days
    dates = dates.filter(x=>{
        return new Date()-new Date(x) < 1000*60*60*24*7;
    });
    if (dates.length ===0){
        await bot.sendMessage(msg.chat.id,'No exchange rate data is available for the selected currency')
        return;
    }

    const generatedSvg = generateSvg(json);
    const pngBuffer = svg2img(generatedSvg,(err,buffer)=>{
        bot.sendPhoto(msg.chat.id,buffer,{
            caption: `Currency history for the last 7 days between ${from} and ${to}`
        });
    });

}
