
const server = require('./src/app.js');
require('dotenv').config();
const { PORT } = process.env;


server.listen(PORT, async () => {
	console.log('%s listening at 3001'); // eslint-disable-line no-console
});
