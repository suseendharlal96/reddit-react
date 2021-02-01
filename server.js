const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const userRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const subsRoute = require("./routes/subs");

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    // credentials: true,
    origin: "https://reddit-react.vercel.app",
    // origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);
app.use(cookieParser());

app.use(express.static("public"));

app.use("/api/auth", userRoute);
app.use("/api/post", postRoute);
app.use("/api/subs", subsRoute);

mongoose
  .connect(process.env.MONGOOSE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(process.env.PORT, () => {
      console.log(`running on ${process.env.PORT}`);
    })
  )
  .catch((err) => {
    console.log(err);
  });
