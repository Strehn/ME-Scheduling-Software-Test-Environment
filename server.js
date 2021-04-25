const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const { join } = require("path");

//DB stuff
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");   //Temporary solution for the Control Allow Access - REMOVE IN PROD
const bodyParser = require("body-parser");

const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const authConfig = require("./src/auth_config.json");
const jwtAuthz = require("express-jwt-authz");

const billingcodes = require("./routes/api/billingcodes");
const machines = require("./routes/api/machines");
const reservations = require("./routes/api/reservations");


const appPort = process.env.SERVER_PORT || 3000;
const appOrigin = authConfig.appOrigin || `http://localhost:${appPort}`;

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
    { useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log("MongoDB Error"));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

app.use("/api/billingcodes", billingcodes);
app.use("/api/machines", machines);
app.use("/api/reservations", reservations);

const port = process.env.SERVER_PORT || 5000;

app.use(morgan("dev"));
app.use(helmet());

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ["RS256"]
});

const checkPermissions = jwtAuthz(["access:tools"], {
  customScopeKey: "permissions",
  checkAllScopes: true
});


app.get("/api/role", checkJwt, checkPermissions, (req, res) => {
  console.log("hello role");
});

//Serve static assets iff in production
if (process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static("build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
