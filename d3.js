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
    this.setup = false
    this.zoomLevel = 0

    this.infoBox = new InfoBox(this)

    dataAnalysis(this);
}

function setupLine(line) {
    setScales(line);
    setAxis(line);
    setLine(line);
    drawLine(line);
    setInfoBox(line.infoBox)
    setClip(line);
    setZoom(line);
    setCaptureJerry(line)
    line.setup = true
}

function dataAnalysis(line) {
    //error if raw_data and param not defined
    line.data = map(line.raw_data.data, "time", line.param.name)

    line.ymin = d3.min(line.data, d => d.y)
    line.ymax = d3.max(line.data, d => d.y)
    line.ymean = d3.mean(line.data, d => d.y)

    line.xmin = parse(line.raw_data.all_data[0]["time"])
    
    line.xmax = parse(line.raw_data.all_data[line.raw_data.all_data.length - 1]["time"])
    
}

/*
    |**|**|                                 |**|**|
    |**|**|    LineChart set Functions      |**|**|
    |**|**|                                 |**|**|
 */

function setScales(line) {
    line.xScaleBase = d3.scaleTime().domain([line.xmin, line.xmax]).range([0, line.width]).clamp(true).nice()
    line.xScale = line.xScaleBase
    line.canvas.xScaleBase = line.xScaleBase

    line.yScale = d3.scaleLinear().clamp(true).nice()

    updateScales(line)
}

function updateScales(line) {
    line.xScaleBase.range([0, line.width])
    line.xScale.range([0, line.width])

    line.yScale.domain([line.ymin, line.ymax]).range([line.height, 0])
}

function setAxis(line) {
    line.xAxis = d3.axisBottom()

    updateAxis(line)
}

function updateAxis(line) {
    line.drawAxisLeft = line.canvas.together ? line.axisLeft : true
    line.yAxis = line.drawAxisLeft ? d3.axisLeft() : d3.axisRight()
    line.xAxis.scale(line.xScale);
    line.yAxis.scale(line.yScale);
}

function setLine(line) {
    line.line = d3.area()
        .x(d => line.xScale(d.x))
        .y(d => line.yScale(d.y))
        .defined(d => !isNaN(d.y))
}

function setClip(line) {
    line.clip_id = "clip" + line.param.short
    line.clip = line.group.append("clipPath")
        .attr("id", line.clip_id)
        .append("rect")
    line.path.attr("clip-path", "url(#" + line.clip_id + ")")
    updateClip(line)
}

function drawLine(line) {

    line.chart = line.canvas.group.append("g")
        .classed("chart-group", true)

    line.group = line.chart.append("g")

    line.group
        .classed("area-group", true)
        .style("opacity", 0)
        .attr("transform", line.transform)
                
    line.path = line.group.append("path")
        
        .attr("fill", line.color)
        .attr("stroke", line.color)
        .attr("d", line.line(line.data))

    line.yAxisGroup = line.group.append("g")
        .attr("transform", "translate(" + (line.drawAxisLeft ? 0 : line.width) +",0)") 
        .call(line.yAxis)
        .style("z-index", -10)
    
    line.xAxisGroup = line.group.append("g")
        .attr("transform", "translate(0, "+ line.height +")")
        .call(line.xAxis)
        .style("z-index", -10)

    line.canvas.transitions.push(new ChartTransition(line, opacityTransition))
}


/*
    |**|**|                                 |**|**|
    |**|**|    LineChart update Functions   |**|**|
    |**|**|                                 |**|**|
 */

 

