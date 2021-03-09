const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const { join } = require("path");

//DB stuff
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");   //Temporary solution for the Control Allow Access - REMOVE IN PROD
const bodyParser = require("body-parser");

const billingcodes = require("./routes/api/billingcodes");

const app = express();

app.use(cors());

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log("MongoDB Error"));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

app.use("/api/billingcodes", billingcodes);

const port = process.env.SERVER_PORT || 5000;

app.use(morgan("dev"));
app.use(helmet());
app.use(express.static(join(__dirname, "build")));

app.listen(port, () => console.log(`Server listening on port ${port}`));
