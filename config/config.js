// enviroment variables
require('dotenv').config();

// global to use all application
let CONFIG = {}


// server
CONFIG.app                  =  process.env.APP              || 'dev';
CONFIG.port                 =  process.env.PORT             || '3000';


// database
CONFIG.db_dialect           =  process.env.DB_DIALECT       || 'mysql';
CONFIG.db_host              =  process.env.DB_HOST          || 'localhost';
CONFIG.db_port              =  process.env.DB_PORT          || '3306';
CONFIG.db_name              =  process.env.DB_NAME          || 'test';
CONFIG.db_user              =  process.env.DB_USER          || 'root';
CONFIG.db_password          =  process.env.DB_PASSWORD      || '';


// json web token
CONFIG.jwt_encryption       =  process.env.JWT_ENCRYPTION   || '4Jkx89mKjeQl2xXMnX3xxD';
CONFIG.jwt_expiration       =  process.env.JWT_EXPIRATION   || '10000';


// facebook credentials
CONFIG.facebook_client      = process.env.FACEBOOK_CLIENT_ID
CONFIG.facebook_secret      = process.env.FACEBOOK_CLIENT_SECRET




module.exports = CONFIG;
