// To connect with your mongoDB database
const mongoose = require("mongoose");
const db = mongoose.createConnection(
  "mongodb+srv://dbUser:sma0l2PoInACsFJx@cluster0.ujmws.mongodb.net/SportAchievements?retryWrites=true&w=majority",
  {
    dbName: "SportAchievements",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) =>
    err ? console.log(err) : console.log("Connected to your DB-name database"),
);

// Schema for users of app
const challengeSchema = new mongoose.Schema({
  model: String,
  id: String,
  name: String,
  sp: Number,
  xp: Number,
  goal: Object,
  short_description: String,
  long_description: String,
});
const Challenge = db.model("Challenge", challengeSchema, "challenges");

const userSchema = new mongoose.Schema({
  id: Number,
  login: String,
  password: String,
  notifications: Object,
  Sp: Number,
  Xp: Number,
  certain_hours: Object,
  full_hours: Number,
  challenge: Object
});
const User = db.model("User", userSchema, "users");

// For backend and express
const express = require("express");
const app = express();
const cors = require("cors");
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {
  resp.send("App is Working");
});

app.get("/client/:userID", async (req, resp) => {
  try {
    const user = await User.findOne({ id: Number(req.params["userID"]) });
    resp.json(user);
  } catch (e) {
    resp.send("Something Went Wrong");
  }
});

app.get("/challenges", async (req, resp) => {
  try {
    const challenges = await Challenge.find({});
    resp.json(challenges);
  } catch (e) {
    resp.send("Something Went Wrong");
  }
});

app.post("/reward", async (req, resp) => {
    try {
        const user = await User.findOne({id: req.body.uID});
        const challenges = user.challenge;
        challenges[req.body.chID] = true;
        await User.updateOne({id: req.body.uID}, { $set: {challenge: challenges}, $inc: {sp: req.body.sp, xp: req.body.xp}});
        let result = await user.save();
        result = result.toObject();
        if (result) {
            console.log(result);
        } else {
            console.log("User already register");
        }
    } catch (e) {
        resp.send("Something Went Wrong");
    }
});

app.listen(5000);
