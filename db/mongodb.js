require('dotenv').config();
const mongoose = require('mongoose');
const config=require('../config/index');
module.exports=async function connectDb() {
  try {
    console.log(config.database_url);
    const db_connected= await mongoose.connect(config?.database_url || 'mongodb+srv://comestibles:franceskorede@comestibles-one-xhy3v.mongodb.net/production?retryWrites=true&w=majority');
    console.log(db_connected.version, 'db connected');
    return db_connected;
  } catch (error) {
    console.log(error, 'error connection to db');
  }
};

