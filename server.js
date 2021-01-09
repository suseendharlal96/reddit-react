const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoute = require("./routes/auth");
const trim = require("./middleware/trim");

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// app.use(trim);

// app.get("/", (req, res) => res.json({ message: "Hello" }));

app.use("/api/auth", userRoute);

mongoose
  .connect(
    "mongodb+srv://suseendhar:susee123@cluster0.iwva7.mongodb.net/reddit?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() =>
    app.listen(5000, () => {
      console.log("running on http://localhost:5000");
    })
  )
  .catch((err) => {
    console.log(err);
  });
