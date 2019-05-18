

function start() {


    var s = d3.select("#start_circle")
        .append("div")
    s.append("p").html("How's")
    s.append("p").html("the")
    s.append("p").html("weather")
    s.append("p").html("today?")

    var list = s.selectAll("p")
    var group = list._groups[0]
    list.each( (d,index) => {
        d3.select(group[index])
            
        .transition()
        .delay(index * 300)
        .duration(300)
        .style("top", "0px")
        .style("opacity", 1)
    })

}

start()