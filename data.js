"use strict"

function urlGenerator(num){ //Gets the url needed to retrieve data as a string.
    let current_date = new Date();
    let begin_date = new Date();
    begin_date.setDate(begin_date.getDate() - num);
    let current_timeStamp = current_date.getFullYear() + "-" + (current_date.getMonth() + 1) + "-" + current_date.getDate() + "T12:00:00";
    let begin_timeStamp = begin_date.getFullYear() + "-" + (begin_date.getMonth() + 1) + "-" + begin_date.getDate() + "T12:00:00";
    let query_string = "$where=incident_datetime between '" + begin_timeStamp.toString() + "' and '" + current_timeStamp.toString() +"'";
    let url = 'https://data.buffalony.gov/resource/d6g9-xbgu.json?';
    url += query_string;
    url = url.replace(/ /g, "%20");
    url = url.replace(/'/g, "%27");
    return url;
}
function crimeDicGen(crime, data){
    let acc = {'longitude' : [], 'latitude' : [], 'labels' : []};
    for(let obj of data){
        if (obj['incident_type_primary'] === crime){
            acc['longitude'].push(obj['longitude']);
            acc['latitude'].push(obj['latitude']);

            let time = obj['incident_datetime'];
            let month = time[5] + time[6];
            let day = time[8] + time[9];
            let hour = time[11] + time[12] + ":" + time[14] + time[15];
            time = month.toString() + "/" + day.toString() + " at " + hour.toString();
            let label = obj['incident_type_primary'] + " on " + time;
            acc['labels'].push(label);
        }
    }

    return acc;
}

async function data_filter(url){
    let data = await data_loader(url);
    let filtered_list = [];
    for(let object of data){
        let filtered_ob = {};
        if('latitude' in object && 'longitude' in object && 'incident_datetime' in object && 'incident_type_primary' in object) {
            filtered_ob['incident_datetime'] = object['incident_datetime'];
            filtered_ob['incident_type_primary'] = object['incident_type_primary'];
            filtered_ob['latitude'] = object['latitude'];
            filtered_ob["longitude"] = object["longitude"];
            filtered_list.push(filtered_ob);
        }
    }

    return filtered_list;
}
async function data_loader(url){
    try {
        let response = await fetch(url);
        let json = await response.text();
        return JSON.parse(json);
    } catch {
        console.error("Error fetching json data.");
    }
}

async function list_of_crimes(url){
    let data = await data_loader(url);
    let crime_list = [];
    for(let obj of data){
        if(!(crime_list.includes(obj['incident_type_primary']))){
            crime_list.push(obj['incident_type_primary']);
        }
    }

    return crime_list;
}

async function plotlyDataGenerator(recency) {
    let url = urlGenerator(recency);

    let crime_list = await list_of_crimes(url);

    let data = await data_filter(url);
    let plotly_data = {};

    let acc = {};
    for (let crime of crime_list) {
        let obj = crimeDicGen(crime, data);
        acc[crime] = obj;
    }


    return acc;
}


async function generateBetterMapBox(){
    let data = await plotlyDataGenerator(14);
    let plotlyList = [];
    for (let key of Object.keys(data)) {
        let currDic = data[key];
        let dataDic = {
            type : 'scattermapbox',
            lat : currDic['latitude'],
            lon : currDic['longitude'],
            mode : 'markers',
            text : currDic['labels'],
            name : key,
            marker: {
                size : 12
            },
        };
        plotlyList.push(dataDic);
    }

    let layout = {
        autosize : false,
        width: window.innerWidth - 1,
        height: window.innerHeight,
        hovermode:'closest',
        mapbox: {
            bearing:0,
            center: {
                lat: 42.88,
                lon: -78.87
            },
            style: 'carto-darkmatter',
            pitch:0,
            zoom:10
        },
    };

    Plotly.newPlot('map', plotlyList, layout);

}

generateBetterMapBox();





