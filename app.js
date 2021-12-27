const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();


app.use(bodyParser.urlencoded({extended: true}));


app.use(express.static("public"));


app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

mailchimp.setConfig({
    apiKey: "89d688102a400a6a9fba734b2a7ee426-us20",
    server: "us20",
  });

app.post("/",function(req,res){
    var FNAME = req.body.fName;   
    var LNAME = req.body.lName;    
    var email = req.body.email;    
    var listId = "167f05f2ba";
 
    var subscribingUser = {
      firstName: FNAME,
      lastName: LNAME,
      email: email
    };
 
    async function run() {
        try{
      var response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      })
      res.sendFile(__dirname+"/success.html")
    }
    catch(e){
        res.sendFile(__dirname+"/failure.html");
    }
    }
     run();
     console.log(FNAME);
});


app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000.");
});