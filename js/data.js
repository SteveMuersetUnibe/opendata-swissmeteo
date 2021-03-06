var ALT = { file : "data/Standorte/ALT.csv", name : "Altdorf" , longitude : 8.37, latitude: 46.38, muem : 438}; 
var ANT = { file : "data/Standorte/ANT.csv", name : "Andermatt" , longitude :8.35 , latitude: 46.38, muem : 1438}; 
var BAS = { file : "data/Standorte/BAS.csv", name : "Basel" , longitude :7.35 , latitude: 47.32, muem : 316}; 
var BER = { file : "data/Standorte/BER.csv", name : "Bern" , longitude :7.28 , latitude: 46.59, muem : 552}; 
var CDF = { file : "data/Standorte/CDF.csv", name : "La Chaux de Fonds" , longitude :6.48 , latitude: 47.05, muem : 1017}; 
var CHD = { file : "data/Standorte/CHD.csv", name : "La Chateau-d'Oex" , longitude :7.08 , latitude: 46.29 , muem : 1028}; 
var CHM = { file : "data/Standorte/CHM.csv", name : "Chaumont" , longitude :6.59 , latitude: 47.03, muem : 1136}; 
var DAV = { file : "data/Standorte/DAV.csv", name : "Davos" , longitude :9.51 , latitude: 46.49, muem : 1594};
var ELM = { file : "data/Standorte/ELM.csv", name : "Elm" , longitude :9.11 , latitude: 46.55, muem : 957}; 
var ENG = { file : "data/Standorte/ENG.csv", name : "Engelberg" , longitude :8.25 , latitude: 46.49, muem : 1035}; 
var GRC = { file : "data/Standorte/GRC.csv", name : "Gränchen" , longitude :7.50 , latitude: 46.12, muem : 1605}; 
var GRH = { file : "data/Standorte/GRH.csv", name : "Grimsel Hospiz" , longitude :8.20 , latitude: 46.34, muem : 1980}; 
var GSB = { file : "data/Standorte/GSB.csv", name : "Col du Grand St-Bernard" , longitude :7.10 , latitude: 45.52, muem : 2472};
var GVE = { file : "data/Standorte/GVE.csv", name : "Geneve" , longitude :6.08 , latitude: 46.15, muem : 410}; 
var JUN = { file : "data/Standorte/JUN.csv", name : "Jungfraujoch" , longitude : 7.59 , latitude: 46.33, muem : 3580}; 
var LUG = { file : "data/Standorte/LUG.csv", name : "Lugano" , longitude :8.58 , latitude: 46.00, muem : 273}; 
var LUZ = { file : "data/Standorte/LUZ.csv", name : "Luzern" , longitude :8.18 , latitude: 47.02, muem : 454}; 
var MER = { file : "data/Standorte/MER.csv", name : "Meiringen" , longitude :8.10 , latitude: 46.44, muem : 588}; 
var NEU = { file : "data/Standorte/NEU.csv", name : "Neuchatel" , longitude :6.57 , latitude: 47.00, muem : 485}; 
var OTL = { file : "data/Standorte/OTL.csv", name : "Locarno", longitude : 8.47 , latitude: 46.10, muem : 366}; 
var PAY = { file : "data/Standorte/PAY.csv", name : "Payerne" , longitude :6.57 , latitude: 46.49, muem : 490}; 
var RAG = { file : "data/Standorte/RAG.csv", name : "Bad Ragaz" , longitude :79.30 , latitude: 47.01, muem : 496}; 
var SAE = { file : "data/Standorte/SAE.csv", name : "Saenti", longitude : 9.21 , latitude: 47.15, muem : 2502}; 
var SAM = { file : "data/Standorte/SAM.csv", name : "Samedan" , longitude :9.53 , latitude: 46.32, muem : 1708}; 
var SBE = { file : "data/Standorte/SBE.csv", name : "S. Bernardino" , longitude :9.11 , latitude: 46.28, muem : 1638}; 
var SIA = { file : "data/Standorte/SIA.csv", name : "Segl-Maria" , longitude :9.46 , latitude: 46.26, muem : 1804}; 
var SIO = { file : "data/Standorte/SIO.csv", name : "Sion" , longitude :7.20 , latitude: 46.13, muem : 482}; 
var SMA = { file : "data/Standorte/SMA.csv", name : "Zuerich" , longitude :8.34 , latitude: 47.23, muem : 555}; 
var STG = { file : "data/Standorte/STG.csv", name : "St. Gallen" , longitude :9.24 , latitude: 47.26, muem : 775};

