var data = new Array();
var data_width = "";
var data_hight ;


function getdata(data_path){
    console.log(String(data_path))
    data = new Array();
    
    d3.dsv(";", String(data_path), (d, error) => {data.push(d)}).then(data => null);

}


function changeLocation(){
    var Location=document.getElementById("Location").value;
    getdata(window[Location])
    console.log(Location)
}


function changeParameter(){
    var Parameter=document.getElementById("Parameter").value;
    window[Parameter]
    console.log(Parameter)
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
