var all_data = new Array();
var data = new Array();
var data_headers;
var data_width = "";
var data_hight ;

var changed;


function getdata(data_path){
    console.log(String(data_path))
    data = new Array();
    all_data = new Array();
    d3.dsv(";", String(data_path), (d, error) => {all_data.push(d)}).then(data_headers => {data_headers = data_headers, filterData()});
}


function changeLocation(){
    var Location=document.getElementById("Location").value;
    getdata(window[Location])
    console.log(Location)
}


function changeParameter(){
    var Parameter=document.getElementById("Parameter").value;
    changed = true;
    console.log(Parameter)
}

function changeTime(){
    changed = true;
}

function changeWidth() {
    changed = true;
}

function filterData() {
    data = filterTime(all_data, new Date());
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

    data.forEach(function (value, index, array) {

        var i = all_data.indexOf(value);

        var agregate = all_data.slice(i - timespan, i + timespan + 1);

        



    });

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
