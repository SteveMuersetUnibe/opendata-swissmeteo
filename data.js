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

var params = [ 
    new Parameter("Maximaltemperatur (�C)", d3.max),
    new Parameter("Durchschnittstemperatur (�C)", d3.mean),
    new Parameter("Tiefsttemperatur (�C)", d3.min),
    new Parameter("Niederschlag (mm)", d3.sum)]

//Options Object Constructor
function Options(data_path, data_width,agregate, start, date, param) {
    this.data_path = data_path
    this.width = data_width
    this.agregate = agregate
    this.start = start
    this.date = date
    this.param = param
    options = this;
}

//Data Object Constructor to hold the raw data and the 
function Data(all_data, data) {
    this.all_data = all_data
    this.data = data
    current_data = this
    data_list.push(this)
}

function Parameter(name, agregateFn) {
    this.name = name
    this.agregateFn = agregateFn
}

//Load and filter data from CSV file
async function onChangeOptions(options) {
    var all_data = new Array()
    return d3.dsv(";", 
        String(options.data_path),
        (d, e) => all_data.push(d)
    ).then(d => new Data(all_data, filterData(all_data, options)))
}

function changeLocation(){
    var Location=document.getElementById("Location").value;
    getdata(window[Location])
    console.log(Location)
}

function changeParameter(){
    var Parameter=document.getElementById("Parameter").value;
    console.log(Parameter)
}

function changeTimespan(){
    var Timespan = document.getElementById("Timespan").value;

    timespan = parseInt(Timespan);
    console.log(timespan)

    applyData()
}

function changeCount(){}

function changeCenter(){}

function changeWidth() {}

function filterData(all_data, options) {
    if (options) {
        var data = all_data;
        if (options.width){
            data = data.slice(options.start, options.start + options.width)
        }
        if (options.agregate) {
            if (options.date) {
                var filtered_data = filterDate(data, options.date)
                data = agregateData(filtered_data, options.agregate, params, all_data)
            } else {
                data = agregateData(data, options.agregate, params)
            }
        }
        return data
    }
    return all_data;
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

function agregateData(data, timespan, params, all_data) {

    if (all_data) {

        data.forEach(function (value){

            var index = all_data.indexOf(value)
            var agregate = all_data.slice(index - timespan, index + timespan + 1);

            for (param of params) {
                value[param.name] = param.agregateFn(agregate, d => d[param.name])
            }
        })
        return data;

    } else {
        var new_data = new Array()
        while (data.length > 0) {
            var agregate = data.splice(0, timespan * 2)
            var item = {}
            for (param of params) {
                item[param.name] = param.agregateFn(agregate, d => d[param.name])
            }
            item["time"] = agregate[0]["time"]
            new_data.push(item);
        }
        return new_data;
    }
}

