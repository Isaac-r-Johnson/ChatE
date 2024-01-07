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
        messages: [{sender: String, message: String}], 
        contactId: Number}],
    contactId: Number
});
const User = new mongoose.model('User', userSchema);


// Functions
const GetTimeStamp = () => {
    const date = new Date();
    const month = date.getMonth()+1;
    const day = date.getDate()+1
    const year = date.getFullYear();
    const hour = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();
    return month + '/' + day + '/' + year + '@' + hour + ':' + min + ':' + sec
}


const FormatContactInfo = (contact) => {
    return {
        name: contact.name,
        profilePicture: contact.profilePicture,
    }
}

const RemoveAccountFromArray = (account) => {
    currentMessageThreads.forEach(thread => {
        if (thread.account == account){
            delete currentMessageThreads[currentMessageThreads.indexOf(thread)];
        }
    });
}

// Variables
var currentMessageThreads = [];


// Get Requests
app.get("/create-user", (req, res) => {
    
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
    User.countDocuments().then(count => {
        User.insertMany([{
            name: req.body.usrn,
            password: req.body.pass,
            profilePicture: "None",
            contacts: [],
            contactId: count
        }])
    }).then(res.send("OK"));
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
        res.send(formattedContactInfo);
    });
});

app.post('/selectcontactinfo', (req, res) => {
    console.log("Selected " + req.body.contact);
    User.findOne({name: req.body.account})
    .then(user => {
        user.contacts.forEach(contact => {
            if (contact.name === req.body.contact){
                RemoveAccountFromArray(req.body.account)
                currentMessageThreads.push({account: req.body.account, contact: contact.name, messages: contact.messages});
                res.send("-OK-");
            }
        });
    })
    .catch(e => {console.log(e); res.send("-NO-")});
});

app.post('/messagethread', (req, res) => {
    var found = false;
    currentMessageThreads.forEach(thread => {
        if (thread.account === req.body.account){
            found = true;
            res.send(thread);
        }
    });
});

app.post("/send-message", async (req, res) => { //< Mark callback as async
    try{
        const sender = req.body.sender;
        const recv = req.body.recv;
        const message = req.body.msg
        // Add message to sender
        const userSender = await User.findOneAndUpdate({ //< use await pattern
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
        const userReceiver = await User.findOneAndUpdate({ //< use await pattern
            name: recv,
            'contacts.name': sender
        },{
            $push:{
                'contacts.$.messages': { sender: "them", message: message }
            }
        }, {new: true});
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


app.listen(process.env.PORT, () => {
    console.log("ChatE server is running on port " + process.env.PORT + "...");
})

