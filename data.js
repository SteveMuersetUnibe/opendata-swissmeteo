var ALT = { file : "Standorte/ALT.csv", name : "Altdorf" }; 
var ANT = { file : "Standorte/ANT.csv", name : "Andermatt" }; 
var BAS = { file : "Standorte/BAS.csv", name : "Basel" }; 
var BER = { file : "Standorte/BER.csv", name : "Bern" }; 
var CDF = { file : "Standorte/CDF.csv", name : "La Chaux de Fonds" }; 
var CHD = { file : "Standorte/CHD.csv", name : "La Chateau-d'Oex" }; 
var CHM = { file : "Standorte/CHM.csv", name : "Chaumont" }; 
var DAV = { file : "Standorte/DAV.csv", name : "Davos" };
var ELM = { file : "Standorte/ELM.csv", name : "Elm" }; 
var ENG = { file : "Standorte/ENG.csv", name : "Engelberg" }; 
var GRC = { file : "Standorte/GRC.csv", name : "Gränchen" }; 
var GRH = { file : "Standorte/GRH.csv", name : "Grimsel Hospiz" }; 
var GSB = { file : "Standorte/GSB.csv", name : "Col du Grand St-Bernard" };
var GVE = { file : "Standorte/GVE.csv", name : "Geneve" }; 
var JUN = { file : "Standorte/JUN.csv", name : "Jungfraujoch" }; 
var LUG = { file : "Standorte/LUG.csv", name : "Lugano" }; 
var LUZ = { file : "Standorte/LUZ.csv", name : "Luzern" }; 
var MER = { file : "Standorte/MER.csv", name : "Meiringen" }; 
var NEU = { file : "Standorte/NEU.csv", name : "Neuchatel" }; 
var OTL = { file : "Standorte/OTL.csv", name : "Lugano" }; 
var PAY = { file : "Standorte/PAY.csv", name : "Payerne" }; 
var RAG = { file : "Standorte/RAG.csv", name : "Bad Ragaz" }; 
var SAE = { file : "Standorte/SAE.csv", name : "Saenti" }; 
var SAM = { file : "Standorte/SAM.csv", name : "Samedan" }; 
var SBE = { file : "Standorte/SBE.csv", name : "S. Bernardino" }; 
var SIA = { file : "Standorte/SIA.csv", name : "Segl-Maria" }; 
var SIO = { file : "Standorte/SIO.csv", name : "Sion" }; 
var SMA = { file : "Standorte/SMA.csv", name : "Zuerich" }; 
var STG = { file : "Standorte/STG.csv", name : "St. Gallen" };

var data_list = new Array();

var parse = d3.timeParse("%Y%m%d");
var format = d3.timeFormat("%Y%m%d")
var colors = ["#85f441", "#4286f4", "#f44141", "#2c10cc"]

var params = [ 
    new Parameter("Maximaltemperatur", d3.max, "MaxTemp", colors[0], true),
    new Parameter("Durchschnittstemperatur", d3.mean, "MeanTemp", colors[1], true),
    new Parameter("Tiefsttemperatur", d3.min, "MinTemp", colors[2], true),
    new Parameter("Niederschlag (mm)", d3.sum, "Rain", colors[3], false)]

//Options Object Constructor
function Options(data_path, start_date, end_date, date, param) {
    this.data_path = data_path
    this.start = start_date
    this.end = end_date
    this.date = date
    this.param = param
    options = this;
}

//Data Object Constructor to hold the raw data and the 
function Data(all_data) {
    this.all_data = all_data
    
    this.margin = 50
    this.zoomLevel = new Array()

    this.zoomLevel.push(agregate(this.all_data, 0, params))
    this.zoomLevel.push(agregate(this.zoomLevel[0], 1, params))
    this.zoomLevel.push(agregate(this.zoomLevel[1], 2, params))
    this.zoomLevel.push(agregate(this.zoomLevel[2], 3, params))

    this.data = this.zoomLevel[3]

    //linearTrendLine(this.zoomLevel[4], params[1].name)
    
    current_data = this
    data_list.push(this)
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
    ).then(d => options.data = new Data(all_data))
}

function changeLocation(){
    var Location=document.getElementById("Location").value;
    console.log(Location)
}


function changeCount(){}

function changeCenter(){}

function changeWidth() {}

function filterData(data, options) {

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

    if (finish_index - begin_index > 250) {
        options.zoomLevel += 1
        options.zoomLevelChanged = true
    } else if (finish_index - begin_index < 20) {
        options.zoomLevel -= 1
        options.zoomLevelChanged = true
    }
    return data.data
}

function findDateIndex(data, date){
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
    var month = time.getMonth() < 10 ? "0" + time.getMonth() : time.getMonth + "";
    var str = month + day

    return data.filter(function (value){
        var time = value.time;
        var sub = time.substring(4);
        return sub === str;
    });
}

function agregate(data, timespan, params){

    var new_data = new Array()
    
    var time = new agregateHelper(parse(data[0]["time"]), timespan)

    var holder = new Array()

    for (d of data) {
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

    console.log(sum, error, mean_x, mean_y, slope, b)

}

/**
 * 
 * draw plot line through data 
 * 
 * Add pointer extractor
 * 
 */





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

  function success(pos) {
    var crd = pos.coords;
  
  
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
  }
  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  
  
  
  navigator.geolocation.getCurrentPosition(success, error);