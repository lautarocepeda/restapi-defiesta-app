
const express       = require('express');
const logger        = require('morgan');
const bodyParser    = require('body-parser');
const passport      = require('passport');
const pe            = require('parse-error');
const cors          = require('cors');


const CONFIG  = require('./config/config');

const routers = require('./routes/routes');
const app     = express();
const port    = CONFIG.port;


// logger morgan
app.use(logger('dev'));

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse requests of content-type: application/json
app.use(bodyParser.json());


// passport
app.use(passport.initialize());


// database
const models = require('./models');

models.sequelize.authenticate().then(() => {
    console.log('Connected to SQL database:', CONFIG.db_name);
}).catch( (err) => {
    console.error('Unable to connect to SQL database:', CONFIG.db_name);
});

if (CONFIG.app === 'dev') {
    models.sequelize.sync();
}

// cors
app.use(cors());

app.use('/v1', routers);

app.use('/', (req, res) => {
    res.statusCode = 200;
    res.json({ status: 'success', message: 'Pending API', data: {} });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});



app.listen(port, () => {
    console.log("API REST on port", port)
});


module.exports = app;