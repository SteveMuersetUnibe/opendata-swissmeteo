var win_height = window.innerHeight;
var win_width = window.innerWidth;

function map(data, xParam, yParam) {
    return data.map((value) => { return {x : parse(value[xParam]), y : parseFloat(value[yParam])} })
}

/*
    |**|**|                                |**|**|
    |**|**|    LineParameter Object and    |**|**|
    |**|**|                                |**|**|
    |**|**|            Functions           |**|**|
    |**|**|                                |**|**|
 */

function LineParameter(param, data, color, left, dimension) {
    this.color = color
    this.param = param
    this.raw_data = data
    this.dimension = dimension
    this.drawAxisLeft = left
    this.axisLeft = left
    this.zoomLevel = 0
    this.circles = new Array()

    //this.infoBox = new InfoBox(this)
}

function setLine(line){
    dataAnalysis(line)
    setScales(line)
    setLineGroup(line)
    setAxis(line)
    setAxisGroup(line)
    setArea(line)
    setPath(line)
    setClip(line)
    setZoom(line)
    setZoomRect(line)
    setCaptureJerry(line)
    setHelpLine(line)
    setHelpPath(line)
    setParamInfo(line)
    
}

function updateLine(line){
    updateScales(line)
    updateLineGroup(line)
    updateAxis(line)
    updateAxisGroup(line)
    updateArea(line)
    updatePath(line)
    updateClip(line)
    updateZoom(line)
    updateZoomRect(line)
    updateHelpPath(line)
    updateParamInfo(line)
   
}

function removeLine(line){
    line.canvas.removeLine(line)
    line.group.remove()
    line.chart.remove()
}

function dataAnalysis(line) {
    line.data = map(line.raw_data.data, "time", line.param.name)

    line.ymin = d3.min(line.data, d => d.y)
    line.ymax = d3.max(line.data, d => d.y)
    line.ymean = d3.mean(line.data, d => d.y)
    
    line.xmin = parse(line.raw_data.all_data[0]["time"])
    
    line.xmax = parse(line.raw_data.all_data[line.raw_data.all_data.length - 1]["time"])

    if (isNaN(line.ymin) || isNaN(line.ymax)) {line.ymin = 0; line.ymax = 0;}
}

function setLineGroup(line) {
    line.chart = line.canvas.group.append("g")
        .classed("chart-group", true)

    line.group = line.chart.append("g")
        .style("opacity", 0)
}

function updateLineGroup(line) {
    line.group
        .classed("area-group", true)
        .attr("transform", line.transform)
        .style("opacity", 1)
}

function lineGroupTransition(line) {
    line.group
        .transition()
        .duration(500)
            .attr("transform", line.transform)
            .style("opacity", 1)
}

function setScales(line) {
    line.xScaleBase = d3.scaleTime().domain([line.xmin, line.xmax]).range([0, line.width]).nice().clamp(true)
    line.xScale = line.xScaleBase
    line.canvas.xScaleBase = line.xScaleBase
    line.canvas.xScale = line.xScaleBase

    line.yScale = d3.scaleLinear().clamp(true)
}

function updateScales(line) {
    updateXScale(line)
    updateYScale(line)
    
}

function updateXScale(line) {
    line.xScaleBase.range([0, line.width])
    line.xScale.range([0, line.width])
}

function updateYScale(line) {
    
    line.yScale.domain([line.ymin, line.ymax]).range([line.height, 0])
}

function setAxis(line) {
    line.xAxis = d3.axisBottom()
    line.yAxis = line.axisLeft ? d3.axisLeft() : d3.axisRight()
}

function updateAxis(line) {
    updateXAxis(line)
    updateYAxis(line)
}

function updateXAxis(line) {
    line.xAxis.ticks(5)
    line.xAxis.scale(line.xScale);
}