function updateLineChart(line) {
    updateAxis(line)
    updateAxisGroup(line)
    updateLineGroup(line)
    updatePath(line)
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

function updateLineGroup(line) {
    line.group
        .attr("transform" , line.transform)
}

function updatePath(line) {
    line.path
        .attr("fill", line.color)
        .attr("stroke", line.color)
        .attr("d", line.line(line.data))
}

function updateClip(line) {
    line.clip
        .attr("width", line.width )
        .attr("height", line.height )
        .attr("x", 0)
        .attr("y", 0);
}

/*
    |**|**|                             |**|**|
    |**|**|    LineChart Transitions    |**|**|
    |**|**|                             |**|**|
 */

function opacityTransition(line) {

    if (line.group.style("opacity") == 1){
        line.group
            .transition()
            .duration(100)
            .style("opacity", 0)
            .on("end", d => {line.setup = false; line.canvas.nextTransition()})
            .remove()
        return false
    }

    line.group
        .transition()
        .duration(600)
        .style("opacity", 1)
    line.canvas.nextTransition()
}

function translateTransition(line) {

    if (
        line.path.attr("d") == line.line(line.data)
        && line.xAxisGroup.attr("transform") == "translate(0, " + line.height + ")"
        && line.yAxisGroup.attr("transform") == "translate(" + (line.drawAxisLeft ? 0 : line.width) + ",0)"
        && line.group.attr("transform") == line.transform
    ) {
        line.canvas.nextTransition()
        return false
    } else if (line.group.style("opacity") == 0) {
        updateLineChart(line)
        line.canvas.nextTransition()
        return false
    }

    lineTransition(line)
    axisGroupTransition(line)
    lineGroupTransition(line)
    line.canvas.nextTransition()
}

function lineGroupTransition(line) {
    line.group
        .transition()
        .duration(500)
        .attr("transform", line.transform)
}

function lineTransition(line) {
    line.path
    .transition()
    .duration(500)
    .attr("d", line.line(line.data))
}

function axisGroupTransition(line) {
    updateAxis(line)
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
    


/*
    |**|**|                                 |**|**|
    |**|**|    LineChart zoom Functions     |**|**|
    |**|**|                                 |**|**|
 */

function setZoom(line) {
    line.zoom = d3.zoom()
        .scaleExtent([1, 2000])
        .on("zoom", zoomChart.bind(null, line))
        .on("end", zoomEnd.bind(null, line))

    line.zoom_rect = line.group.append("rect")
        .style("pointer-events", "all")
        .call(line.zoom);
}

function zoomEnd(line) {
    var t = d3.event.transform

    if (t.line == line) {
        console.log("end")
    }
}

function updateZoom(line) {
    line.zoom
        .translateExtent([[0, 0], [line.width, line.height]])
        .extent([[0, 0], [line.width, line.height]])
            
    line.zoom_rect
        .attr("width", line.width)
        .attr("height",line.height)
        .style("fill", "none")
}

function zoomChart(line) {
    var t = d3.event.transform

    createCircle(line)
    if (t.line && t.line != line) return false
    t.line = line

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

    line.raw_data.data = filterData(line.raw_data, canvas.options)
    for (l of canvas.lines) {
        l.raw_data.data = line.raw_data.data
        l.xScale = scale
        dataAnalysis(l)
    }
    if (line.canvas.together) calculateLineScale(canvas)

    for (l of canvas.lines) {
        setScales(l)
        setLine(l)
        updateAxis(l)
        updateAxisGroup(l)
        updateLineGroup(l)
        updatePath(l)
    }

}

function calculateZoom(canvas) {

    var start_pos = canvas.xScaleBase(parse(canvas.options.start))
    var end_pos = canvas.xScaleBase(parse(canvas.options.end))
    var scaleTo = canvas.line_width / (end_pos - start_pos)

    for (l of canvas.lines) {
        l.zoom_rect
            .transition()
            .duration(5000)
            .call(l.zoom.transform, d3.zoomIdentity
                .scale(scaleTo)
                .translate(-start_pos, 0)
            )
    }
}


/*
    |**|**|                         |**|**|
    |**|**|    Canvas Object and    |**|**|
    |**|**|                         |**|**|
    |**|**|         Functions       |**|**|
    |**|**|                         |**|**|
 */

function Canvas(options, together, width, height, margin, padding, settings) {
    
    this.settings = settings
    this.options = options
    this.together = together
    this.width = width
    this.height = height
    this.lines = new Array()
    this.margin = margin ? margin : [0,0,0,0] //bottom, left, top, right
    this.padding = padding ? padding : [0,0,0,0] //bottom, left, top, right
    this.transitions = new Array();
    this.nextTransition = function () {
        var t = this.transitions.shift()
        if (t) {
            t.transitionFn(t.line)
        }
    }
    this.options.zoomLevel = 4

    this.addLine = function(line) { line.canvas = this; this.lines.push(line)}
    this.removeLine = function(line) {
        this.lines = this.lines.filter(d => d != line);
        line.canvas.transitions.push(new ChartTransition(line, opacityTransition))
        }
    setupCanvas(this)
}

function setupCanvas(canvas) {
    canvas.group = d3.select("#chart")
        .attr("align", "center")
        .append("svg")
        .style("height", canvas.height)
        .style("width", canvas.width)
}

function removeCanvas(canvas) {
    canvas.group
        .transition()
        .duration(500)
            .style("opacity", 0)
            .remove()
}

function drawCanvas(canvas) {
    updateCanvas(canvas)
    canvas.nextTransition()
    if (!canvas.drawn) {
        //calculateZoom(canvas)
        canvas.drawn = true
    }
    
}

function updateCanvas(canvas) {

    calculateLineSize(canvas)
    calculateLinePosition(canvas)

    if (canvas.together){
        calculateLineScale(canvas);
    }
    
    for (line of canvas.lines.slice().reverse()){

        if (line.setup) {
            if (!canvas.together) dataAnalysis(line)
            setScales(line)
            updateScales(line)
            updateAxis(line)
            updateClip(line)
            updateZoom(line)
            updateInfoBox(line.infoBox)
            canvas.transitions.unshift(new ChartTransition(line, translateTransition))
        } else {
            setupLine(line)
            updateZoom(line)
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
    var line_count = canvas.lines.length;

    var width = canvas.width - (canvas.margin[1] + canvas.margin[3] + canvas.padding[1] + canvas.padding[3])
    
    var height = canvas.height - (canvas.margin[0] + canvas.margin[2])
    canvas.line_height = canvas.together ? canvas.height - (canvas.margin[0] + canvas.margin[2] + canvas.padding[0] + canvas.padding[2]) : (height / line_count) - (canvas.padding[0] + canvas.padding[2])
    

    canvas.line_width = canvas.line_width < canvas.settings.l_min_width ? canvas.settings.l_min_width : canvas.line_width
    canvas.line_width = canvas.line_width > canvas.settings.l_max_width ? canvas.settings.l_max_width : canvas.line_width
    canvas.line_height = canvas.line_height < canvas.settings.l_min_height ? canvas.settings.l_min_height : canvas.line_height
    canvas.line_height = canvas.line_height > canvas.settings.l_max_height ? canvas.settings.l_max_height : canvas.line_height

    canvas.line_width = canvas.together ? width : width - (canvas.line_height + canvas.padding[1] + canvas.padding[3])

    for (line of canvas.lines) {
        line.width = canvas.line_width
        line.height = canvas.line_height
    }

    var times = canvas.together ? 1 : canvas.lines.length
    var svg_height = (times * (canvas.line_height + canvas.padding[0] + canvas.padding[2])) + canvas.margin[0] + canvas.margin[2]
    var svg_width = canvas.line_width + canvas.padding[1] + canvas.padding[3] + canvas.margin[1] + canvas.margin[3]

    canvas.group.style("height", svg_height)
    canvas.group.style("widht", svg_width)
}

function calculateLineScale(canvas) {

    var lmax, lmin;
    var rmax, rmin;

    for (line of canvas.lines) {

        if (line.axisLeft) {
            lmax = lmax > line.ymax ? lmax : line.ymax
            lmin = lmin < line.ymin ? lmin : line.ymin

        } else {
            rmax = rmax > line.ymax ? rmax : line.ymax
            rmin = rmin < line.ymin ? rmin : line.ymin
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

function ChartTransition(line, transitionFn) {
    this.line = line
    this.transitionFn = transitionFn
}


function setCaptureJerry(line) {
    line.zoom_rect.on("mousemove", findPoint.bind(line.zoom_rect.node(), line))
    line.zoom_rect.on("mouseleave", removePoint.bind(null, line))
}

function findPoint(line) {
    var coord = d3.mouse(this)

    var x = line.xScale.invert(coord[0])

    var index = findDateIndex(line.raw_data.data, format(x))
    for (l of line.canvas.lines){
        l.mouse_data = line.raw_data.data[index]
        updateInfoBox(l.infoBox)
        createCircle(l)
    }
}

function createCircle(line) {
    if (!line.mouse_data) return false
    var posX = line.xScale(parse(line.mouse_data["time"]))
    console.log(line.mouse_data[line.param.name])
    var posY = line.yScale(line.mouse_data[line.param.name])
    console.log(posY)

    line.group.selectAll("circle").remove()

    line.group.append("circle")
        .attr("cx", posX)
        .attr("cy", posY)
        .attr("r", 2)
        .attr("fill", line.color)

} 

function removePoint(line){
    line.mouse_data = null
}

function Settings(l_min_width, l_max_width, l_min_height, l_max_height) {
    this.l_min_height = l_min_height
    this.l_max_height = l_max_height
    this.l_min_width = l_min_width
    this.l_max_width = l_max_width
}


function InfoBox(line) {
    this.line = line
    this.height = line.height
    this.width = line.height
}

function updateInfoBox(infoBox){
    infoBox.height = infoBox.line.height 
    infoBox.width = infoBox.line.height
    if (infoBox.line.canvas.together) {
        infoBox.group.style("opacity", 0)
    } else {
        drawInfoBox(infoBox)
    }

}

function setInfoBox(infoBox) {
    //console.log(infoBox.line.group.append("div"))
    infoBox.container = infoBox.line.chart
        .append("g")
        .classed("infobox", true)

    infoBox.group = infoBox.container.append("foreignObject")
    infoBox.text = infoBox.group.append("xhtml:div")
        .classed("card-body text-center", true)
        .append("label")
        .classed("card-title", true)
        .html("asdfasdf")
    updateInfoBox(infoBox)
}

function drawInfoBox(infoBox) {
    infoBox.group
        .classed("card bg-light center-text", true)
        .attr("x", infoBox.line.width)
        .attr("width", infoBox.width)
        .attr("height", infoBox.height)
        .attr("transform", "translate(" + (infoBox.line.translateX + infoBox.line.canvas.padding[1]) +  "," + infoBox.line.translateY + ")")
        .style("opacity", 1)

    if (infoBox.line.mouse_data){
        infoBox.text.html(infoBox.line.mouse_data[infoBox.line.param.name])
    }
    
        // .classed("infobox", true)
        // .attr("x", line.width)
        // .style("width", line.height)
        // .style("height", line.height)
        // .style("background-color", "blue")
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