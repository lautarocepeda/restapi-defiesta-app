const { User } = require('../models');
const validator = require('validator');
const { to, TE } = require('../services/util.service');



const createUser = async (userInfo) => {
    let auth_info, err;

    auth_info = {};
    auth_info.status = 'create';


    if (validator.isEmail(userInfo.email)) {
        auth_info.method = 'email';

        [err, user] = await to(User.create(userInfo));
        if (err) TE('El correo ingresado ya se encuentra registrado.');

        return user;

    } else {
        TE('No has ingresado un correo valido.');
    }
}

module.exports.createUser = createUser;



const authUser = async (userInfo) => {


    if (!userInfo.password) TE('Por favor, ingresa tu contraseña.');

    if (validator.isEmail(userInfo.email)) {
        [err, user] = await to(User.findOne({ where: { email: userInfo.email } }));
    } else {
        TE('No has ingresado un correo valido.');
    }

    if (!user) TE('El correo ingresado no se encuentra registrado.');

    [err, user] = await to(user.comparePassword(userInfo.password));

    if (err) TE(err.message);

    return user;
}

module.exports.authUser = authUser;