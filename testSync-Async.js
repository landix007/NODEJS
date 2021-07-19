const fs = require("fs")

//var data = fs.readdirSync("/etc")

function fTest(err,data){
    console.log("This is printed beginning fTest")
    console.log(data)
    console.log("This is printed ending  fTest")
}

fs.readdir("/etc",fTest)

//console.log("data",data)

console.log("THIS COME FIRST")