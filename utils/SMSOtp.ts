const accountSid = "ACcountSId";
const authToken = "Token";
// const client = require("twilio")
import twilio from "twilio";
const client: any = twilio(accountSid, authToken);

export default async function (message: any, to: any) {
  client.messages
    .create({ body: message, from: "+12563641871", to })
    .then((message: any) => console.log(message.sid));
}
