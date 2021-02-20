import fetch from "node-fetch";
import {API_URL, localDB} from "./main.js";
import {line} from "./line.js";

export const getNewDataFromApi = async ()=>{
    const elapsedTime = Date.now()-localDB.lastUpdateTime;
    const url = `${API_URL}/latest?base=USD`;
    let data;
    // 10 minutes in ms
    if (elapsedTime >= 10 * 60 * 1000 || !localDB.rates){
        const response = await fetch(url);
        data = await response.json();
        localDB.rates = data;
        localDB.lastUpdateTime = Date.now();
    }
    return data;
}

export const addDays = (date,days)=>{
    const result = new Date(date);
    result.setDate(result.getDate()+days);
    return result;
}


export const generateSvg = (param)=>{
    let data =Object.entries(param.rates).map(([key,value])=>{
        return {
            date: key,
            value: Object.values(value)?.[0]
        }
    })
    data = data.sort((a,b)=>{
        return new Date(a.date) - new Date(b.date);
    });
    const svg = line(data);
    return new Buffer.from(svg.svgString(),'utf-8');
}
