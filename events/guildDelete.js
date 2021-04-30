const colors = require("colors");

module.exports = async (client, guild) => {
	console.log(colors.yellow(`[EXIT-GUILD] - Fui removido do Servidor [ ${guild.name} / ${guild.id} ];`));
};