function updateYAxis(line) {
    line.drawAxisLeft = line.canvas.together ? line.axisLeft : true
    line.yAxis = line.drawAxisLeft ? d3.axisLeft() : d3.axisRight()
    line.yAxis.tickValues(line.axisLeft ? [line.ymax, 0, line.ymin] : [line.ymax, line.ymin])
    line.yAxis.scale(line.yScale);
    line.yAxis.tickFormat(d => line.axisLeft ? tempFormat(d) + " °C" : rainFormat(d) + " mm")
}

function setAxisGroup(line) {
    line.yAxisGroup = line.group.append("g")
    line.xAxisGroup = line.group.append("g")
}

function updateAxisGroup(line) {
    updateXAxisGroup(line)
    updateYAxisGroup(line)
 }
 
 function updateXAxisGroup(line) {
     line.xAxisGroup
     .attr("transform", "translate(0, "+ line.height +")")
     .call(line.xAxis)
    
 }
 
 function updateYAxisGroup(line) {
     line.yAxisGroup
     .attr("transform", "translate(" + (line.drawAxisLeft ? 0 : line.width) +",0)") 
     .call(line.yAxis)
    
     
 }

 function axisGroupTransition(line) {
    xAxisGroupTransition(line)
    yAxisGroupTransition(line)
}

function xAxisGroupTransition(line) {
    line.xAxisGroup
    .transition()
    .duration(500)
        .call(line.xAxis)
        .attr("transform", "translate(0, "+ line.height +")")
}

function yAxisGroupTransition(line) {
    line.yAxisGroup
    .transition()
    .duration(500)
        .attr("transform", "translate(" + (line.drawAxisLeft ? 0 : line.width) +",0)")
        .call(line.yAxis)
}

function setArea(line) {
    line.area = d3.line()
        .x(d => line.xScale(d.x))
        .y(d => line.yScale(d.y))
        .defined(d => !isNaN(parseFloat(d.y)))
        .curve(d3.curveMonotoneX)
}

function updateArea(line){
    setArea(line)
}

function setPath(line) {
    line.path = line.group.append("path")
}

function updatePath(line) {
    line.path
        .attr("fill", "none")
        .attr("stroke", line.color)
        .attr("stroke-width", 1)
        .attr("d", line.area(line.data))
}

function pathTransition(line){
    line.path
        .transition()
        .duration(500)
            .attr("fill", line.color)
            .attr("stroke", line.color)
            .attr("d", line.line(line.data))
}

function setClip(line) {
    line.clip_id = "clip" + line.param.short + line.canvas.id
    line.clip = line.group
        .append("clipPath")
        .attr("id", line.clip_id)
        .append("rect")

    line.path
        .attr("clip-path", "url(#" + line.clip_id + ")")
}

function updateClip(line) {
    line.clip
        .attr("width", line.width )
        .attr("height", line.height )
        .attr("x", 0)
        .attr("y", 0) 
}

function setHelpLine(line){
    line.xHelpLine = d3.line()
        .x(d => line.xScale(d.x))
        .y(d => line.yScale(d.y))
        .defined(d => !isNaN(d.y))

    line.yHelpLine = d3.line()
        .x(d => line.xScale(d.x))
        .y(d => line.yScale(d.y))
        .defined(d => !isNaN(d.y))

    line.zeroHelpLine = d3.line()
        .x(d => line.xScale(d.x))
        .y(d => line.yScale(d.y))
        .defined(d => !isNaN(d.y))
}

function setHelpPath(line) {
    line.yHelpPath = line.group.append("path")
    line.xHelpPath = line.group.append("path")
    line.zeroHelpPath = line.group.append("path")
}

