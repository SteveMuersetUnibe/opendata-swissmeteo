var my_format = d3.timeFormat("%d/%m/%Y")

function start() {

    var question1 = d3.select("#question-one")
    var location1 = d3.select("#location-one")
    var go1 = d3.select("#go-one")

    for (index in locations) {

        location1.append("button")
            .classed("dropdown-content col-6 col-sm-6 col-md-4", true)
                .attr("value", index)
                .html(locations[index].name)
                .on("click", function(index) {
                    console.log(index)
                    d3.select("#standortbtn")
                        .attr("value", index)
                        .html(locations[index].name)
                }.bind(null, index))
    }

    go1.on("click", function() {

        var location = d3.select("#standortbtn").node().value != -1 ? d3.select("#standortbtn").node().value : 0

        var date = $('#today1').data('datepicker').lastSelectedDate
        $('#today1').data('datepicker').removeDate(date)
        
        var options = new Options(locations[location], null, null, date)
        
        var promise = onChangeOptions(options).then(d => {

        var canvas = new Canvas(options, true, [100, 50, 50, 100], [30, 10, 30, 10])
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

        d3.select("#start").classed("active", !d3.select("#start").classed("active"));

        var startbbox = d3.select("#start").node().getBoundingClientRect()
        d3.select("#start").style("transform", "translate(-"+ (startbbox.width / 2) + "px,-" + (startbbox.height / 2) +"px) scale(0)")

    });

    

    d3.select("#menuIcon").on("click", function() {
        if (d3.select("#content").classed("active")) {
            d3.select("#start").style("transform", "translate(0px, 0px) scale(1)")
        } else {
            var startbbox = d3.select("#start").node().getBoundingClientRect()
            d3.select("#start").style("transform", "translate(-"+ (startbbox.width / 2) + "px,-" + (startbbox.height / 2) +"px) scale(0)")
        }
        d3.select("#content").classed("active", !d3.select("#content").classed("active"));
        d3.select("#start").classed("active", !d3.select("#start").classed("active"));
    })
}

start()


function showAll() {


   
    for (index in locations){
        setTimeout( function (index) {
        var options = new Options(locations[index], null, null, null)
        
        var promise = onChangeOptions(options).then(d => {

        var canvas = new Canvas(options, true, [100, 100, 50, 100], [30, 10, 30, 10])
        var lines = [
            new LineParameter(params[1], options.data, colors[1], true),
        ]

        canvas.addLine(lines[0]) 

        drawCanvas(canvas)
        })
        }, 2000 * index, index)
    }
    
}