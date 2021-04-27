const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
// const User = mongoose.model("users");
const keys = require("../config/keys");

const Auth0Strategy = require("passport-auth0");
const authConfig = require("../src/auth_config.json");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey; //This is where passport reaches out to the database

const strategy = new Auth0Strategy(
  {
    domain: authConfig.domain,
    clientID: authConfig.clientId,
    clientSecret: authConfig.clientSecret,
    callbackURL: `https://${authConfig.appOrigin}/callback`
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    /**
     * Access tokens are used to authorize users to an API
     * (resource server)
     * accessToken is the token to call the Auth0 API
     * or a secured third-party API
     * extraParams.id_token has the JSON Web Token
     * profile has all the information from the user
     */
    return done(null, profile);
  }
);


module.exports = passport => {
  // passport.use(
  //   new JwtStrategy(opts, (jwt_payload, done) => {
  //     User.findById(jwt_payload.id)
  //       .then(user => {
  //         if (user) {
  //           return done(null, user);
  //         }
  //         return done(null, false);
  //       })
  //       .catch(err => console.log(err));
  //   })
  // );
  passport.use(strategy);
};
