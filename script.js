"use strict"

//This function takes a dataJSON of the format:
//{'Type of Crime' : {'longitude' : list, 'latitude' : list, 'labels' : list}, etc}
//It then should create a PlotyPlot with the data dictionaries seperated by crime so they can be color-coded!

async function generateBetterMapBox(dataJSON){
    let data = await plotlyDataGenerator(14);
    let plotlyList = []
    for (let key of data) {
        let currDic = data[key]
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
        plotlyList.push(dataDic)
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

