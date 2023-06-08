const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");
require('dotenv').config()
const PORT = process.env.PORT || 3000;


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mailchimp.setConfig({
    apiKey: process.env.API_KEY,
    server: process.env.SERVER_KEY,
});

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const listId = process.env.LIST_ID;

    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
    };
    async function run() {
        try {
            const response = await mailchimp.lists.addListMember(listId, {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName,
                }
              
            });
            console.log(
                `Successfully created an audience. The audience id is ${response.id}.`
              ); 
              res.sendFile(__dirname + "/success.html");
        } catch (e) {
            console.log(e);
            res.sendFile(__dirname + "/failure.html")
        }
     
        }
    run();
      
    });
    
app.post("/failure", function(req,res){
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function(){
    console.log("server is running at the port 3000");
});