
var params = ["Maximaltemperatur (�C)", "Durchschnittstemperatur (�C)", "Tiefsttemperatur (�C)"]
var niederschlag = "Niederschlag (mm)"
var colors = ["#85f441", "#4286f4", "#f44141", "#2c10cc"]

var win_height = window.innerHeight;
var win_width = window.innerWidth;

var line_height = win_height / 4;

var svg = d3.select("svg");

var margin_left = 50;
var margin_right = 50;
var margin_top = 50;
var margin_bottom = 50;

var xScale;
var yScale;

var min;
var max;

var parse = d3.timeParse("%Y%m%d");

function setup() {

    clear()

    d3.select("body")
        .append("svg")
        .style("height", win_height)
        .style("width", win_width)
   
    svg = d3.select("svg");
}

function map(data, xParam, yParam) {
    return data.map((value) => { return {x : value[xParam], y : value[yParam]} })
}

function drawAxis(group, left, xScale, yScale) {

    var yAxis = left ? d3.axisLeft() : d3.axisRight()

    var xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(10);

    yAxis.scale(yScale)
        .ticks(10)

    group.append("g")
        .attr("transform", "translate(" + 0 + "," + (line_height - margin_bottom + 5) + ")")
        .call(xAxis)

    var transition = left ? margin_left : win_width - margin_right;

    group.append("g")
        .attr("transform", "translate(" + transition + "," + 0 + ")")
        .call(yAxis)

}

function prepareScale() {

    var length = data.length;

    max = 0;
    min = 0;

    for (param of params) {

        var new_max = d3.max(data, d => parseFloat(d[param]))
        var new_min = d3.min(data, d => parseFloat(d[param]))

        max = new_max > max ? new_max : max;
        min = new_min < min ? new_min : min;
        
    }

    console.log(max);
    console.log(min);

    var a = parse(data[0].time);
    var b = parse(data[length-1].time);

    xScale = d3.scaleTime().domain([a,b]).range([margin_left, win_width - margin_right])
    yScale = d3.scaleLinear().domain([min, max]).range( [line_height - margin_bottom, margin_top])
}

function draw() {
    setup();
    prepareScale();
    params.forEach(function(value, index){
        var line = setLine(value, xScale, yScale);
        var path = drawLine(line, colors[index], 0.8)
        var group = d3.select(path.node().parentNode)
        drawAxis(group,true,xScale, yScale);
    });

    max = d3.max(data, d => parseFloat(d[niederschlag]))
    min = d3.min(data, d => parseFloat(d[niederschlag]))

    yScale = d3.scaleLinear().domain([min, max]).range([line_height - margin_bottom, margin_top]);

    var line = setLine(niederschlag, xScale, yScale);
    var path = drawLine(line, "black", 0.5)
    var group = d3.select(path.node().parentNode)

    drawAxis(group, false, xScale, yScale);
}


function drawLine(line, color, opacity) {
    return svg.append("g")
        .classed("area-group", true)
        .style("height", line_height)
        .style("width", win_width)

        .append("path")
        .attr("d", line(data))
        .attr("fill", color)
        .attr("stroke", color)
        .attr("opacity", opacity)
}

function setLine(param, xScale, yScale) {

    return d3.area()
        .x(function(d,i) { 
            return xScale(parse(d.time))
        })
        .y0(function(d,i) { return yScale(parseFloat(d[param]))})
        .y1(function(d,i) { return yScale(parseFloat(d[param]) + 1)})
        .defined(function(d,i) { return !isNaN(parseFloat(d[param]))})
        .curve(d3.curveCatmullRom.alpha(0.5));
}

function transition() {
    var areas = svg.selectAll(".area-group")._groups[0];
    areas.forEach(function(value, index) {
        d3.select(value)
            .transition()
            .duration(2000)
            .attr("transform", "translate(" + 0 + "," + (index * line_height) + ")")
            .select("path")
                .attr("stroke", "black")
                .attr("fill", "black")
                .attr("opacity", 1)
            
    });
}

