'use strict';

const bcrypt        = require('bcrypt');
const bcrypt_p      = require('bcrypt-promise');
const jwt           = require('jsonwebtoken');
const { TE, to }    = require('../services/util.service');
const CONFIG        = require('../config/config');


//TODO agregar authprovider y ouid providar - Social logins
module.exports = (sequelize, DataTypes) => {

    const Model = sequelize.define('User', {
        oauth_provider: { 
            type: DataTypes.ENUM('app', 'facebook'),
            allowNull: false,
            defaultValue: 'app'
        },
        oauth_uid: {
            type: DataTypes.STRING,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: "Email invalid."
                }
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: {
                    args: [7, 20],
                    msg: "Phone number invalid, too short."
                },
                isNumeric: {
                    msg: "Not a valid phone number."
                }
            }
        },
        birthday: {
            type: DataTypes.DATE,
            allowNull: true
        },
        encript_pw: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })


    Model.beforeSave(async (user, options) => {
        let err;

        if (user.changed('encript_pw')) {
            let salt, hash;
            [err, salt] = await to(bcrypt.genSalt(10));
            if (err) TE(err.message, true);

            [err, hash] = await to(bcrypt.hash(user.encript_pw, salt));
            if (err) TE(err.message, true);

            user.encript_pw = hash;
        }
    });


    // compare form password with database hash password
    Model.prototype.comparePassword = async function (pw) {
        let err, pass
        if (!this.encript_pw) TE('Ingresa tu contraseña');

        [err, pass] = await to(bcrypt_p.compare(pw, this.encript_pw));
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
            provider: this.oauth_provider,
            name: this.name,
            email: this.email,
            birthday: this.birthday,
            phone: this.phone,
        };
    };

    
    return Model;
}



