const fetch = require('node-fetch');
require('dotenv').config();
const moment=require('moment');
const config = require('../config/index');
const crypto = require('crypto');
const request=require('request-promise');

// const SendSMS = async (to, msg,channel='dnd') => {
//     const options = {
//       method: 'POST',
//       uri: 'https://termii.com/api/sms/send',
//       body: {
//         'to': to,
//         'from': 'Comestibles',
//         'sms': msg,
//         'type': 'plain',
//         'api_key': process.env.TERMII_KEY,
//         'channel': channel
//       },
//       json: true // Automatically stringifies the body to JSON
//     };
//     let checkAuthorization =undefined;
//     try {
//       checkAuthorization= await request(options);
//       console.log(checkAuthorization, 'sms message');
//     } catch (error) {
//       console.log(error);
//     }
//   };
// const SendSMS = async (to=[], msg,channel='dnd') => {
//   console.log(to,"sms sending")
//   const options = {
//     method: 'POST',
//     uri: 'http://api.ebulksms.com:8080/sendsms.json',
//     body: {
//       "SMS": {
//         "auth": {
//             "username": "comestiblestech@gmail.com",
//             "apikey": "f068a74601e18a3a0f555183306cbc526ae85bea"
//         },
//         "message": {
//             "sender": "Comestibles",
//             "messagetext": msg,
//             "flash": "0"
//         },
//         "recipients":
//         {
//             "gsm": to?.map((x)=>{
//               return  {
//                 "msidn": x,
//                 "msgid": 'COMES' + crypto.randomBytes(4).toString('hex').toUpperCase(),
//             }
//             })
//         }
//     }
//     },
//     json: true // Automatically stringifies the body to JSON
//   };
//   let checkAuthorization =undefined;
//   try {
//     checkAuthorization= await request(options);
//     console.log(checkAuthorization, 'sms message');
//   } catch (error) {
//     console.log(error);
//   }
// };
const SendSMS = async (to=[], msg, channel=false, date=null, campaign='default_sms') => {
  console.log(to, 'sms sending');
  try {
    // if (config && config.node_environment!=='production' ) {
    //   return true;
    // }
    if (config.node_environment === 'development') {
      return true;
    }
    const response= await fetch('https://whispersms.xyz/api/send_message/', {
      method: 'post',
      body: JSON.stringify({
        'contacts': to,
        'sender_id': 'Comestibles',
        'message': msg,
        'send_date': date?date:moment().format('DD-MM-YYYY HH:mm'),
        'priority_route': channel,
        'campaign_name': campaign
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Api_key gAAAAABhlLme7LOTt3D-CChUe9OKHwjfWipAZ-l9KI3u5v6tqiyn-Usb75QvnnWECGw8x2JcpRomKp-lHGnieEGLqahV500KzEpmEoBIZthuROUsLCcKcFtrztVn9Sd-slr8NONXBT8lOeUb4dP2irEZBOQfDWPvJw=='
      },
    });
    const result=await response.json();
    console.log(result, 'sms sent');
  } catch (error) {
    console.log(error, 'error sending sms');
  }
};
module.exports = SendSMS;