function update() {

    prepareScale();

    var areas = svg.selectAll(".area-group")._groups[0];

    if (areas.length == 0) {
        draw()
        return null;
    } 
    params.forEach(function(value, index) {
        var line = setLine(value, xScale, yScale);
        d3.select(areas[index])
            .select("path")
                .attr("d", line(data))
            
    });

    max = d3.max(data, d => parseFloat(d[niederschlag]))
    min = d3.min(data, d => parseFloat(d[niederschlag]))

    yScale = d3.scaleLinear().domain([min, max]).range([line_height - margin_bottom, margin_top]);

    var line = setLine(niederschlag, xScale,yScale)
    d3.select(areas[3])
        .select("path")
            .attr("d", line(data))



}

function clear() {
    svg.remove();
}











function startUp(param) {
    setup()
    prepareScale()

    var x = xScale;
    var y = yScale;

    var a = data;
    var b = new Array();

    data.forEach(function(value, index, array) {

        if (index == array.length) {
            b.push(true);
            return;
        }

        b.push(value);
        if (array[index+1] > value){
            b.push(true);
        } else {
            b.push(false);
        }
    });

    var c = new Array()

    data.forEach(function(value, index, array) {

        if (index == array.length) {
            c.push(true);
            return;
        }

        c.push(value);
        if (array[index+1] < value){
            c.push(true);
        } else {
            c.push(false);
        }
    });

    a = map(a, "time", param)
    b = map(b, "time", param)
    c = map(c, "time", param)

    console.log(b);

    var area = d3.area()
        .x((d,i) => x(d.x))
        .y0((d,i) => y(d.y))
        .y1((d,i) => y(d+1));
    
    var low = d3.area()
        .x0((d,i) => {
            var val;
            if (i % 2 == 1) {
                val = x((i-1) / 2)
            } else {
                val = x(i / 2)
            }
            return val;
        })
        .x1((d,i) => {
            var val;
            if (i % 2 == 1) {
                val = x(((i-1) / 2) + 0.5)
            } else {
                val = x((i / 2) + 0.5)
            }
            return val;
        })
        .y((d,i,a) => {
            var val;
            if (i % 2 == 1) {
                val = y(a[i-1][param])
            } else {
                val =  y(d[param]);
            }
            return val;
        })
        .defined((d,i,a) => {return d})

    var high = d3.area()
        .x0((d,i) => {
            var val;
            if (i % 2 == 1) {
                val = x((i-1) / 2)
            } else {
                val = x(i / 2)
            }
            return val;
        })
        .x1((d,i) => {
            var val;
            if (i % 2 == 1) {
                val = x(((i-1) / 2) + 0.5)
            } else {
                val = x((i / 2) + 0.5)
            }
            console.log(val);
            return val;
        })
        .y((d,i,a) => {
            var val;
            if (i % 2 == 1) {
                val = y(a[i-1][param] + 1)
            } else {
                val =  y(d[param] + 1);
            }
            
            return val;
            
        })
        .defined((d,i,a) => d)
    
  
    var path_high = svg.append("g")
        .classed("area-group", true)
        .style("height", line_height)
        .style("width", win_width)

        .append("path")
        .attr("d", high(c))
        .attr("fill", "blue")
        .attr("stroke", "none")

    var path_low = svg.append("g")
        .classed("area-group", true)
        .style("height", line_height)
        .style("width", win_width)

        .append("path")
        .attr("d", low(b))
        .attr("fill", "blue")
        .attr("stroke", "none")

    var path = svg.append("g")
        .classed("area-group", true)
        .style("height", line_height)
        .style("width", win_width)

        .append("path")
        .attr("d", area(a))
        .attr("fill", "lightblue")
        //.attr("stroke", "green")

    var t = d3.transition()
        .duration(5000)
        .ease(d3.easeCubicIn)
    
    svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", win_height)
        .attr("width", win_width)
        .attr("fill", "white")
        .transition(t)
        .attr("x", win_width)
}