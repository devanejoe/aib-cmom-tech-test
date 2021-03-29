const utils = require('./utils');

const saveEndpointPreference = async (path, params) => {
	const data = await utils.readFile(path);

	/* empty db.json */
	if (!data) {
		await utils.writeFile(path, {
			[params.endpointId]: {
				[params.method]: params.status
			},
		});

		return;
	}

	const savedPreferences = JSON.parse(data);

	/* check if endpoint already has preference stored */
	if (savedPreferences[params.endpointId]) {
		savedPreferences[params.endpointId][params.method] = params.status;
	} else {
		savedPreferences[params.endpointId] = {
			[params.method]: params.status
		};
	}

	await utils.writeFile(path, savedPreferences);
};

const createEndpointsList = async (endpointsPath, dbPath) => {
	const endpointsData = await utils.readFile(endpointsPath);
	const savedPreferenceData = await utils.readFile(dbPath);

	const savedPreferences = savedPreferenceData ? JSON.parse(savedPreferenceData) : {};

	const endpoints = JSON.parse(endpointsData).endpoints;

	return endpoints.map(endpoint => ({
		title: endpoint.title,
		id: endpoint.id,
		availableOptions: endpoint.methods,
		savedPreferences: savedPreferences[endpoint.id] ? savedPreferences[endpoint.id] : {}
	}));
};

const createServicesList = servicesConfig => {
	const services = [];

	Object.keys(servicesConfig).forEach(elem => {
    services.push({
        title: servicesConfig[elem].title,
        id: servicesConfig[elem].id,
    });
	});

	return services;
};

module.exports = {
	createServicesList,
	createEndpointsList,
	saveEndpointPreference,
};