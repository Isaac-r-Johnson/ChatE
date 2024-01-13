require("dotenv").config();
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");


// App Setup
const app = express()
app.use(bodyParser.json({extended:true}));
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// DB Setup
mongoose.connect(process.env.DBCODE);
const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    profilePicture: String,
    contacts: [{name: String, 
        profilePicture: String, 
        messages: [{sender: String, message: String}]
        }],
});
const User = new mongoose.model('User', userSchema);

// Variables
var unreadMessages = []

// Functions
const formatContactInfo = (contact) => {
    return {
        name: contact.name,
        profilePicture: contact.profilePicture,
    }
}

//Post Requests
app.post("/login", (req, res) => {
    var loggedIn = false
    User.findOne({name: req.body.usrn})
    .then(user => {
        if (user.password === req.body.pass){
            loggedIn = true;
        }
        else{
            loggedIn = false;
        }
    })
    .then(() => {
        if (loggedIn){
            res.send("-YES-");
        }
        else{
            res.send("-NO-");
        }
    })
    .catch((e) => {
        console.log(e);
        res.send("-NO-");
    })
});

app.post("/signup", (req, res) => {
    User.insertMany([{
        name: req.body.usrn,
        password: req.body.pass,
        profilePicture: req.body.pic,
        contacts: [],
    }]).then(res.send("OK"));
});

app.post('/profilepic', (req, res) => {
    User.findOne({name: req.body.name}).then(user => {
        res.send(user.profilePicture);
    })
    .catch(e => {
        console.log("Error getting profile picture!");
    });
});

app.post("/getcontacts", (req, res) => {
    var formattedContactInfo = [];
    User.findOne({name: req.body.account}).then(user => {
        user.contacts.forEach(contact => {
            formattedContactInfo.push(formatContactInfo(contact))
        })
    }).then(() => {
        var unreadToSend = [];
        unreadMessages.forEach(msg => {
            if (msg.name === req.body.account){
                unreadToSend.push(msg.from);
            }
        });
        res.send({info: formattedContactInfo, unread: unreadToSend});
    });
});

app.post("/sendmessage", async (req, res) => { //< Mark callback as async
    try{
        const sender = req.body.sender;
        const recv = req.body.recv;
        const message = req.body.msg
        unreadMessages.push({name: recv, from: sender});
        // Add message to sender
        const userSender = await User.findOneAndUpdate({
            name: sender,
            'contacts.name': recv
        },{
            $push:{
                'contacts.$.messages': { sender: "me", message: message }    
            }
        }, {new: true});
        if(!userSender){ //< If no sender was found return error
            return res.status(400).json({
                message: 'Sender not found'
            })
        }
        // Add message to receiver
        const userReceiver = await User.findOneAndUpdate({
            name: recv,
            'contacts.name': sender
        },{
            $push:{
                'contacts.$.messages': { sender: "them", message: message }
            }
        },
        {new: true});
        if(!userReceiver){ //< If no receiver was found return error
            return res.status(400).json({
                message: 'Receiver not found'
            })
            // Handle deletion of object in sender
        }
        return res.status(201).json({
            message: 'Messages Saved!'
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Error on server.'
        })
    }
});

app.post("/getmessages", (req, res) => {
    var messagingUser = req.body.user;
    var requestedContact = req.body.contact;
    var unreadToSend = [];
    User.findOne({name: messagingUser}).then(user => {
        user.contacts.forEach(contact => {
            unreadMessages.forEach(msg => {
                if (msg.name === messagingUser){
                    unreadToSend.push(msg.from);
                }
            });
            if (contact.name == requestedContact){
                res.send({sender: messagingUser, contact: contact.name, messages: contact.messages, unread:unreadToSend});
            }
        })
    })
    .catch(e => {res.send("Error!"); console.log(e)});
});

app.post('/deleteunread', (req, res) => {
    unreadMessages.forEach((msg, i, l) => {
        if(msg.name == req.body.user && msg.from == req.body.contact){
            l.splice(i, 1);
        }
    });
    res.send("K");
});

app.post("/users", (req, res) => {
    User.find().then(users => {
        const userNames = []
        users.forEach(user => {
            if (user.name === req.body.usrn || req.body.contacts.includes(user.name)){}
            else{
                userNames.push({name: user.name, profilePicture: user.profilePicture});
            }
        });
        res.send(userNames);
    });
});

app.post("/addcontact", async (req, res) => {
    try{
        const adder = req.body.adder;
        const added = req.body.added;
        const thePersonToBeAdded1 = await User.findOne({name: added});
        const anAdder = await User.findOneAndUpdate({
             name: adder
         },{
             $push:{
                 contacts: { name: thePersonToBeAdded1.name, profilePicture: thePersonToBeAdded1.profilePicture, messages: []}   
             }
         }, {new: true});
        const thePersonToBeAdded2 = await User.findOne({name: adder});
        const anAdded = User.findOneAndUpdate({
            name: added
        },{
            $push:{
                contacts: { name: thePersonToBeAdded2.name, profilePicture: thePersonToBeAdded2.profilePicture, messages: []}   
            }
        }, {new: true})
        .then(() => {if (anAdded && anAdder) res.send("OK")});
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Error on server.'
        });
    }
});

app.listen(process.env.PORT, () => {
    console.log("ChatE server is running on port " + process.env.PORT + "...");
});

