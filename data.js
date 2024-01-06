"use strict"
function urlGenerator(num){ //Gets the url needed to retrieve data as a string.

    let current_date = new Date();
    let begin_date = new Date();
    begin_date.setDate(begin_date.getDate() - num);
    let current_timeStamp = current_date.getFullYear() + "-" + (current_date.getMonth() + 1) + "-" + current_date.getDay() + "T12:00:00";
    let begin_timeStamp = begin_date.getFullYear() + "-" + (begin_date.getMonth() + 1) + "-" + begin_date.getDate() + "T12:00:00";
    let query_string = "$where=incident_datetime between '" + begin_timeStamp.toString() + "' and '" + current_timeStamp.toString() +"'";
    let url = 'https://data.buffalony.gov/resource/d6g9-xbgu.json?';
    url += query_string;
    url = url.replaceAll(" ", "%20");
    url = url.replaceAll("'", "%27");
    return url;
}