function updateHelpPath(line) {
    if(!line.mouse_data) return false
    var y_data = [{
        x : line.xScale.domain()[0],
        y : line.mouse_data[line.param.name]
    },
    {
        x : line.xScale.domain()[1],
        y : line.mouse_data[line.param.name]
    }]
    var x_data = [{
        x : parse(line.mouse_data["time"]),
        y : line.ymax
    },
    {
        x : parse(line.mouse_data["time"]),
        y : line.ymin
    }]

    var zero_data = [{
        x : line.xScale.domain()[0],
        y : 0
    }, {
        x : line.xScale.domain()[1],
        y : 0
    }]

    if (isNaN(y_data[0].y)){
        line.yHelpPath
            .attr("d", null)
        line.xHelpPath
            .attr("d", null)
        return false;
    }

    line.yHelpPath
        .attr("stroke", line.color)
        .attr("stroke-width", 1)
        .style("opacity", 0.5)
        .attr("d", line.yHelpLine(y_data))
    line.xHelpPath
        .attr("stroke", line.color)
        .attr("stroke-width", 1)
        .style("opacity", 0.5)
        .attr("d", line.xHelpLine(x_data))

    line.zeroHelpPath
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("opacity", 0.5)
        .attr("d", line.zeroHelpLine(zero_data))

}

function setParamInfo(line) {
    line.paramInfoGroup = line.group.append("g")
    line.paramInfoRect = line.paramInfoGroup.append("rect")
    line.paramInfoText = line.paramInfoGroup.append("text")
        
}

function updateParamInfo(line) {
    var index = line.canvas.together ? line.canvas.lines.indexOf(line) + 2 : 2

    line.paramInfoRect
        .attr("x", 0)
        .attr("y", line.height + (index* 17) - 10)
        .attr("fill", line.color)
        .attr("height", 10)
        .attr("width", 10)
        .on("mouseenter", highlightLine.bind(null, line, true))
        .on("mouseleave", highlightLine.bind(null, line, false))
    
    line.paramInfoText
        .attr("x", 15)
        .attr("y", line.height + (index * 17))
        .attr("height", 10)
        .style("font-size", 12)
        .text(line.param.name)
        .on("mouseenter", highlightLine.bind(null, line, true))
        .on("mouseleave", highlightLine.bind(null, line, false))
}

function highlightLine(line, highlight){
    line.path
        .attr("stroke-width", highlight ? 2 : 1)
}

function setZoom(line) {
    line.zoom = d3.zoom()
        .scaleExtent([1, 2000])
        .on("zoom", zoomChart.bind(null, line))
        .on("end", zoomEnd.bind(null, line))
}

function updateZoom(line) {
    line.zoom
        .translateExtent([[0, 0], [line.width, line.height]])
        .extent([[0, 0], [line.width, line.height]])
}

function setZoomRect(line) {
    line.zoom_rect = line.group.append("rect")
        .style("pointer-events", "all")
        .call(line.zoom)
}

function updateZoomRect(line) {
    line.zoom_rect
        .attr("width", line.width)
        .attr("height",line.height)
        .style("fill", "none")
        .raise()
}

function zoomEnd(line) {
    var t = d3.event.transform

    if (t.line == line) return false
}

function zoomChart(line) {
    var t = d3.event.transform
    if (t.line && t.line != line) return false
    t.line = line
    line.canvas.zoomTransform = t

    var i = line.canvas.lines.indexOf(line)
    var other_lines = line.canvas.lines.slice()
    other_lines.splice(i, 1)

    for (l of other_lines) {
        l.zoom_rect.call(l.zoom.transform, t)
    }
    zoomLines(line, line.canvas,t)
}

function zoomLines(line, canvas, transform) {

    var scale = transform.rescaleX(line.xScaleBase)
    var start = format(scale.domain()[0])
    var end = format(scale.domain()[1])

    canvas.options.start = start 
    canvas.options.end = end

    canvas.xScale = scale
    line.raw_data.data = filterData(line.raw_data, canvas.options)

    for (l of canvas.lines) {
        l.raw_data.data = line.raw_data.data
        l.xScale = scale
        dataAnalysis(l)
    }

    if (canvas.together) calculateLineScale(canvas)

    for (l of canvas.lines) {
        updateScales(l)
        updateAxis(l)
        updateAxisGroup(l)
        updateArea(l)
        updatePath(l)
        findPoint(l)
    }

    canvas.options.newZoomLevel = false
}

