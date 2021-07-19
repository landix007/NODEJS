var fs = require("fs")

var dataFile = {
    name: "Alex",
    height: 167,
    occupancy: "Private Sector"
}

fs.writeFile("./outputfile.json","["+JSON.stringify(dataFile)+",\n",(err,data) => {
  
})

fs.appendFile("./outputfile.json",JSON.stringify(dataFile)+"]",(err,data) => {})