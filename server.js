// Package import 
var mongodb = require("mongoose")
var lodash = require("lodash")
var exp = require("express")
var bodyp = require("body-parser")
var fs = require("fs")


const { isObject } = require("util")
const { throws } = require("assert")

var appServer = exp()
var httpServer = require("http").Server(appServer)
var sio = require("socket.io")(httpServer)

// DB related config
var dbURL = "mongodb://nodejs:nodejs@127.0.0.1:27017/testDB"
var MsgModel = mongodb.model("mongomsg",{
    name: String,
    message: String,
    creationdate: Date
})

var broadCastMsg = [{name: "Akbar",message: "Hola"},
{name: "Putu",message: "Horas"}]

var arrBadWord = fs.readFileSync("./badwords.cfg").toString().toLowerCase().split("\n")

appServer.use(exp.static(__dirname))
appServer.use(bodyp.json())
appServer.use(bodyp.urlencoded({extended:true}))

appServer.get("/messages",(req,res) => {
    
    console.log("This is GET function")
    //res.send(broadCastMsg)

    // unsorted data from mongo db 
    // MsgModel.find({},(err,dataFromDB) => {
    //    res.send(dataFromDB)        
    //})
    
    // sorted data from mongo db 
    MsgModel.find({}).sort({creationdate:-1}).exec((err,dataFromDB) => {
        if (err){
            console.log("error when query data from mongo db:",err)
        }

        //console.log("data from DB:",dataFromDB)
        res.send(dataFromDB)   
    })
 })

appServer.post("/messages",async (req,res) => {
    
    //JSONWithDate = Object.create(req.body)
    //console.log("after added with datetime:",JSONWithDate)
    console.log("req body:",req.body)
       
    try {

        // Check for badwords
   
       if (isContainBadWords(req.body["message"])){
        throw new Error("Message inputted contain badword, not processed")
       }

        //throw new Error("Error on initialisation")
        // Save into mongo db
        //var JSONWithDate = JSON.parse(JSON.stringify(req.body))
        var JSONWithDate = lodash.clone(req.body)
        //console.log("req body after added time:",req.body)
        JSONWithDate["creationdate"] = new Date()
        var msgToMongo = new MsgModel(JSONWithDate)
        var savedToMongo = await msgToMongo.save()
        console.log("Saved to Mongo DB")    
        
        //broadCastMsg.push(req.body)
        sio.emit("messageFromBE",req.body)
        res.sendStatus(200)    
           
    } catch (error) {
        res.sendStatus(500)
        //return console.error(error)
        console.error(error)
    }
    finally{
        console.log("appServer.post called")
    }
   
})

sio.on("connection",(socketVar) => {
    console.log("user is connected")
})

// connect to mongo db
mongodb.connect(dbURL,
    {useUnifiedTopology: true,
        useNewUrlParser: true},
        (err) => {
    console.log("Mongo DB connection is failed with err:",err)
})

//var apps = appServer.listen(5000,() => {
var apps = httpServer.listen(5000,() => {
    console.log("++++ WEB Server started, linsting on port ",apps.address().port)
})


function isContainBadWords(strMsg){
    for (let index = 0; index < arrBadWord.length; index++) {
        if(strMsg.toLowerCase().indexOf(arrBadWord[index]) > 0){
            //console.log("contain badwords: ",arrBadWord[index])
            return true
            //throw new Error("Message inputted contain badword, not processed: "+arrBadWord[index])
        }
    }
    return false
}