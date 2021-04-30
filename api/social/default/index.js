const jimp = require("jimp");
const Discord = require("discord.js");
const emojis = require("../../../json/emojis.json");

module.exports = async (message, options) => {
	message.channel.startTyping();

	let avatar = await jimp.read(options.avatarURL);
	let background = await jimp.read(options.background);
	let model = await jimp.read("./api/social/default/assets/images/profilemodel.png");
	let mascara = await jimp.read("./api/social/default/assets/images/mascara.png");

	let font70 = await jimp.loadFont("./api/social/default/assets/font/benasneue_70.fnt");
	let font36 = await jimp.loadFont("./api/social/default/assets/font/benasneue_36.fnt");
	let font36_2 = await jimp.loadFont("./api/social/default/assets/font/benasneue_36_2.fnt");
	let font20 = await jimp.loadFont("./api/social/default/assets/font/benasneue_20.fnt");

	avatar.resize(145.50, 145.50);
	mascara.resize(145.50, 145.50);
	background.resize(700, 500);
	model.resize(700, 500);

	avatar.mask(mascara);
	model.composite(avatar, 16.50, 15.50);

	model.print(font70, 178, 9, options.username);
	model.print(font36, 268, 91, options.money);
	model.print(font36_2, 279, 129, options.marry);
	model.print(font20, 9, 405, options.aboutme, 690);

	background.composite(model, 0, 0);
	background.getBuffer(jimp.MIME_PNG, (err, buffer) => {
    	if (err) {
    		message.channel.stopTyping(true);

    		return message.channel.send(`${emojis.PeriquitoDead} **|** ${message.author}, infelizmente não foi possivel criar o perfil! Notifique os meus desenvolvedores sobre o ocorrido.`);
    	} else {
    		message.channel.stopTyping(true);
    		return message.channel.send(`${emojis.PeriquitoStar} **|** ${message.author}`, new Discord.MessageAttachment(buffer, "ProfilePeriquitosvaldo.png"));
    	};
    });
};