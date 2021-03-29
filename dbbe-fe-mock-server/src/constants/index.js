module.exports = {
	AVAILABLE_HTTP_STATUS: [200, 201, 204, 400, 401, 403, 404, 500, 501, 502, 503],
	AVAILABLE_HTTP_METHODS: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
	// Paths relative to root
	PATHS: {
		SAVED_PREFERENCES: 'src/db.json',
		SERVICE_CONFIG: 'src/mocks/service-config.json',
		MOCKS: 'src/mocks',
		VIEWS: 'src/public',
	},
	API_CONFIG: 'endpoints-config.json',
	INDEX_VIEW: 'index.html'
};