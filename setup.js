var my_format = d3.timeFormat("%d/%m/%Y")

function start() {


    var s = d3.select("#start_circle")
        .append("div").raise()
    s.append("h1").html("How's")
    s.append("h1").html("the")
    s.append("h1").html("weather")
    var today = s.append("h1").html("today?")

    var list = s.selectAll("h1")
    var group = list._groups[0]
    list.each( (d,index) => {
        d3.select(group[index])
            
        .transition()
        .delay(index * 300)
        .duration(300)
        .style("top", "0px")
        .style("opacity", 1)
    })

    today.on("click", function() {

        // Initialization
        //$('#my-element').datepicker([options])
        // Access instance of plugin
        //$('#my-element').data('datepicker')
        console.log(today.node().offsetWidth)
        today.remove();
        s.append("h1").html("on")
            .transition()
            .duration(300)
            .style("top", "0px")
            .style("opacity", 1)
        s.append("h1").html("the")
            .transition()
            .delay(300)
            .duration(300)
            .style("top", "0px")
            .style("opacity", 1)
        s.append("input")
            .attr("id", "dayDate")
            .attr("type", "text")
            .classed("datepicker-here", true)
            .attr("value", my_format(new Date()))
            .style("width", "100px")
            .style("text-align", "center")
        
        $('#dayDate').datepicker({ language : "en", maxDate : new Date()})
    })


}

start()