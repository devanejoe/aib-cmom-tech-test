const path = require('path');
const router = require('express').Router();

const helpers = require('../helpers/client-api');
const constants = require('../constants/index');
const utils = require('../helpers/utils');

const dbPath = path.join(process.cwd(), constants.PATHS.SAVED_PREFERENCES);

/* Send list of available mock services */
router.get('/services', async (req, res) => {
	const serviceConfigPath = path.join(
		process.cwd(), 
		constants.PATHS.SERVICE_CONFIG
	);
	const globalServiceConfig = JSON.parse(await utils.readFile(serviceConfigPath));

	const response = helpers.createServicesList(globalServiceConfig);
  res.json(response);
});

/* Retrieve list of available HTTP Status */
router.get('/available-options', (req, res) => {
	res.json({
		status: constants.AVAILABLE_HTTP_STATUS,
		method: constants.AVAILABLE_HTTP_METHODS,
	});
});

/* Send list of available endpoints and HTTP Methods of requested service */
router.get('/services/:id/endpoints', async (req, res) => {
	const endpointPath = path.join(
		process.cwd(),
		constants.PATHS.MOCKS,
		req.params.id,
		constants.API_CONFIG
	);
	const response = await helpers.createEndpointsList(endpointPath, dbPath);

	res.json(response);
});

/* Save endpoint preference */
router.put('/preferences', async (req, res) => {
	try {
		await helpers.saveEndpointPreference(dbPath, req.body);
		res.json({ successful: true });
	} catch (e) {
		console.log(e);
		res.json({ successful: false });
	}
});

/* Fallback for any incorrect client API requested */
router.get('*', (req, res) => {
	res.send('Incorrect client API requested');
});

module.exports = router;