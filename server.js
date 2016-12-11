var express = require("express");
var app = express();
var port = process.env.PORT || 8080;

var routes = require("./routes/routes.js");


var searchVal = "tester";

app.use("/",routes);


app.listen(port,(err,data)=>{
    if(err){ throw err; }
    console.log("Server running on port:"+port);
})