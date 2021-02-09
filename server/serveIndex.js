
const {PubSub} = require('@google-cloud/pubsub');

const subscriptionName = 'projects/forbes-sandbox-yasmeen-ghazal/subscriptions/notifications_sub';
const topicName = 'projects/forbes-sandbox-yasmeen-ghazal/topics/order_topic';
const timeout = 60;
const pubSubClient = new PubSub();
const allMsgs = [];

async function publishMessage(req, res) {
    res.set('Content-Type', 'application/json');
    const dataBuffer = Buffer.from(req.query.data);

    try {
        const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
        console.log(`Message ${messageId} published.`);
        res.status(200);
    } catch (error) {
        res.status(500);
        console.error(`Received error while publishing: ${error.message}`);
        process.exitCode = 1;
    }
}

function listenForMessages() {
  const subscription = pubSubClient.subscription(subscriptionName);

  let messageCount = 0;
  const messageHandler = message => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;
    allMsgs.push(`${message.data}`);
    message.ack();
  };

  subscription.on('message', messageHandler);

  setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    console.log(`${messageCount} message(s) received.`);
  }, timeout * 1000);

}

function getMessages(req, res) {
    res.send(allMsgs);
}

async function serveIndex(req, res) {
    try {
        listenForMessages();
        res.render('index');
    } catch (error) {
        res.status(500);
        res.send(JSON.stringify(error));
    }
}

module.exports = {serveIndex, publishMessage, getMessages};
