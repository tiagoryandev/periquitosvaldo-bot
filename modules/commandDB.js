const colors = require("colors");

module.exports = async (client, database) => {
	let caty = {
		"botlist": [],
		"config": [],
		"social": [],
		"utils": [],
		"dev": []
	};

	client.commands.map(cmd => {
		caty[cmd.category].push({
			name: cmd.name,
			description: cmd.description
		});
	});

	database.ref(`admin/commands/category`).once("value").then(async function (db) {
		if (db.val() == null) {
			database.ref(`admin/commands/category`).set(caty)
		} else {
			database.ref(`admin/commands/category`).remove();

			database.ref(`admin/commands/category`).set(caty)
		};
	});

	console.log(colors.yellow(`[DATABASE-COMMANDS] - Todos os comandos foram salvos no banco de dados com Sucesso!`));
};