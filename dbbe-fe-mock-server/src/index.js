const express = require('express');
const path = require('path');
const StompServer = require('stomp-broker-js');

const helpers = require('./helpers/mock-api');
const constants = require('./constants/index');
const clientApi = require('./routes/client-api');

const app = express();
const port = 3000;

app.use(express.json());

/* Serve Frontend Assets */
app.use(express.static(path.join(process.cwd(), constants.PATHS.VIEWS)));

/* Serve Frontend View */
app.get('/', function(req, res) {
	const index = path.join(
		process.cwd(),
		constants.PATHS.VIEWS,
		constants.INDEX_VIEW,
	);
	res.sendFile(index);
});

/* Serve Frontend Client APIs */
app.use('/client', clientApi);

/* Serve Mock Services */
app.all('*', async (req, res) => {
	try {
		const response = await helpers.getMockResponse(req.url, req.method);
		res.status(response.status);
		res.json(response.data);
	} catch (e) {
		console.log(e);
		res.status(e.code || 999);
		res.send(e.message);
	}
});

const server = app.listen(port, () => console.log(`Mock Server App listening at http://localhost:${port}`));

/* Fx Stream Server */
const stompServer = new StompServer({
  server,
  debug: console.log,
  path: '/fxserver/fxstream',
  protocol: 'sockjs',
  heartbeat: [2000, 2000]
});

stompServer.subscribe('/quotes/login', (msg, headers) => {
  const message = JSON.parse(msg);
  const loginOk = JSON.stringify({ action: 'login', rc: 0 });
  stompServer.send(`/topic/${message.token}`, headers, loginOk);
});

stompServer.subscribe('/quotes/start', publishRate);
stompServer.subscribe('/quotes/stop', stopRate);
stompServer.subscribe('/quotes/update', publishRate);

let intervalTimeout;
function publishRate(msg, headers) {
  clearInterval(intervalTimeout);
  intervalTimeout = setInterval(() => {
    const message = JSON.parse(msg);
    const rate = (1 + Math.random()).toFixed(5);
    const quote = {
      ...message.quote,
      ccyConvention: `${message.quote.fromCcy}/${message.quote.toCcy}`,
      counterAmount: message.quote.amount * rate,
      rate,
      trend: Math.floor(Math.random() * 3) - 1
    };
    const liveRate = JSON.stringify({ rc: 0, quote });
    stompServer.send(`/topic/${message.token}/quotes`, headers, liveRate);
  }, 5000);
}

function stopRate() {
  clearInterval(intervalTimeout);
}