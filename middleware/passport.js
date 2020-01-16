const { ExtractJwt, Strategy }      = require('passport-jwt');
const { User }                      = require('../models');
const CONFIG                        = require('../config/config');
const { to }                        = require('../services/util.service');

module.exports = (passport) => {
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = CONFIG.jwt_encryption;

    passport.use(new Strategy(opts, async (jwt_payload, done) => {
        let err, user;
        [err, user] = await to(User.findByPk(jwt_payload.user_id, { attributes: ['id', 'name', 'email', 'phone'] }));

        if (err) return done(err, false);

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
        
    }));
}