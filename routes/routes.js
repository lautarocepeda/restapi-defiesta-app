const express           = require('express');
const router            = express.Router();

const UserController    = require('../controllers/user.controller');

const passport      	= require('passport');



require('./../middleware/passport')(passport);



// default page
router.get('/', (req, res, next) => {
    res.json( { status: 'success', message: 'Pending API', data: { 'version': 'v1.0.0'} } );
});




// create user with normal account
router.post(    '/users',                   UserController.validate('createUser'),                      UserController.create);




// create, login user with facebook
router.post(    '/auth/facebook',     passport.authenticate('facebook-token', {session:false}),   UserController.oauthGet);





// Retrieve a user
router.get(     '/users',                   passport.authenticate('jwt', {session:false}),              UserController.get);

// update user
router.put(     '/users',                   passport.authenticate('jwt', {session:false}),              UserController.update);

// delete user
router.delete(  '/users',                   passport.authenticate('jwt', {session:false}),              UserController.remove);

// login user
router.post(    '/users/login',             UserController.login);




module.exports = router;