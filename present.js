var options = new Options(BER, 1000,0, 0, 0, 0)
var colors = ["#85f441", "#4286f4", "#f44141", "#2c10cc"]
var canvas;

var lines;
var promise = onChangeOptions(options).then(d => {

    

    canvas = new Canvas(true, win_width * 0.8, win_height * 0.8, [50, 100, 50, 100], [0, 10, 50, 10])

    lines = [
        new LineParameter(params[0], data, colors[0], true),
        new LineParameter(params[1], data, colors[1], true),
        new LineParameter(params[2], data, colors[2], true),
        new LineParameter(params[3], data, colors[3], false)
    ]

    canvas.addLine(lines[0])
    canvas.addLine(lines[1])    
    canvas.addLine(lines[2])    
    canvas.addLine(lines[3])    

    drawCanvas(canvas)
})

function remove () {


    canvas.removeLine(lines[2])
    drawCanvas(canvas)

}

function add() {

    canvas.addLine(lines[2])
    drawCanvas(canvas)
}

function spread() {

    canvas.together = !canvas.together
    drawCanvas(canvas)
}



























var august = new Date(2018, 07, 15)

var tests = [{
    data_path : BER,
    timespan : 1,
    count : 10000,
    date : 0
}, {
    data_path : BER,
    timespan : 15,
    count : 100,
    date : new Date()

}, {
    data_path : SBE,
    timespan : 15,
    count : 20,
    date : august
}]

function start() {
    getdata(BER);
}


var counter = 0;
function next() {

    data_path = tests[counter].data_path
    timespan = tests[counter].timespan;
    count = tests[counter].count;
    date = tests[counter].date

    console.log("Data File: ", data_path)
    console.log("Timespan: ",timespan)
    console.log("Count: ",count)
    console.log(date)

    getdata(tests[counter].data_path)
    

    counter += 1;
}