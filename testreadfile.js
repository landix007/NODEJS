var fs = require("fs")
var datajson = require("./data.json")

fs.readFile("./data.json","UTF-8",(err,data) => {
    var vData = JSON.parse(data)
    console.log("content from readfile approach:",vData[0].title)
} )

console.log("data from file require approach:",datajson[0])