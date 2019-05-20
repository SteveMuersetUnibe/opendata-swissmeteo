var my_format = d3.timeFormat("%d/%m/%Y")

function start() {

    var question1 = d3.select("#question-one")
    var location1 = d3.select("#location-one")
    var go1 = d3.select("#go-one")

    for (index in locations) {

        location1.append("option")
            .classed("", true)
                .attr("value", index)
                .html(locations[index].name)
    }

    

    go1.on("click", function() {

        var location = location1.node().value != -1 ? location1.node().value : 0

        var date = $('#today1').data('datepicker').lastSelectedDate
        console.log(date)
        
        var options = new Options(locations[location], null, null, date)
        
        var promise = onChangeOptions(options).then(d => {

        var canvas = new Canvas(options, true, [100, 100, 50, 100], [30, 10, 30, 10])
        var lines = [
            new LineParameter(params[0], options.data, colors[0], true),
            new LineParameter(params[1], options.data, colors[1], true),
            new LineParameter(params[2], options.data, colors[2], true),
            new LineParameter(params[3], options.data, colors[3], false)
        ]

        canvas.addLine(lines[0])
        canvas.addLine(lines[1])    
        canvas.addLine(lines[2])    
        canvas.addLine(lines[3])    

        drawCanvas(canvas)
        })
    });

}

start()