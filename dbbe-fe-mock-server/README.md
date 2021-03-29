# AIB FE Mock Server

This project is a simple NodeJS server built using Express and provides a FE developer the ability to mock DBS services working locally.

## Setup

Execute below steps to start the mock server

```bash
# Install Dependencies
npm install
```

```bash
# Start server
npm start
```

## Description

At present, there isn't a way to mock DBS services on FE and a FE developer has to connect to actual DBS services via FE. This makes FE reliant on the DBS services to be available always.

In order to remove this reliance and potentially accelerate FE development, we can use this mock server. It acts as a layer between FE and DBS services and would mock all endpoints triggered from FE considering that they are **correctly** setup.

Read description of files from our mock server which explains how it works.

### src/mocks/service-config.json

Since we make use of multiple DBS services i.e Product Summary, Transactions, Users, Access Control etc, this file acts as an entry point for all service configurations. An object in this file contains configuration for the DBS service to be mocked.

```json
	"legalentity-presentation-service": {
		"title": "Legal Entity Presentation Service",
		"id": "legalentity-presentation-service",
		"url": "legalentity-presentation-service/api.json"
	}
```

The key `legalentity-presentation-service` in above JSON is **important**. It should match the name of the actual DBS service. For example, we use the following endpoint in our Admin portal:

`/legalentity-presentation-service/client-api/v2/legalentities`

The key inside the JSON **must match** the service name i.e name before `/client-api` in the URI.

### src/mocks/**/endpoints-config.json

Each DBS service/capability can serve more than one endpoint to FE. For example, a Products Presentation Service could serve endpoints such as `/productsummary` and `/arrangements`. These JSON files contain all endpoints configuration for a single service.

```json
{
	"name": "Users Service",
	"endpoints": [{
		"title": "User Identities",
		"id": "users-identites",
		"url": "users/identities",
		"methods": {
			"GET": {
				"200": "users-identities/GET/200.json",
				"400": "users-identities/GET/400.json",
				"403": "users-identities/GET/403.json"
			}
		}
	}]
}
```

The `endpoints` property is a list of all endpoints we are mocking of that service. The property `"url": "users/identities"` in above JSON is **important**. The URL value **must match** the name of the endpoint itself. For example, we use the following endpoint in our Admin portal:

`/user-presentation-service/client-api/v2/users/identities`

The key inside the JSON **must match** the endpoint name i.e name after `/client-api` in the URI.

### src/mocks/**/*.json

The actual mock response for each endpoint resides in these JSON files. Since there are endpoints which might serve multiple HTTP Methods such as GET & POST, we have categorised the directories such. And since an endpoint can potentially serve multiple HTTP Statuses such as 200, 401, 403, 404 etc, we should have separate JSON files for each status.

Thus, `/legalentities` endpoint which is used only for GET requests but can return 200, 400 or 403 has three separate JSON mock responses.

```
- mocks
	- legalentity-presentation-service
		- legal-entities
			- GET
				- 200.json
				- 400.json
				- 403.json
```

## Force an endpoint to return different status

Consider the situation during development work when a developer has finished the task for building happy path scenarios using GET 200 mock response. But, the error scenarios dev effort still remains.

We need the endpoint to now return us a 400 or 403 from GET request. We make use of a simple UI available inside the mock server available at base URL i.e `http://localhost:3000/` if you are running the app on port 3000. The UI is a bare minimum which allows a developer to force an endpoint to serve different HTTP status.