var locations = [
    ALT, ANT, BAS, BER, CDF, CHD, 
    CHM, DAV, ELM, ENG, GRC, GRH, 
    GSB, GVE, JUN, LUG, LUZ, MER, 
    NEU, OTL, PAY, RAG, SAE, SAM, 
    SBE, SIA, SIO, SMA, STG]

var data_list = new Array();

var parse = d3.timeParse("%Y%m%d");
var format = d3.timeFormat("%Y%m%d")
var colors = ["rgb(255, 0, 0)", "rgb(0, 0, 0)", "#99ddff", "#2c10cc"]

var params = [ 
    new Parameter("Maximaltemperatur", d3.max, "MaxTemp", colors[0], true),
    new Parameter("Durchschnittstemperatur", d3.mean, "MeanTemp", colors[1], true),
    new Parameter("Tiefsttemperatur", d3.min, "MinTemp", colors[2], true),
    new Parameter("Niederschlag (mm)", d3.sum, "Rain", colors[3], false)]

//Options Object Constructor
function Options(loc, start_date, end_date, date) {
    this.location = loc
    this.data_path = loc.file
    this.start = start_date
    this.end = end_date
    this.date = date
}

//Data Object Constructor to hold the raw data and the 
function Data(all_data, options) {
    this.all_data = all_data
    
    this.margin = 50
    this.zoomLevel = new Array()

    this.zoomLevel.push(agregate(this.all_data, 0, params))
    this.zoomLevel.push(agregate(this.zoomLevel[0], 1, params))
    this.zoomLevel.push(agregate(this.zoomLevel[1], 2, params))
    this.zoomLevel.push(agregate(this.zoomLevel[2], 3, params))

    this.data = this.zoomLevel[3]

    //linearTrendLine(this.zoomLevel[0], params[1].name)

    if (options.date) {
        this.data = filterDate(all_data, options.date)
    }
}

function Parameter(name, agregateFn, short, color, left) {
    this.name = name
    this.agregateFn = agregateFn
    this.short = short
    this.color = color
    this.left = left
}

//Load and filter data from CSV file
async function onChangeOptions(options) {
    var all_data = new Array()
    return d3.dsv(";", 
        String(options.data_path),
        (d, e) => all_data.push(d)
    ).then(d => {
        options.data = new Data(all_data, options)})
}

function changeLocation(){
    var Location = document.getElementById("Location").value;
}


function changeCount(){}

function changeCenter(){}

function changeWidth() {}

function filterData(data, options) {

    if (options.date) {
        options.zoomLevel
        return options.data.data
    }
    var data_focus = data.zoomLevel[options.zoomLevel]
    var change_data = false

    if (options.zoomLevelChanged) {
        data.data = data.zoomLevel[options.zoomLevel]
        options.zoomLevelChanged = false
        options.newZoomLevel = true

        data.start_index = findDateIndex(data_focus, options.start)
        data.end_index = findDateIndex(data_focus, options.end)
        data.start_index = data.start_index > 0 ? data.start_index : 0
        data.end_index = data.end_index > 0 ? data.end_index : data_focus.length - 1

        change_data = true
    }   

    var begin_index = findDateIndex(data.data, options.start)
    var finish_index = findDateIndex(data.data, options.end)
    
    begin_index = begin_index > 0 ? begin_index : 0
    finish_index = finish_index > 0 ? finish_index : data.data.length -1 

    var data_focus_big_enough = data_focus.length > data.end_index - data.start_index
    var close_left = begin_index < data.margin 
    var close_right = data.data.length - finish_index < data.margin 
    var far_left = begin_index > 2 * data.margin 
    var far_right = data.data.length - finish_index > 2 * data.margin
    var data 
    
    if (close_left && close_right && data_focus_big_enough) {
        data.start_index -= data.margin
        data.end_index += data.margin
        change_data = true
    } else if (close_left && data_focus_big_enough) {
        data.start_index -= data.margin
        data.end_index -= data.margin
        change_data = true
    } else if (far_left && data_focus_big_enough) {
        data.start_index += data.margin
        data.end_index += data.margin
        change_data = true

    } else if (far_left && far_right) {
        data.start_index += data.margin
        data.end_index -= data.margin
        change_data = true
    }

    if (change_data) {
        data.start_index = data.start_index > 0 ? data.start_index : 0
        data.end_index = data.end_index > 0 ? data.end_index : data_focus.length - 1
        var d = data_focus.slice(data.start_index, data.end_index)
        if (d.length < 500 && d.length > 0) return d
    }

    var level = options.zoomLevel
    if (finish_index - begin_index > 250) {
        options.zoomLevel += options.zoomLevel < 3 ? 1 : 0
      
    } else if (finish_index - begin_index < 20) {
        options.zoomLevel -= options.zoomLevel > 0 ? 1 : 0
    }
    options.zoomLevelChanged = level != options.zoomLevel
    return data.data
}

