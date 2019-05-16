var x = "19800101"
var y = "20010505"

var options = new Options(BER.file, x, y, 0, 0)
var options2 = new Options(BER.file, x, y, 0, 0)


var canvas;
var canvas2;

var lines;
var promise = onChangeOptions(options).then(d => {

    canvas = new Canvas("first", options, true, [100, 100, 50, 100], [30, 10, 30, 10])
    lines = [
        new LineParameter(params[0], current_data, colors[0], true),
        new LineParameter(params[1], current_data, colors[1], true),
        new LineParameter(params[2], current_data, colors[2], true),
        new LineParameter(params[3], current_data, colors[3], false)
    ]

    canvas.addLine(lines[0])
    canvas.addLine(lines[1])    
    canvas.addLine(lines[2])    
    canvas.addLine(lines[3])    

    drawCanvas(canvas)
})

var promise2 = onChangeOptions(options2).then(d => {

    canvas2 = new Canvas("second", options2, false, [100, 100, 50, 100], [30, 10, 30, 10])
    var lines2 = [
        new LineParameter(params[0], options2.data, colors[0], true),
        new LineParameter(params[1], options2.data, colors[1], true),
        new LineParameter(params[2], options2.data, colors[2], true),
        new LineParameter(params[3], options2.data, colors[3], false)
    ]

    canvas2.addLine(lines2[0])
    canvas2.addLine(lines2[1])    
    canvas2.addLine(lines2[2])    
    canvas2.addLine(lines2[3])    

    drawCanvas(canvas2)
})

function remove (num) {
    removeLine(lines[num])
    drawCanvas(canvas)
}

function add(num) {
    canvas.addLine(new LineParameter(params[num], current_data, colors[num], true))
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