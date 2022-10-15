require('dotenv').config();
const config = require('../config/index');
const fetch = require('node-fetch');
const {App, LogLevel} = require('@slack/bolt');
// const app = new App({
//   token: process.env.SLACK_TOKEN,
//   signingSecret: process.env.SLACK_SECRET,
//   // LogLevel can be imported and used to make debugging simpler
//   logLevel: LogLevel.DEBUG
// });

const SendMessage = async (channel, message) => {
  try {
    console.log(config.slack_token, 'slack token info');
    const body = {
      channel: channel,
      text: config.node_environment !== 'development' && config.node_environment !== 'staging' ? `@channel` : `[${config.node_environment}] \n @channel`,
      blocks: message,
    };
    const result = await fetch(`https://slack.com/api/chat.postMessage`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${config.slack_token}`}
    });
    const res = await result.json();
    console.log(res,"response from slack")
    return res;
  } catch (error) {
    console.log(error);
    return false;
  }
};
module.exports = SendMessage;
