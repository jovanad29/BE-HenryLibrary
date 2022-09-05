
const server = require('./src/app.js');
require('dotenv').config();
const { PORT } = process.env;


server.listen((PORT || 3001), async () => {
	console.log(`%s listening at ${PORT || 3001}`); // eslint-disable-line no-console
});
