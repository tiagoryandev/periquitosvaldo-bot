const colors = require("colors");

module.exports = async (client, guild) => {
	console.log(colors.yellow(`[JOIN-GUILD] - Fui adicionado no Servidor [ ${guild.name} / ${guild.id} ];`));
};