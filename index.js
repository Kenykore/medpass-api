require('dotenv').config();
const config = require('./config/index');
const app = require('./app');
const PORT = config.port;
const path = require('path');
const CachePugTemplates = require('cache-pug-templates');
const views = app.set('views', path.join(__dirname, 'emails'));
const mongoose = require('mongoose');
const databaseConfig = require('./config/index.js');

mongoose.connect(databaseConfig.database_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', (() => {
  console.log('connected to db');
}));
app.listen(PORT, (() => {
  const cache = new CachePugTemplates({app, views});
  cache.start();
  console.log(`${config.node_environment} server started, listening on port ${PORT}`);
}));