function zoomButton(canvas) {
    var line = canvas.lines[0]
    console.log(line)

    console.log(line.zoom.scaleBy(1.1))

    //line.transition().duration(750).call(zoom.event);


    //line.zoom_rect.call(line.zoom.transform, canvas.zoomTransform)
}
  
function coordinates(point) {
    var scale = zoom.scale(), translate = zoom.translate();
    return [(point[0] - translate[0]) / scale, (point[1] - translate[1]) / scale];
}
  
function point(coordinates) {
    var scale = zoom.scale(), translate = zoom.translate();
    return [coordinates[0] * scale + translate[0], coordinates[1] * scale + translate[1]];
}



function Circle(line,x,y,r) {
    this.line = line
    this.x = x
    this.y = y
    this.r = r
    line.circles.push(this)
}

function setCircle(circle) {
    if (!circle.self) circle.self = circle.line.group.append("circle")
}

function unsetCircle(circle){
    circle.self
        .attr("fill", "none")
}

function updateCircle(circle) {
    if (isNaN(circle.y)){
        circle.self.attr("r", 0)
        return false
    }
    circle.self 
        .attr("cx", circle.x)
        .attr("cy", circle.y)
        .attr("r", circle.r)
        .attr("fill", circle.line.color)
}

function setCaptureJerry(line) {
    if (!line.pointerCircle) line.pointerCircle = new Circle(line, 0,0,3)
    setCircle(line.pointerCircle)
    line.zoom_rect.on("mousemove", findPoint.bind(line.zoom_rect.node(), line))
    line.zoom_rect.on("mouseleave", removePoint.bind(null, line))
    line.zoom_rect.on("touchmove", findPoint.bind(line.zoom_rect.node(), line))
    line.zoom_rect.on("touchend", removePoint.bind(null, line))
}

function findPoint(line) {
    var coord = d3.mouse(line.zoom_rect.node())
    var x = line.xScale.invert(coord[0])

    var index = findDateIndex(line.raw_data.data, format(x))
    if (index == -1) return false
    for (l of line.canvas.lines){
        l.mouse_data = l.raw_data.data[index]
        l.pointerCircle.x = l.xScale(parse(l.mouse_data["time"]))
        l.pointerCircle.y = l.yScale(l.mouse_data[l.param.name])
        updateCircle(l.pointerCircle)
        updateHelpPath(l)
    }
    line.canvas.mouse_data = line.raw_data.data[index]
    updateInfoBox(line.canvas.infoBox)
}

function removePoint(line){
    line.mouse_data = null
}

/*
    |**|**|                         |**|**|
    |**|**|    Canvas Object and    |**|**|
    |**|**|                         |**|**|
    |**|**|         Functions       |**|**|
    |**|**|                         |**|**|
 */
var canvasList = new Array()
var counter = 0
function Canvas(options, together, margin, padding) {
    this.id = "canvas" + counter; counter += 1;
    this.options = options
    this.together = together
    this.lines = new Array()
    this.margin = margin ? margin : [0,0,0,0] //bottom, left, top, right
    this.padding = padding ? padding : [0,0,0,0] //bottom, left, top, right
    this.options.zoomLevel = options.date ? 0 : 3


    this.addLine = function(line) { 
        line.canvas = this; 
        this.lines.push(line); 
        setLine(line)
        
    }
    this.removeLine = function(line) {
        this.lines = this.lines.filter(d => d != line);
    }
    canvasList.push(this)
    setCanvas(this)
}

