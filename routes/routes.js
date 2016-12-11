var express = require("express");
var router = express.Router();
const url = require('url');
const ImagesClient = require('google-images');
var client = new ImagesClient(process.env.CSE_ID, process.env.API_KEY);
var mongo = require("mongodb").MongoClient;
var mongoURL = process.env.MONGOLAB_URI;


var coreLoc = __dirname.substr(0,__dirname.length-7);

router.get("/",(req,res)=>{
    res.sendFile("index.html",{root: coreLoc+"/html/" });
});

router.get("/api/images/:input",(req,res)=>{
   var input = req.params.input;
   var parsedUrl = url.parse(req.originalUrl);
   var po=1;
   if(parsedUrl.query)
      {
        po=+parsedUrl.query.split("=")[1];
      }
      
 
    mongo.connect(mongoURL, function (err, db) 
      {
        if (err) { throw err; }
        var col = db.collection("history");
        var list = [];
        col.findOne({ name:"history" },(err,doc)=>{
           if(err){ throw err; }
           list= doc.list;
           list.push({ term:input , when:new Date().toDateString() });
           if(list.length>10){ list.pop(); }
           col.update({ name:"history" },{ $set:{ list:list }});
           db.close();
        });
      });
      
    client.search(input,{ page:po })
    .then(function (images) { 
        res.send(images);
    });
});

router.get("/api/latest/imagesearch",(req,res)=>{
    
    mongo.connect(mongoURL, function (err, db) 
      {
        if (err) { throw err; }
        var col = db.collection("history");
        col.findOne({ name:"history" },(err,doc)=>{
           if(err){ throw err; }
           res.send(doc.list);
        });
      });
});

router.get("/google0f39479055b2baa6.html", (req, res) => {
    res.sendFile("google0f39479055b2baa6.html",{root: coreLoc + '/ref/'});
});

router.use("/css",express.static(coreLoc+"/css"));


module.exports = router;
