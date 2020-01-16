const { to, ReE, ReS }              = require('../services/util.service');
// express validator
const { check, validationResult }   = require('express-validator');
const { User }                      = require('../models');
const authService                   = require('../services/auth.service');




const validate = (method) => {
    switch (method) {
        case 'createUser': {
            return [
                check('name', 'Nombre es requerido.').trim().isLength({ min: 1, max: 15 }).escape(),
                check('email', 'Por favor, ingresa un correo válido.').trim().isEmail().normalizeEmail(),
                check('password', 'Por favor, ingresa una contraseña.').isLength({ min: 7, max: 30})
                //check('phone', 'Please enter an valid phone number.').trim().isInt()
            ];
        }
    }
}

module.exports.validate = validate;



const create = async (req, res) => {
    
    // user data
    const body = req.body;
    
    // find validation errors in this request
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return ReE(res, errors.array()); 
    } else {
        let err, user;

        [err, user] = await to(authService.createUser(body));


        if (err) return ReE(res, err, 422);

        // successfully user created
        return ReS(res, { user: user.toWeb(), token: user.getJWT() }, 201);
    }
}

module.exports.create = create;



const get = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const user = req.user;

    return ReS(res, { User: user.toWeb() });
}

module.exports.get = get;




const update = async (req, res) => {
    let user = req.user;
    const data = req.body;
    user.set(data);

    [err, user] = await to(user.save());

    if (err) {
        if (err.message == 'Validation error') err = 'El correo ingresado ya se encuentra registrado.';

        return ReE(res, err);
    }

    return ReS(res, { message: 'Usuario actualizado correctamente.' });
}

module.exports.update = update;



const remove = async (req, res) => {
    let user = req.user;

    [err, user] = await to(user.destroy());

    if (err) return ReE(res, err.message);

    return ReS(res, { message: 'Usuario eliminado correctamente.' });
}

module.exports.remove = remove;



const login = async (req, res) => {
    const body = req.body;

    [err, user] = await to(authService.authUser(body));

    if (err) return ReE(res, err, 422);

    return ReS(res, { ...user.toWeb(), token: user.getJWT() });
}

module.exports.login = login;