const passport = require('passport');
const { ExtractJwt } = require("passport-jwt");
const JwtStrategy = require("passport-jwt").Strategy;
const config = require('./config');

module.exports = function(passport) {
    const opts = {
        secretOrKey: config.auth.token_key,
        jwtFromRequest: ExtractJwt.fromHeader('x-auth-token')
    };
    passport.use(new JwtStrategy(opts, async (payload, done) => {
        try{
            done(null, payload);
        }catch(error){
            done(error, false)
        }
    }));
};
