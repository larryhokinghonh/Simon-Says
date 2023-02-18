import express from "express";
import {getData, getUserData, insertData} from "./database.js";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("game"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.render("index");
}); // User is directed to the main page

app.post("/", async function(req, res) {
    const name = req.body.userName;
    const score = req.body.userScore;
    const result = await insertData(name, score);
    console.log(result);
    if (result === 1) {
        res.render("submitSuccess");
    } else {
        res.status(500).send("Something broke!");
    }
}); // User can upload their score onto MySQL database

app.get("/leaderboards", async function(req, res) {
    const data = await getData();
    res.render("leaderboard", {data});
}); // User can see the live leaderboards

app.post("/leaderboards", async function(req, res) {
    const name = req.body.userName;
    const data = await getUserData(name);
    res.render("searchUser", {data});
}); // User can check their friend's scores

app.get("/tutorial", async function(req, res) {
    res.render("howToPlay");
}); // User can watch the tutorial video

app.use( function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

const port = 8080;
app.listen(port, function(req, res) {
    console.log(`Server is running on port ${port}.`);
});