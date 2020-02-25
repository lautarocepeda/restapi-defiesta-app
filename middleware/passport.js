const { ExtractJwt }            = require('passport-jwt');
const { User }                  = require('../models');
const CONFIG                    = require('../config/config');
const { to }                    = require('../services/util.service');
const authService               = require('../services/auth.service');

const JWTStrategy               = require('passport-jwt').Strategy;
const FacebookTokenStrategy     = require('passport-facebook-token');


module.exports = (passport) => {
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = CONFIG.jwt_encryption;

    // jwt strategy
    passport.use(new JWTStrategy(opts, async (jwt_payload, done) => {
        let err, user;
        [err, user] = await to(User.findByPk(jwt_payload.user_id, { attributes: ['id', 'name', 'email', 'phone'] }));

        if (err) return done(err, false);

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }

    }));



    // facebook strategy
    passport.use(new FacebookTokenStrategy({
        clientID: CONFIG.facebook_client,
        clientSecret: CONFIG.facebook_secret
        //profileFields: ['id', 'displayName','email', 'photos', 'birthday'],
    }, 
    async (accessToken, refreshToken, profile, done) => {


        //TODO verificar el token que sea correcto. Error handler desde server.js o desde aca mismo.



        let err, user;

        [err, user] = await to(User.findOne({
            where: {
                oauth_uid: profile.id
            }
        }));

        // user not found
        if (!user) {
            const newUserObj = {
                oauth_provider: 'facebook',
                oauth_uid: profile._json.id,
                name: profile._json.name,
                email: profile._json.email || profile.emails[0].value,
                birthday: profile._json.birthday,
                password: '@@@@@@@---------@@@@@@@'
            };
            
            [err, user] = await to(User.create(newUserObj));
        }

        if (err) return done(err, false);
        if (user) return done(null, user);
        
    }));

}