function setCanvas(canvas) {
    canvas.row = d3.select("#content")
        .append("div")
            .classed("row", true)
    canvas.chart = canvas.row
        .append("div")
            .classed("container col-sm-12 col-lg-8 col-xl-9", true)
        .append("div")
            .classed("card ", true)

    canvas.info = canvas.row
        .append("div")
            .classed("container col-sm-12 col-lg-4 col-xl-3", true)
        .append("div")
            .classed("card ", true)
            .style("height", "100%")

    canvas.infoBox = new InfoBox(canvas, canvas.info)
    setInfoBox(canvas.infoBox)

    canvas.group = canvas.chart.append("svg")
    setCanvasSize(canvas)
}

function setCanvasSize(canvas) {
    var dom = canvas.chart.node().getBoundingClientRect()
    canvas.width = dom.width
    canvas.height = win_height / 2
    canvas.group = canvas.group
        .style("height", (win_height / 2) + canvas.margin[0] + canvas.margin[2])
        .style("width", dom.width)
}

function removeCanvas(canvas) {
    canvas.row
        .transition()
        .duration(2000)
            .style("opacity", 0)
            .remove()
    
    canvasList = canvasList.filter(d => d != canvas)
}

function drawCanvas(canvas) {
    canvas.chart.style("opacity", 0)
        .style("transform", "translate(-500px, 0px)")
    
    canvas.chart
        .transition()
        .duration(0)
        .style("opacity", 1)
        .style("transition", "all 2s")
        .style("-webkit-transition", "all 2s")
        .style("transform", "translate(0px, 0px)")
    canvas.info.style("opacity", 0)
        .style("transform", "translate(200px, 0px")
    
    canvas.info
        .transition()
        .duration(0)
        .style("opacity", 1)
        .style("opacity", 1)
        .style("transition", "all 2s")
        .style("-webkit-transition", "all 2s")
        .style("transform", "translate(0px, 0px)")

    updateCanvas(canvas)
}

function updateCanvas(canvas) {
    calculateLineSize(canvas)
    calculateLinePosition(canvas)

    if (canvas.together){
        calculateLineScale(canvas);
    }

    for (line of canvas.lines) {
        if (!canvas.together) {
            dataAnalysis(line)
        }
        updateLine(line)
        if (canvas.zoomTransform) {
            canvas.zoomTransform.line = line
            line.zoom_rect.call(line.zoom.transform, canvas.zoomTransform)
        }
    } 
}

function calculateLinePosition(canvas) {
    for (line_index in canvas.lines) {
        var l = canvas.lines[line_index]
        l.translateX = (canvas.margin[1] +  canvas.padding[1])
        if (!canvas.together) {
            l.translateY = (canvas.margin[2] + 
                    (line_index * (canvas.padding[2] + canvas.padding[0] +  canvas.lines[line_index].height)))
        } else {
            l.translateY = (canvas.margin[2] + canvas.padding[2])
        }
        l.transform = "translate(" + l.translateX + "," + l.translateY + ")";
    }
}

function calculateLineSize(canvas) {

    var width = canvas.width - (canvas.margin[1] + canvas.margin[3] + canvas.padding[1] + canvas.padding[3])
    canvas.line_width = width;

    canvas.line_height = canvas.together ? 300 : 150
    for (line of canvas.lines) {
        line.width = width
        line.height = canvas.line_height
    }

    var times = canvas.together ? 1 : canvas.lines.length
    var svg_height = (times * (canvas.line_height + canvas.padding[0] + canvas.padding[2])) + canvas.margin[0] + canvas.margin[2]
    var svg_width = canvas.line_width + canvas.padding[1] + canvas.padding[3] + canvas.margin[1] + canvas.margin[3]

    
    canvas.group.style("height", svg_height + "px")
    canvas.group.style("width", svg_width + "px")
}

