module.exports = async (message, options) => {
	const model = require(`./${options.model}/index.js`);

	model(message, options);
};