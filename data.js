var ALT = "Standorte/ALT.csv"; 
var ANT = "Standorte/ANT.csv"; 
var BAS = "Standorte/BAS.csv"; 
var BER = "Standorte/BER.csv"; 
var CDF = "Standorte/CDF.csv"; 
var CHD = "Standorte/CHD.csv"; 
var CHM = "Standorte/CHM.csv"; 
var DAV = "Standorte/DAV.csv";
var ELM = "Standorte/ELM.csv"; 
var ENG = "Standorte/ENG.csv"; 
var GRC = "Standorte/GRC.csv"; 
var GRH = "Standorte/GRH.csv"; 
var GSB = "Standorte/GSB.csv";
var GVE = "Standorte/GVE.csv"; 
var JUN = "Standorte/JUN.csv"; 
var LUG = "Standorte/LUG.csv"; 
var LUZ = "Standorte/LUZ.csv"; 
var MER = "Standorte/MER.csv"; 
var NEU = "Standorte/NEU.csv"; 
var OTL = "Standorte/OTL.csv"; 
var PAY = "Standorte/PAY.csv"; 
var RAG = "Standorte/RAG.csv"; 
var SAE = "Standorte/SAE.csv"; 
var SAM = "Standorte/SAM.csv"; 
var SBE = "Standorte/SBE.csv"; 
var SIA = "Standorte/SIA.csv"; 
var SIO = "Standorte/SIO.csv"; 
var SMA = "Standorte/SMA.csv"; 
var STG = "Standorte/STG.csv";

var data_list = new Array();
var current_data;
var options;

var parse = d3.timeParse("%Y%m%d");
var format = d3.timeFormat("%Y%m%d")


var params = [ 
    new Parameter("Maximaltemperatur (�C)", d3.max, "MaxTemp"),
    new Parameter("Durchschnittstemperatur (�C)", d3.mean, "MeanTemp"),
    new Parameter("Tiefsttemperatur (�C)", d3.min, "MinTemp"),
    new Parameter("Niederschlag (mm)", d3.sum, "Rain")]

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

    this.zoomLevel.push(agregate(this.all_data, null, params))
    this.zoomLevel.push(agregate(this.zoomLevel[0], 0, params))
    this.zoomLevel.push(agregate(this.zoomLevel[1], 1, params))
    this.zoomLevel.push(agregate(this.zoomLevel[2], 2, params))
    this.zoomLevel.push(agregate(this.zoomLevel[3], 3, params))

    this.data = this.zoomLevel[4]

    
    current_data = this
    data_list.push(this)
}

function Parameter(name, agregateFn, short) {
    this.name = name
    this.agregateFn = agregateFn
    this.short = short
}

//Load and filter data from CSV file
async function onChangeOptions(options) {
    var all_data = new Array()
    return d3.dsv(";", 
        String(options.data_path),
        (d, e) => all_data.push(d)
    ).then(d => new Data(all_data))
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
        console.log("level changed", data.data.length)

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
    var far_left = begin_index > 3 * data.margin 
    var far_right = data.data.length - finish_index > 3 * data.margin
    var data 
    

    if (close_left && !close_right && data_focus_big_enough) {
        data.start_index = data.start_index - data.margin
        change_data = true
    } else if (close_right && !close_left && data_focus_big_enough) {
        data.start_index = data.start_index + data.margin
        change_data = true
    } else if (close_left && close_right && data_focus_big_enough) {
        data.start_index = data.start_index - data.margin
        data.end_index = data.end_index + data.margin
        change_data = true
    }
    if (far_left) {
        data.start_index = data.start_index + data.margin
        change_data = true
    }
    if (far_right) {
        data.end_index = data.end_index - data.margin
        change_data = true
    }

   

    if (change_data) {
        data.start_index = data.start_index > 0 ? data.start_index : 0
        data.end_index = data.end_index > 0 ? data.end_index : data_focus.length - 1
        var d = data_focus.slice(data.start_index, data.end_index)

        

        console.log(data.start_index, data.end_index, d.length, far_left, far_right)

        if (d.length < 500) return d
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

