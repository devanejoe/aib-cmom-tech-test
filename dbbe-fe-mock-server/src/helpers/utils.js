const fsPromises = require('fs').promises;

const readFile = (path) => fsPromises.readFile(path, 'utf8');
const writeFile = (path, payload) => fsPromises.writeFile(path, JSON.stringify(payload));

const newError = (message, code) => {
	const err = new Error(message);
	err.code = code;

	return err;
};

module.exports = {
	readFile,
	writeFile,
	newError,
};
