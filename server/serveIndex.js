
const {PubSub} = require('@google-cloud/pubsub');
const uuid = require('uuid');

const topicName = 'projects/forbes-sandbox-yasmeen-ghazal/topics/order_topic';
const timeout = 60;
const pubSubClient = new PubSub();
const allMsgs = [];
let messageCount = 0;

// generates unique ID to use in the subscription name
const uniqueId = uuid.v4();
const subscriptionName = `projects/forbes-sandbox-yasmeen-ghazal/subscriptions/notifications_sub_${uniqueId}`;


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
    }

    return res.send();
}

async function createSubscription() {
    // Creates a new subscription
    await pubSubClient.topic(topicName).createSubscription(subscriptionName).then(() => console.log(`Subscription ${subscriptionName} created.`));
    return subscriptionName;
}

function getMessages(req, res) {
    res.send(allMsgs);
}

function messageHandler(message) {
  console.log(`Received message ${message.id}:`);
  console.log(`\tData: ${message.data}`);
  console.log(`\tAttributes: ${message.attributes}`);
  messageCount += 1;
  allMsgs.push(`${message.data}`);
  message.ack();
};

async function serveIndex(req, res) {
    try {
        res.render('index');
    } catch (error) {
        res.status(500);
        res.send(JSON.stringify(error));
        console.error(error);
    }
}


function subscribeToNewSubscription(){
    createSubscription().then(() => {
        const subscriber = pubSubClient.subscription(subscriptionName);

        subscriber.on('error', (error) => console.error(error));
        subscriber.on('message', messageHandler);

        setTimeout(() => {
            subscriber.removeListener('message', messageHandler);
            console.log(`${messageCount} message(s) received.`);
        }, timeout * 1000);
    });
}
async function deleteSubscription() {
    try{
        // Deletes the subscription
        await pubSubClient.subscription(subscriptionName).delete();
        console.log(`Subscription ${subscriptionName} deleted.`);}
    catch(error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

module.exports = {serveIndex, publishMessage, getMessages, deleteSubscription, subscribeToNewSubscription};
