require("dotenv").config();
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");


// App Setup
const app = express()
app.use(bodyParser.json({extended:true}));
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin: '*'
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
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
        messages: {me: [{message: String, date: String}], them: [{message: String, date: String}]}, 
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

const getFormattedDate = (fullDate) => {
    firstSplitDate = fullDate.split("@");
    secondSplitDates = firstSplitDate[0].split("/");
    return secondSplitDates[0] + '/' + secondSplitDates[1];
}

const FormatContactInfo = (contact) => {
    return {
        name: contact.name,
        profilePicture: contact.profilePicture,
        date: getFormattedDate(contact.messages.me[contact.messages.me.length-1].date)
    }
}

const RemoveAccountFromArray = (account) => {
    currentMessageThreads.forEach(thread => {
        if (thread.account == account){
            console.log("Deleted thread accounts for " + thread.account);
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
        console.log('Sent contacts for ' + req.body.account);
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
                currentMessageThreads.push({account: req.body.account, messages: contact.messages});
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
            res.send(thread.messages);
        }
    });
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


app.listen(process.env.PORT, () => {
    console.log("ChatE server is running on port " + process.env.PORT + "...");
})

