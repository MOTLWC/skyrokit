const express = require("express");
const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const { render } = require("ejs");

const router = express.Router();

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs")
})

router.post("/sign-up", async (req,res) => {
    if (await User.findOne({username: req.body.username})){
        return res.send("Username is not unique");
    }

    if (req.body.password !== req.body.confirmPassword){
        return res.send("Passwords do not match");
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 12)
    const user = await User.create({username:req.body.username, password:hashedPassword});

    return res.send(`Hello ${user.username}, did you know we know your password now? :D`)
})

router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
})

router.post("/sign-in", async (req, res) => {
    const user = await User.findOne({username: req.body.username});
    if (!user){
        console.log("Incorrect username");
        return res.send("Login Failed");
    }

    if (!bcrypt.compareSync(req.body.password, user.password)){
        console.log("Password incorrect");
        return res.send("Login Failed");
    }

    req.session.user = {username : user.username}

    req.session.save(() => {res.redirect("/");});
})

router.get("/sign-out", (req, res) => {
    req.session.destroy(() => {res.redirect("/");});
})

module.exports = router;