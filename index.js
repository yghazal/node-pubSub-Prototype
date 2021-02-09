const express = require('express');
const {serveIndex, publishMessage, getMessages} = require('./server/serveIndex')
const port = 8080;

const app = express();

main();

async function main() {
	app.use('./assets', express.static('assets'));

	app.set('views', './views');
	app.set('view engine', 'pug');

	app.get('/', serveIndex);
	app.post('/publishMessage', publishMessage);
	app.get('/getMessages', getMessages);

	app.listen(port, () => {
		console.log(`Server started on port ${port}`);
	})
}


