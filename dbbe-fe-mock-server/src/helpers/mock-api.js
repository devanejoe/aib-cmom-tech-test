const fsPromises = require('fs').promises;
const path = require('path');

const utils = require('./utils');
const constants = require('../constants/index');

const getMockResponse = async (url, method) => {
	const scPath = await getServiceConfigPath(url);

	const scAbsolutePath = path.join(
		process.cwd(),
		constants.PATHS.MOCKS,
		scPath
	);

	const serviceConfig = JSON.parse(await utils.readFile(scAbsolutePath));

	const regexp = /^\/([^\/]*)\/[^\d]*\d\/([^?]*)/;
	const [,serviceName,endpointName] = regexp.exec(url);
	const endpointId = getEndpointId(serviceConfig, endpointName);

	const endpointSavedPreference = await getEndpointSavedPreference(endpointId, method);

	const epPath = getEndpointConfigPath(serviceConfig, endpointName, method, endpointSavedPreference);

	const epAbsolutePath = path.join(
		process.cwd(),
		constants.PATHS.MOCKS,
		serviceName,
		epPath
	);

	const mockData = await utils.readFile(epAbsolutePath);

	return {
		data: JSON.parse(mockData),
		status: endpointSavedPreference,
	};
};

const getEndpointId = (serviceConfig, endpointName) => {
	const item = serviceConfig
		.endpoints
		.find(elem => elem.url === endpointName);

  if (!item) throw utils.newError(`No match found for endpoint: ${endpointName} \n
		The available urls are: \n` +
		`${serviceConfig.endpoints.map(elem => elem.url).join('\n')}`, 990);

	return item.id;
};

const getEndpointSavedPreference = async (endpointId, method) => {
	const content = await fsPromises.readFile(
		path.join(process.cwd(), constants.PATHS.SAVED_PREFERENCES),
		'utf8'
	);

	const data = content ? JSON.parse(content) : {};

	const DEFAULT_STATUS = 200;

	if (data && data[endpointId] && data[endpointId][method]) {
		return data[endpointId][method];
	}

	return DEFAULT_STATUS;
};

const getEndpointConfigPath = (serviceConfig, reqEndpoint, method, reqStatus) => {
	const endpoint = serviceConfig.endpoints.find(elem => elem.url === reqEndpoint);
	if (!endpoint) throw utils.newError(`Endpoint config unavailable for ${reqEndpoint}`, 991);

	const methodAvailable = Object.keys(endpoint.methods).includes(method);
	if (!methodAvailable) throw utils.newError(`HTTP method config unavailable for: ${method}`, 992);

	const status = endpoint.methods[method][reqStatus];

	if (!status) throw utils.newError(`HTTP status config unavailable for: ${reqStatus}`, 993);

	return status;
};

const getServiceConfigPath = async (url) => {
	const serviceConfigPath = path.join(
		process.cwd(), 
		constants.PATHS.SERVICE_CONFIG
	);

	const globalServiceConfig = JSON.parse(await utils.readFile(serviceConfigPath));
	const serviceConfig = globalServiceConfig[
		Object
			.keys(globalServiceConfig)
			.find(name => url.includes(name))
	];

	if (!serviceConfig) throw utils.newError(
		`Service config not present for this url: ${url} \n
		The available config keys are: \n
		`.replace(/^[\t ]+/gm, '') + (`${Object.keys(globalServiceConfig || {})}`).replace(/,/g, ',\n')
		, 994
);

  const servicePath = serviceConfig.url;
	return servicePath;
};

module.exports = {
	getMockResponse,
};