function calculateLineScale(canvas) {

    var lmax, lmin;
    var rmax, rmin;

    for (line of canvas.lines) {

        if (line.axisLeft) {
            lmax = lmax > line.ymax || isNaN(line.ymax) ?  lmax : line.ymax
            lmin = lmin < line.ymin || isNaN(line.ymin) ?   lmin : line.ymin

        } else {
            rmax = rmax > line.ymax || isNaN(line.ymax) ?  rmax: line.ymax
            rmin = rmin < line.ymin || isNaN(line.ymin) ? rmin  :line.ymin 
        }
    }

    for (line of canvas.lines) {
        if (line.axisLeft) {
            line.ymax = lmax;
            line.ymin = lmin;
        } else {
            line.ymax = rmax;
            line.ymin = rmin;
        }
    }
}

function InfoBox(canvas, element) {
    this.canvas = canvas
    this.element = element
} 

function setInfoBox(box) {
    box.header = box.element.append("div").classed("card-header", true)
    box.body = box.element.append("div").classed("text-center", true)
    box.footer = box.element.append("div").classed("card-footer dropdown", true)

    box.body.classed("text-center", true).style("margin", "auto")

    box.location = box.body.append("label")
    box.timespan = box.body.append("p")
    box.meanTemp = box.body.append("h1")
    box.maxminTemp = box.body.append("label")

    box.spread = box.footer.append("button")
    box.spread
        .classed("spread", true)
        .classed("bttn", true)
        .on("click", spread.bind(null, box.canvas))

    box.remove = box.header.append("button")
    box.remove.on("click", removeCanvas.bind(null,box.canvas))
    
    var checkboxes = box.header.append("div").classed("chckbx", true)
    for (param of params) {
        var checkbox = checkboxes.append("button")
        checkbox
            .classed("checkbx active", true)
            .html(param.name)
            .on("click", onCheckBoxClick.bind(null,box, checkbox, param))
        checkboxes.append("br")
    }

    console.log(box.canvas.lines)
    box.footer.append("button").html("test").on("click", zoomButton.bind(null, box.canvas))

}

function setLocationDropDown(box) {
    box.header.append("button").classed("dropbtn", true).html("Standorte")
    box.locationList = box.header.append("div").classed("dropdown-content", true)
    for (loc of locations) {

        box.locationList.append("a")
            .classed("", true)
                .html(loc.name)
    }
}

function onCheckBoxClick(box, checkbox, param) {
    var active = checkbox.classed("active")
    if (active) {
        var x = box.canvas.lines.filter(d => d.param == param)
        removeLine(x[0])
        drawCanvas(box.canvas)
    } else {
        var data = box.canvas.options.data
        var line = new LineParameter(param, data, param.color, param.left)
        box.canvas.addLine(line)
        drawCanvas(box.canvas)
    }
    checkbox.classed("active", !active)
}

var infoDateFormat = d3.timeFormat("%a %d %b %Y")
var infoDateSpanFormat = d3.timeFormat("%d %b %Y")
var tempFormat = d3.format(".2n")
var rainFormat = d3.format(".0f")
function updateInfoBox(box) {


    var d = box.canvas.mouse_data
    var s = box.canvas.xScale

    var from = infoDateSpanFormat(s.domain()[0])
    var to = infoDateSpanFormat(s.domain()[1])

    var dateFormat = getTimeFormat(box.canvas)
    var date = dateFormat(parse(d["time"]))

    var mean =  tempFormat(d[params[1].name])
    var max =   tempFormat(d[params[0].name])
    var min =   tempFormat(d[params[2].name])
    var rain =  rainFormat(d[params[3].name])

    box.location.html(box.canvas.options.location.name)
    box.timespan.html(date)
    box.meanTemp.html(mean + "°C")
    box.maxminTemp.html(max + "°C / " + min + "°C | " + rain + " mm")
}

function getTimeFormat(canvas){
    var level = canvas.options.zoomLevel
    
    switch (level) {
        case 0:
            return d3.timeFormat("%A %d %b %Y")
        case 1:
            return weekFormat
        case 2:
            return d3.timeFormat("%B %Y")
        case 3: 
            return d3.timeFormat("%Y")
        default:
            return d3.timeFormat("%Y")
    }
}

