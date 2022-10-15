require('dotenv').config({
  path: '../.env'
});
const development = require('./development');
const staging = require('./staging');
const local = require('./local');
const production = require('./production');
const test = require('./test');
let nodeConfigSetting = {};
const config = {
  email: {

  }
};

const environment = process.env.ENVIRONMENT;
console.log(environment, 'environment');
if (environment === 'development') {
  nodeConfigSetting = {...config, ...development,};
} else if (environment === 'staging') {
  nodeConfigSetting = {...config, ...staging};
} else if (environment === 'production') {
  nodeConfigSetting = {...config, ...production};
} else if (environment === 'local') {
  nodeConfigSetting = {...config, ...local};
} else if (environment === 'test') {
  nodeConfigSetting = {...config, ...test};
}
console.log('nodeConfigSetting', nodeConfigSetting);
module.exports = nodeConfigSetting;
