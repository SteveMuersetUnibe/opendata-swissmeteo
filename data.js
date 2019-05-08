var data = "";
var data_width = "";
var data_hight ;


function getdata(data_path){
    d3.dsv(";", data_path, (d, error) => {data.push(d)}).then(data => prepareData());

}

function changeLocation(){
    var Location=document.getElementById("Locations").value;
    window[Location]
    console.log(Location)
}

function changeParameter(){
    var Parameter=document.getElementById("Parameter").value;
    window[Parameter]
    console.log(Parameter)
}





var ALT = "Standorte/ALT - Altdorf.csv";
var ANT = "Standorte/ANT - Andermatt.csv";
var BAS = "Standorte/BAS - Basel.csv";
var BER = "Standorte/BER - Bern.csv";
var CDF = "Standorte/CDF - La Chaux de Fonds.csv";
var CHD = "Standorte/CHD - La Chateau-d'Oex.csv";
var CHM = "Standorte/CHM - Chaumont.csv";
var DAV = "Standorte/DAV - Davos.csv";
var ELM = "Standorte/ELM - Elm.csv";
var ENG = "Standorte/ENG - Engelberg.csv";
var GRC = "Standorte/GRC - Gränchen.csv";
var GRH = "Standorte/GRH - Grimsel Hospiz.csv";
var GSB = "Standorte/GSB - Col du Grand St-Bernard.csv";
var GVE = "Standorte/GVE - Geneve";
var JUN = "Standorte/JUN - Jungfraujoch";
var LUG = "Standorte/LUG - Lugano";
var LUZ = "Standorte/LUZ - Luzern.csv";
var MER = "Standorte/MER - Meiringen.csv";
var NEU = "Standorte/NEU - Neuchatel.csv";
var OTL = "Standorte/OTL - Lugano.csv";
var PAY = "Standorte/PAY - Payerne.csv";
var RAG = "Standorte/RAG - Bad Ragaz.csv";
var SAE = "Standorte/SAE - Saentis.csv";
var SAM = "Standorte/SAM - Samedan.csv";
var SBE = "Standorte/SBE - S. Bernardino.csv";
var SIA = "Standorte/SIA - Segl-Maria.csv";
var SIO = "Standorte/SIO - Sion.csv";
var SMA = "Standorte/SMA - Zuerich.csv";
var STG = "Standorte/STG - St. Gallen.csv";