const passport = require('passport');
const { ExtractJwt } = require("passport-jwt");
const JwtStrategy = require("passport-jwt").Strategy;
const config = require('./config');

module.exports = function(passport) {
    const opts = {
        secretOrKey: config.auth.secret_key,
        jwtFromRequest: ExtractJwt.fromHeader('X-Auth-Token')
    };
    passport.use(new JwtStrategy(opts, async (payload, done) => {
        try{
            next(null, "fd");
        }catch(error){
            next(error, false)
        }
    }));
};
