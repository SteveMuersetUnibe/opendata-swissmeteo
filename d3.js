

var win_height = window.innerHeight;
var win_width = window.innerWidth;

var parse = d3.timeParse("%Y%m%d");

var svg;

function clear() {
    if (svg) svg.remove();
}

function map(data, xParam, yParam) {
    return data.map((value) => { return {x : parse(value[xParam]), y : parseFloat(value[yParam])} })
}

function LineParameter(param, data, color, left, dimension) {
    this.color = color
    this.param = param
    this.raw_data = data
    this.dimension = dimension
    this.left = left
    this.setup = false

    dataAnalysis(this);
}

function setupLine(line) {
    setScales(line);
    setAxis(line);
    setLine(line);
    drawLine(line);
    addClip(line);
    addZoom(line);
    line.setup = true
}

function dataAnalysis(line) {
    //error if raw_data and param not defined
    line.data = map(line.raw_data, "time", line.param.name)

    var check = line.data.slice(options.start, options.start + options.width)
    line.data = check
    line.ymin = d3.min(check, d => d.y)
    line.ymax = d3.max(check, d => d.y)
    line.ymean = d3.mean(check, d => d.y)

    line.data_length = line.data.length
    line.xmin = line.data[options.start].x
    line.xmax = line.data[options.start + options.width -1].x
}

function setScales(line) {
    //error if widht and height not defined

    line.xScaleBase = d3.scaleTime().domain([line.xmin, line.xmax]).range([0, line.width]).clamp(true)
    line.yScaleBase = d3.scaleLinear().domain([line.ymin, line.ymax]).range([line.height, 0]).clamp(true)
    line.xScale = line.xScaleBase
    line.yScale = line.yScaleBase
}

function setAxis(line) {
    //error if scales are not defined

    line.xAxis = d3.axisBottom()
    line.yAxis = this.left ? d3.axisLeft() : d3.axisRight()
    line.yAxis = line.yAxis
    updateAxis(line)
}

function updateAxis(line) {
    line.xAxis.scale(line.xScale);
    line.yAxis.scale(line.yScale);
}

function setLine(line) {
    line.line = d3.area()
        .x(d => line.xScale(d.x))
        .y(d => line.yScale(d.y))
        .defined(d => !isNaN(d.y))
}

function drawLine(line) {

    line.group = svg.append("g")
    line.group
        .classed("area-group", true)
        .attr("clip-path", "url(#clip" + line.param.name + ")")
        .attr("opacity", 0)
        .attr("transform", line.transform)
                
    line.path = line.group.append("path")
        .attr("fill", line.color)
        .attr("stroke", line.color)
        .attr("d", line.line(line.data))

    line.yAxisGroup = line.group.append("g")
        .attr("transform", "translate(" + (line.left ? 0 : line.width) +",0)") 
        .call(line.yAxis)
    
    line.xAxisGroup = line.group.append("g")
        .attr("transform", "translate(0, "+ line.height +")")
        .call(line.xAxis)

    line.canvas.transitions.push(new LineTransition(line, opacityTransition))
}

function updateLine(line) {

    line.group
        .attr("transform" , line.transform)

    line.path
        .attr("fill", line.color)
        .attr("stroke", line.color)
        .attr("d", line.line(line.data))

    line.xAxisGroup
        .attr("transform", "translate(0, "+ line.height +")")
        .call(line.xAxis)

    line.yAxisGroup
        .attr("transform", "translate(" + (line.left ? 0 : line.width) +",0)") 
        .call(line.yAxis)
}

function opacityTransition(line) {

    if (line.group.attr("opacity") == 1){
        line.group
            .transition()
            .duration(100)
            .attr("opacity", 0)
            .on("end", d => {line.setup = false; line.canvas.nextTransition()})
            .remove()

        return false
    }

    line.group
        .transition()
        .duration(600)
        .attr("opacity", 1)
    line.canvas.nextTransition()
}

function translateTransition(line) {

    if (
        line.path.attr("d") == line.line(line.data)
        && line.xAxisGroup.attr("transform") == "translate(0, " + line.height + ")"
        && line.yAxisGroup.attr("transform") == "translate(" + (line.left ? 0 : line.width) + ",0)"
        && line.group.attr("transform") == line.transform
    ) {
        line.canvas.nextTransition()
        return false
    } else if (line.group.attr("opacity") == 0) {
        updateLine(line)
        line.canvas.nextTransition()
        return false
    }

    line.path
        .transition()
        .duration(500)
        .attr("d", line.line(line.data))

    line.xAxisGroup
    .transition()
    .duration(500)
        .attr("transform", "translate(0, "+ line.height +")")
        .call(line.xAxis)

    line.yAxisGroup
    .transition()
    .duration(500)
        .attr("transform", "translate(" + (line.left ? 0 : line.width) +",0)") 
        .call(line.yAxis)

    line.group
        .transition()
        .duration(500)
        .attr("transform", line.transform)
    line.canvas.nextTransition()
}

function addClip(line) {
    line.clip_id = "clip" + line.param.name
    line.clip = line.group.append("clipPath")
        .attr("id", line.clip_id)
        .append("rect")
    updateClip(line)
}

