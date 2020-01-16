'use strict';

const bcrypt        = require('bcrypt');
const bcrypt_p      = require('bcrypt-promise');
const jwt           = require('jsonwebtoken');
const { TE, to }    = require('../services/util.service');
const CONFIG        = require('../config/config');



module.exports = (sequelize, DataTypes) => {

    const Model = sequelize.define('User', {
        name: DataTypes.STRING,
        email: { type: DataTypes.STRING, allowNull: true, unique: true, validate: { isEmail: { msg: "Email invalid." } } },
        phone: { type: DataTypes.STRING, allowNull: true, validate: { len: { args: [7, 20], msg: "Phone number invalid, too short." }, isNumeric: { msg: "Not a valid phone number." } } },
        password: DataTypes.STRING
    });


    Model.beforeSave(async (user, options) => {
        let err;

        if (user.changed('password')) {
            let salt, hash;
            [err, salt] = await to(bcrypt.genSalt(10));
            if (err) TE(err.message, true);

            [err, hash] = await to(bcrypt.hash(user.password, salt));
            if (err) TE(err.message, true);

            user.password = hash;
        }
    });


    // compare form password with database hash password
    Model.prototype.comparePassword = async function (pw) {
        let err, pass
        if (!this.password) TE('Ingresa tu contraseña');

        [err, pass] = await to(bcrypt_p.compare(pw, this.password));
        if (err) TE(err);

        if (!pass) TE('Ups! Contraseña incorrecta. Vuelve a intentarlo');

        return this;
    }


    Model.prototype.getJWT = function () {
        let expiration_time = parseInt(CONFIG.jwt_expiration);
        return "Bearer " + jwt.sign({ user_id: this.id }, CONFIG.jwt_encryption, { expiresIn: expiration_time });
    };


    Model.prototype.toWeb = function () {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            phone: this.phone
        };
    };

    
    return Model;
}



