
const port= process.env.PORT || 5100;
const path = require('path');
const CachePugTemplates = require('cache-pug-templates');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const cors = require('cors');
const nodemailer=require('nodemailer');
const app = express();

// 2.Express Configuration
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(methodOverride());
// var cors_options =
const allowedOrigins = ['http://localhost', 'http://localhost:8000', 'http://localhost:4200'];
app.use(cors({
  origin: function(origin, callback) {
    console.log(origin, 'origin');
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    console.log(origin);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }

    return callback(null, true);
  }
}));
const userAuthRouter = require('./api/v1/routes/users/authentication');
const docAuthRouter = require('./api/v1/routes/doctors/authentication');
const recordsRouter=require('./api/v1/routes/record');

app.use('/auth/doctor',docAuthRouter);
app.use('/auth/user', userAuthRouter);
app.use('/records', recordsRouter);
app.get('/', (req, res, next)=>{
  return res.send(`Your ip address is ${req.ip} and ${req.ips}`);
});
// notifications api
// end of notification api
app.set('view engine', 'pug');

module.exports=app;


// users api