function findDateIndex(data, date){
    if (!data) console.log("something went wrong");
    var d = data.map((value) => { return parseInt(value["time"])})
    var index = d.indexOf(parseInt(date));
    if (index == -1) {
        for (val in d){
            if (d[val] >= date) {
                return parseInt(val)
            }
        }
    }

    return parseInt(index)
}

function filterDate(data, time) {
    var day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate() + "";
    var month = (time.getMonth() + 1) < 10 ? "0" + (time.getMonth() + 1) : (time.getMonth() + 1) + "";
    var str = month + day
    console.log(str)
    var d = data.filter(function (value){
        var time = value.time;
        var sub = time.substring(4);
        return sub === str;
    });
    console.log(d)
    return d;
}

function agregate(data, timespan, params){

    var new_data = new Array()
    var time = new agregateHelper(parse(data[0]["time"]), timespan)
    var holder = new Array()
    for (d of data) {
        if (!parse(d["time"])) continue;
        var t = new agregateHelper(parse(d["time"]), timespan)
        if ( t.start >= time.start && t.start < time.end ){
            holder.push(d)
        } else {
            time = new agregateHelper(parse(d["time"]), timespan)
            var item = {}
            item["time"] = d["time"]
            for (param of params) {
                item[param.name] = param.agregateFn(holder, val => parseFloat(val[param.name]))
            }
            new_data.push(item)
            holder = new Array()
            holder.push(d)
        }
    }
    return new_data
}

function agregateHelper(date, i) {
    this.date = date
    switch (i) {
        case 0: //days
            this.start = date.getDate()
            this.end = this.start + 1
            break;
        case 1: //weeks
            this.start = date.getWeek()
            this.end = this.start + 1
            break;
        case 2: //months
            this.start = date.getMonth()
            this.end = this.start + 1
            break;
        case 3: //years
            this.start = date.getYear()
            this.end = this.start + 1
            break;
        default: //days
            this.start = date.getDate()
            this.end = this.start + 1
            break;
    }
}

function linearTrendLine(data, param) {
    var sum = 0, error = 0
    var mean_x = (data.length - 1) / 2
    var mean_y = d3.mean(data, d => d[param])

    for (index in data){
        var y = data[index][param] - mean_y
        var x = index - mean_x
        sum += y * x
        error += x * x
    }
    var slope = sum / error
    var b = mean_y - (slope * mean_x)

    return d => slope(d) + b
}


function findSpecial(fn, ){
}


// This script is released to the public domain and may be used, modified and
// distributed without restrictions. Attribution not necessary but appreciated.
// Source: https://weeknumber.net/how-to/javascript

// Returns the ISO week of the date.
Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                          - 3 + (week1.getDay() + 6) % 7) / 7);
  }
  
  // Returns the four-digit year corresponding to the ISO week of the date.
  Date.prototype.getWeekYear = function() {
    var date = new Date(this.getTime());
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    return date.getFullYear();
  }


  // Position wird gemessen
var lat =  0;
var lng = 0;

function success(pos) {
    var crd = pos.coords;
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    lat = pos.coords.latitude;
    lng = pos.coords.longitude;
    closestLocation()
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}
  
function requestLocation() {
    navigator.geolocation.getCurrentPosition(success, error);
}

  // nächste Station und Abstand von der nächsten Station

var x = 0;
var y = 0;
var MeinX = 0;
var MeinY = 0;
var Abstand;

var closest_location;
var distance;
  
function closestLocation() {
    for (loc of locations) {

        x = loc.latitude;
        y = loc.longitude; 
        MeinX = Math.sqrt((lat - x) * (lat - x));
        MeinY = Math.sqrt((lng - y) * (lng - y));

        if (distance) {
            if (distance > Math.sqrt((MeinX * MeinX) + (MeinY * MeinY)) ) {
                closest_location = loc
                distance = Math.sqrt((MeinX * MeinX) + (MeinY * MeinY))
            }
        } else {
            distance = Math.sqrt((MeinX * MeinX) + (MeinY * MeinY))
            closest_location = loc
        }
    }

    var index = locations.indexOf(closest_location)
    var options = d3.select("#location-one").selectAll("option")._groups[0]
    d3.select(options[index + 1]).attr("selected", true)
    console.log(index, options, loc.longitude, loc.latitude, loc.name, closest_location)

    return closest_location;
   
  }
