require("dotenv").config();;
const express = require("express");

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require('express-session');
const MongoStore = require("connect-mongo");
const isSignedIn = require("./middleware/is-signed-in.js")

const authController = require("./controllers/auth.js");

const app = express();
const port = process.env.PORT;

app.set("view engine", "ejs")
app.use(express.urlencoded({extended : false}));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(session({secret: process.env.SECRET, resave: false, saveUninitialized: true, store: MongoStore.create({mongoUrl: process.env.MONGODB_URI})}));


async function connect() {
    try {
        console.log("TRYING")
        await mongoose.connect(process.env.MONGODB_URI);
        app.listen(port);
        console.log("CONNECTED");
    } catch (error) {
        console.log("FAILED")
        console.log(error);
    }
}

app.use("/auth", authController);

app.get("/vip-lounge", isSignedIn, (req, res) => {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  });

app.get("/", async (req, res) => {
    res.render("index.ejs", {user: req.session.user})
  });

connect();