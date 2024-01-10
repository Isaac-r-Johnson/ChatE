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
const FormatContactInfo = (contact) => {
    return {
        name: contact.name,
        profilePicture: contact.profilePicture,
    }
}


// Get Requests
app.get("/resetconvo", (req, res) => {
    User.insertMany(
        [
            {
                name: "Isaac Johnson",
                password: "1021mki",
                profilePicture: "https://res.cloudinary.com/dqaxkucbu/image/upload/v1703376775/ChatE/Lower_Quality_iahv5e.jpg",
                contacts: [
                    {
                        name: "Erica Johnson", 
                        profilePicture: "https://res.cloudinary.com/dqaxkucbu/image/upload/v1703388080/ChatE/JFAMFALL2023-23_dtx5jp.jpg", 
                        messages:[
                                {sender: "me", message: "Hey Mom!"}, 
                                {sender: "me", message: "How are you?"}, 
                                {sender: "them", message: "I'm doing well, son."}
                            ]
                    },
                    {
                        name: "Chad Johnson", 
                        profilePicture: "https://res.cloudinary.com/dqaxkucbu/image/upload/v1703549264/ChatE/PXL_20231018_184413521.PORTRAIT_tjd676.jpg", 
                        messages:[
                                {sender: "me", message: "Hey Father!"}, 
                                {sender: "me", message: "How are you?"}, 
                                {sender: "them", message: "I'm doing well bud."},
                                {sender: "them", message: "How about you?"},
                                {sender: "me", message: "I'm doing well, just tired."}
                        ]
                    }
                ]
            },
            {
                name: "Erica Johnson",
                password: "1010",
                profilePicture: "https://res.cloudinary.com/dqaxkucbu/image/upload/v1703388080/ChatE/JFAMFALL2023-23_dtx5jp.jpg",
                contacts: [
                    {
                        name: "Isaac Johnson", 
                        profilePicture: "https://res.cloudinary.com/dqaxkucbu/image/upload/v1703376775/ChatE/Lower_Quality_iahv5e.jpg", 
                        messages:[
                                {sender: "them", message: "Hey Mom!"}, 
                                {sender: "them", message: "How are you?"}, 
                                {sender: "me", message: "I'm doing well, son."}
                            ]
                    },
                    {
                        name: "Chad Johnson", 
                        profilePicture: "https://res.cloudinary.com/dqaxkucbu/image/upload/v1703549264/ChatE/PXL_20231018_184413521.PORTRAIT_tjd676.jpg", 
                        messages:[
                            {sender: "me", message: "Sub Bud!"}, 
                            {sender: "them", message: "Don't call me that!"}, 
                            {sender: "me", message: "Why?"},
                            {sender: "them", message: "Becuase I don't like it!"},
                            {sender: "them", message: "It makes me feel small!"}
                        ]
                    }
                ]     
            },
            {
                name: "Chad Johnson",
                password: "romans",
                profilePicture: "https://res.cloudinary.com/dqaxkucbu/image/upload/v1703549264/ChatE/PXL_20231018_184413521.PORTRAIT_tjd676.jpg",
                contacts: 
                [
                    {
                        name: "Isaac Johnson", 
                        profilePicture: "https://res.cloudinary.com/dqaxkucbu/image/upload/v1703376775/ChatE/Lower_Quality_iahv5e.jpg", 
                        messages:[
                            {sender: "them", message: "Hey Father!"}, 
                            {sender: "them", message: "How are you?"}, 
                            {sender: "me", message: "I'm doing well bud."},
                            {sender: "me", message: "How about you?"},
                            {sender: "them", message: "I'm doing well, just tired."}
                        ]
                    },
                    {
                        name: "Erica Johnson", 
                        profilePicture: "https://res.cloudinary.com/dqaxkucbu/image/upload/v1703388080/ChatE/JFAMFALL2023-23_dtx5jp.jpg", 
                        messages:[
                            {sender: "them", message: "Sub Bud!"}, 
                            {sender: "me", message: "Don't call me that!"}, 
                            {sender: "them", message: "Why?"},
                            {sender: "me", message: "Becuase I don't like it!"},
                            {sender: "me", message: "It makes me feel small!"}
                        ]
                    }
                ]   
            }
        ]).then(res.sendStatus(200));
});

app.get("/users", (req, res) => {
    User.find().then(users => {
        res.send(users);
    });
});

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
    User.find({name: req.body.account}).then(user => {
        user[0].contacts.forEach(contact => {
            formattedContactInfo.push(FormatContactInfo(contact))
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


app.listen(process.env.PORT, () => {
    console.log("ChatE server is running on port " + process.env.PORT + "...");
})

