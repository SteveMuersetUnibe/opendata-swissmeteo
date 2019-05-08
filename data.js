var all_data = new Array();
var data = new Array();
var data_headers;


var data_width = "";
var data_hight ;
var timespan = 0;
var date = new Date();



function getdata(data_path){
    console.log(String(data_path))
    data = new Array();
    all_data = new Array();
    d3.dsv(";", String(data_path), (d, error) => {all_data.push(d)}).then(data_headers => {data_headers = data_headers; filterData(); update()});
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

    filterData()
    update()
}

function changeWidth() {
    changed = true;
}

function filterData() {
    data = filterTime(all_data, date);
    if (timespan == 0) return;
    data = agregateTimespan(all_data, data, timespan);
}

function filterTime(data, time) {
    var day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate() + "";
    var month = time.getMonth() < 10 ? "0" + time.getMonth() : time.getMonth + "";
    var str = month + day

    return data.filter(function (value){
        var time = value.time;
        var sub = time.substring(4);
        return sub === str;
    });
}

function agregateTimespan(all_data, data, timespan) {

    var n_data = new Array()

    data.forEach(function (value, index, array) {

        var i = all_data.indexOf(value);

        var agregate = all_data.slice(i - timespan, i + timespan + 1);

        value[params[0]] = d3.max(agregate, d => parseFloat(d[params[0]]))
        value[params[1]] = d3.mean(agregate, d => parseFloat(d[params[1]]))
        value[params[2]] = d3.min(agregate, d => parseFloat(d[params[2]]))
        value[niederschlag] = d3.sum(agregate, d => parseFloat(d[niederschlag]))

        n_data.push(value);
    });

    return n_data;
}



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

getdata(BER)