function weekFormat(date) {

    var f = d3.timeFormat("%Y")
    return "Week " + date.getWeek() + " - " + f(date)
}


function spread(canvas) {
    canvas.together = !canvas.together
    drawCanvas(canvas)
}

window.addEventListener("resize", onResize)
function onResize() {
    for (canvas of canvasList){
        setCanvasSize(canvas)
        updateCanvas(canvas)
    }
}








function startUp() {

    setup()
    prepareScale()

    var four = show3D(niederschlag)
    

    var graph_size = win_width;


    scale = 0.8
    off_center = win_x_scale((1-scale) * 0.5)
    off_top = win_y_scale(0.25)
    four.attr("transform", "translate("+ off_center +"," + off_top + ") scale(" + scale + ")")

   //magic()

}

function show3D(param, size, color, shadow) {

    var mapped_data = map(data, "time", param)
    var low_data = new Array();
    var high_data = new Array();

    mapped_data.forEach(function(value, index, array) {

        low_data.push(value);
        high_data.push(value);

        if (index >= array.length - 1) {
            low_data.push(true)
            high_data.push(true)
            return
        }
        if (array[index+1].y > value.y){
            low_data.push(true);
            high_data.push(false);
        } else {
            high_data.push(true);
            low_data.push(false);
        }
    });

    var area_group = svg.append("g")
        .classed("area-group", true)
        .style("height", line_height)
        .style("width", win_width)
    
    var low = lowArea(30, 20);
    var path_low = area_group
        .append("path")
        .attr("d", low(low_data))
        .attr("fill", "#0059b3")
        .attr("stroke", "none")
  
    var high = highArea(30, 20)
    var path_high = area_group
        .append("path")
        .attr("d", high(high_data))
        .attr("fill", "#0059b3")
        .attr("stroke", "none")

    var base = baseArea(30)
    var path = area_group
        .append("path")
        .attr("d", base(mapped_data))
        .attr("fill", "#3399ff")
    
    return area_group;

   
}

function magic() {

    var t = d3.transition()
        .duration(4000)
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

function baseArea(size) {

    return d3.area()
    .x((d,i) => { return xScale(parse(d.x))})
    .y1((d,i) => yScale(d.y) + size) 
    .y0((d,i) => yScale(d.y) - size)
    .defined((d,i,a) => {return !isNaN(d.y) || d})
}

function lowArea(area_size, size) {

    return d3.area()
    .x0((d,i,a) => {
        var val;
        if (i % 2 == 1) {
            val = xScale(parse(a[(i-1)].x))
            
        } else {
            val = xScale(parse(a[i].x))
        }
        return val;
    })
    .x1((d,i, a) => {
        var val;
        if (i % 2 == 1) {
            val = xScale(parse(a[(i-1)].x)) + size
        } else {
            val = xScale(parse(a[(i)].x)) + size
        }
        return val;
    })
    .y((d,i,a) => {
        var val;
        if (i % 2 == 1) {
            val = yScale(a[i-1].y) + area_size
        } else {
            val =  yScale(d.y) + area_size
        }
        return val;
    })
    .defined((d,i,a) => d)

}

function highArea(area_size, size) {

    return d3.area()
    .x0((d,i, a) => {
        var val;
        if (i % 2 == 1) {
            val = xScale(parse(a[i-1].x))
        } else {
            val = xScale(parse(a[i].x))
        }
        
        return val;
    })
    .x1((d,i,a) => {
        var val;
        if (i % 2 == 1) {
            val = xScale(parse(a[(i-1)].x)) + size
        } else {
            val = xScale(parse(a[(i)].x)) + size
        }
        
        return val;
    })
    .y((d,i,a) => {
        var val;
        if (i % 2 == 1) {
            val = yScale(a[i-1].y) - area_size;
        } else {
            val =  yScale(d.y) - area_size;
        }
        
        return val;
        
    })
    .defined((d,i,a) => d)
}