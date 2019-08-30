const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

// We didn't export the user model directly from user.js file cause sometimes
// when we use mongoose in a testing environment like mocha, model files may be required
// multiple times and mongoose may get confused thinking that we are loading multiple
// models named users.
const User = mongoose.model("users");

// The user id (you provide as the second argument of the done function) is saved in the session
// and is later used to retrieve the whole object via the deserializeUser function.
// serializeUser determines which data of the user object should be stored in the session.
// The result of the serializeUser method is attached to the session as
// req.session.passport.user = {}. Here for instance, it would be (as we provide the user id as
// the key) req.session.passport.user = {id: 'xyz'}
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// The first argument of deserializeUser corresponds to the key of the user object that was
// given to the done function (see 1.). So your whole object is retrieved with help of that key.
// That key here is the user id (key can be any key of the user object i.e. name,email etc).
// In deserializeUser that key is matched with the in memory array / database or any data resource.
// The fetched object is attached to the request object as req.user
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleID: profile.id });

      if (existingUser) {
        done(null, existingUser);
      }

      const user = await new User({ googleID: profile.id }).save();
      done(null, user);
    }
  )
);
