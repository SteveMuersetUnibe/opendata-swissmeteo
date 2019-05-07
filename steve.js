var location_files = [];
var live_data_base_url = "";
var data_path = "Standorte/LUZ - Luzern.csv";

var win_height = window.innerHeight;
var win_width = window.innerWidth;

var animation_speed = 30;
var stroke = 100;
var current_center = 0;
var current_data;


var data = new Array();

d3.dsv(";", data_path, (d, error) => {data.push(d)}).then(data => prepareData());

// d3.select("svg")
//     .style("height", win_height)
//     .style("width", win_width)

function draw() {
    console.log(mydata);


    var selected_data = prepareData();
    current_data = selected_data;

    console.log(current_data)

    var line = prepareLine(selected_data, 0);


    d3.select("svg")
        .append("path")
        .attr("d", line(selected_data))
        .attr("fill", "#fe9a22")
        .attr("stroke", "#fe9a22")
    

}

function transitionCenter(data, newCenter) {
    var sign = current_center < newCenter ? 1 : -1;
    nextLine(data, newCenter, sign);
}

function moveLine() {
    var item = current_data[0];
    current_data.push(item);
    current_data.push(item);
    current_data.push(item);
    current_data.push(item);
    current_data.push(item);
    current_data.push(item);
    current_data.push(item);
    var line = prepareLine(current_data);
    d3.select("path")
    .transition()
    .duration(1000)
    .attr("d", line(current_data))
    .attr("fill", "#fe9a22")
    .attr("stroke", "#fe9a22")
}

function nextLine(data, end, sign) {

    if (current_center != end){
        current_center += sign;
        setTimeout(res => nextLine(data, end, sign), animation_speed);
    }

    var newline = prepareLine(data, current_center)

    d3.select("path")
        .transition()
        .duration(animation_speed)
        .attr("d", newline(data))
}


function prepareLine(selected_data, center) {

    var max = d3.max(selected_data, d => parseFloat(d["Durchschnittstemperatur (�C)"]))
    var min = d3.min(selected_data, d => parseFloat(d["Durchschnittstemperatur (�C)"]))
    var mid = (max + min) / 2

    var l = selected_data.length

    var per = 20/100
   
    var line = d3.area()
        .x((d,i) => {
            var scale = d3.scalePow().domain([-(per*l), ((1-per)*l)-1]).range([0, win_width]).exponent(1/2)
            return scale(i - (per*l))
        })
        .y1((d,i) => {
            var temp = parseFloat(d["Durchschnittstemperatur (�C)"])

            var scale = d3.scaleLinear().domain([min, max]).range([480, 20])

            var s = d3.scaleLinear().domain([0, per*l < (1-per)*l ? (1-per)*l : per*l]).range([1,0])

            var diff = temp - mid
            var val = scale((diff * s(Math.abs(i - (per*l)))) + mid)
            return val - lineStroke(i, l, per*l)
        })
        .y0((d,i) => {
            var temp = parseFloat(d["Durchschnittstemperatur (�C)"])

            var scale = d3.scaleLinear().domain([min, max]).range([480, 20])
          
            var s = d3.scaleLinear().domain([0, per*l < (1-per)*l ? (1-per)*l : per*l]).range([1,0])

            var diff = temp - mid
            var val = scale((diff * s(Math.abs(i - (per*l)))) + mid)
            return val + lineStroke(i,l, per*l)
        })
        .defined((d,i) => !isNaN(parseFloat(d["Durchschnittstemperatur (�C)"])))
        
        //.curve(d3.curveCatmullRom)
        //.curve(d3.curveStep)
    return line;
}

function lineStroke(index, length, center) {

    var dist = Math.abs(center - index);

    var val;
    if (index < center) {
        val = 1 - (dist / center)
    } 
    else {
        val = 1 - (dist / (length - center))
    }
    return val**4 * stroke;
}

function capturemouse() {

    var path = d3.select("path").node();
    var pathLength = path.getTotalLength();
    var bbox = path.getBBox();
    var scale = pathLength/bbox.width;

    var offsetLeft = d3.select("area").offsetLeft;
    console.log(d3.select(""))
    console.log(offsetLeft);
}


function mouseover(){
    function point(){
		var pathEl = path.node();
		var pathLength = pathEl.getTotalLength();
		var BBox = pathEl.getBBox();
		var scale = pathLength/BBox.width;
		var offsetLeft = document.getElementById("line").offsetLeft;
		var _x = d3.mouse(this)[0];
		var beginning = _x , end = pathLength, target;
		while (true) {
			target = Math.floor((beginning + end) / 2);
			pos = pathEl.getPointAtLength(target);
			if ((target === end || target === beginning) && pos.x !== _x) {
				break;
			}
			if (pos.x > _x){
				end = target;
			}else if(pos.x < _x){
				beginning = target;
			}else{
				break; //position found
			}
		}
		circle
		.attr("opacity", 1)
		.attr("cx", _x+ trans)
        .attr("cy", pos.y);
    }
}



function indexRelativPosition(index, start, end){
    //check if values are correct
    return (index - start + 1) / (end - start + 1);
}

function prepareData() {
    //return updateCurrentData()
    return filterDate(new Date());
}


function filterDate(date) {
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate() + "";
    var month = date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth + "";
    var str = month + day

    data = data.filter(function (value){
        var time = value.time;
        var sub = time.substring(4);
        return sub === str;
    });
}

function updateCurrentData() {
    //is a date selected?
    //is a timeframe selected?

    var min = 0;
    var max = 365;

    data = data.slice(min, max);

}

// https://www.html5rocks.com/en/tutorials/file/dndfiles/