function updateClip(line) {
    line.clip
        .attr("width", line.width )
        .attr("height", line.height )
        .attr("x", 0)
        .attr("y", 0);
}

function addZoom(line) {

    // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    line.zoom = d3.zoom()
        .scaleExtent([0.5, 40])
        .translateExtent([[0, 0], [line.width, line.height]])
        .extent([[0, 0], [line.width, line.height]])
        .on("zoom", updateChart.bind(null, line));

    line.zoom_rect = line.group.append("rect")
    // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
        .style("pointer-events", "all")
        .call(line.zoom);

    updateZoom(line)
// now the user can zoom and it will trigger the function called updateChart
}

function updateZoom(line) {
    line.zoom_rect
        .attr("width", line.width)
        .attr("height",line.height)
        .style("fill", "none")
}

// A function that updates the chart when the user zoom and thus new boundaries are available
function updateChart(line) {
    var t = d3.event.transform

    for (line of line.canvas.lines) {
        line.xScale = t.rescaleX(line.xScaleBase);
        updateAxis(line);
        setLine(line);
        updateLine(line);
    }
}

function Canvas(together, width, height, margin, padding) {
    
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

    this.addLine = function(line) { line.canvas = this; this.lines.push(line);}
    this.removeLine = function(line) {
        this.lines = this.lines.filter(d => d != line);
        line.canvas.transitions.push(new LineTransition(line, opacityTransition))
        }
    setup(this)
    //this.removeLine = function(line) { line.canvas = null; this.lines.remove(line)}
}

function setup(canvas) {
    clear()
    svg = d3.select("body")
        .append("svg")
        .style("height", canvas.height)
        .style("width", canvas.width)
            .append("g")
}

function drawCanvas(canvas) {
    updateCanvas(canvas)
    canvas.nextTransition()
}

function updateCanvas(canvas) {

    calculateLineSize(canvas)
    calculateLinePosition(canvas)

    if (canvas.together){
        calculateLineScale(canvas);
    }
    
    for (line of canvas.lines.slice().reverse()){

        if (line.setup) {
            setScales(line)
            updateAxis(line)
            updateClip(line)
            updateZoom(line)
            canvas.transitions.unshift(new LineTransition(line, translateTransition))
        } else {
            setupLine(line)
        }
    }
}

function calculateLinePosition(canvas) {

    for (line_index in canvas.lines) {
        if (!canvas.together) {
            canvas.lines[line_index].transform = "translate(" + (canvas.margin[1] +  canvas.padding[1]) + "," + (canvas.margin[2] + canvas.padding[2] + (line_index * (canvas.padding[2] + canvas.padding[0] +  canvas.lines[line_index].height))) + ")";
        } else {
            canvas.lines[line_index].transform = "translate(" +(canvas.margin[1] + canvas.padding[1])+ "," + (canvas.margin[2] + canvas.padding[2])+ ")"
        }
    }
}

function calculateLineSize(canvas) {
    var line_count = canvas.lines.length;

    for (line of canvas.lines) {
        line.width = canvas.width - (canvas.margin[1] + canvas.margin[3] + canvas.padding[1] + canvas.padding[3])

        var height = canvas.height - (canvas.margin[0] + canvas.margin[2])
        line.height = canvas.together ? canvas.height - (canvas.margin[0] + canvas.margin[2] + canvas.padding[0] + canvas.padding[2]) : (height / line_count) - (canvas.padding[0] + canvas.padding[2])
    }
}

function calculateLineScale(canvas) {

    var lmax, lmin;
    var rmax, rmin;

    for (line of canvas.lines) {

        if (line.left) {
            lmax = lmax > line.ymax ? lmax : line.ymax
            lmin = lmin < line.ymin ? lmin : line.ymin

        } else {
            rmax = rmax > line.ymax ? rmax : line.ymax
            rmin = rmin < line.ymin ? rmin : line.ymin
        }
    }

    for (line of canvas.lines) {
        if (line.left) {
            line.ymax = lmax;
            line.ymin = lmin;
        } else {
            line.ymax = rmax;
            line.ymin = rmin;
        }
    }
}

function LineTransition(line, transitionFn) {
    this.line = line
    this.transitionFn = transitionFn
}











function startUp() {

    setup()
    prepareScale()

    var four = show3D(niederschlag)
    // var one = show3D(params[0])
    // var two = show3D(params[1])
    
    // var three = show3D(params[2])
    

    var graph_size = win_width;

    // scale = 0.8
    // off_center = win_x_scale((1-scale) * 0.5)
    // off_top = win_y_scale(0.0)

    // one.attr("transform", "translate("+ off_center +"," + off_top + ") scale(" + scale + ")" )

    // scale = 0.8
    // off_center = win_x_scale((1-scale) * 0.5)
    // off_top = win_y_scale(0.2)
    // two.attr("transform", "translate("+ off_center +"," + off_top + ") scale(" + scale + ")" )

    // scale = 0.8
    // off_center = win_x_scale((1-scale) * 0.5)
    // off_top = win_y_scale(0.4)
    // three.attr("transform", "translate("+ off_center +"," + off_top + ") scale(" + scale + ")" )

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