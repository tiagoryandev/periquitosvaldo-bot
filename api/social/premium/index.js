const jimp = require("jimp");
const Discord = require("discord.js");
const emojis = require("../../../json/emojis.json");

module.exports = async (message, options) => {
	message.channel.startTyping();

	let model = await jimp.read("./api/social/premium/assets/images/profilemodel.png");
	let mascara = await jimp.read("./api/social/premium/assets/images/mascara.png");
    let avatar = await jimp.read(options.avatarURL);
    let background = await jimp.read(options.background);

    let font_benasneue_white_45 = await jimp.loadFont("./api/social/premium/assets/fonts/benasneue_white_45.fnt");
    let font_benasneue_yellow_20 = await jimp.loadFont("./api/social/premium/assets/fonts/benasneue_yellow_20.fnt");
    let font_benasneue_white_20 = await jimp.loadFont("./api/social/premium/assets/fonts/benasneue_white_20.fnt");
    let font_comicsansmc_white_20 = await jimp.loadFont("./api/social/premium/assets/fonts/comicsansms_white_20.fnt");

    background.resize(700, 500);
    avatar.resize(134, 134);
    mascara.resize(134, 134);
    avatar.mask(mascara);

    model.composite(avatar, 13, 13);
    model.print(font_benasneue_white_45, 160, 5, options.username);
    model.print(font_benasneue_yellow_20, 160, 50, `#${options.discriminator}`);
    model.print(font_benasneue_white_20, 216, 76, options.money);
    model.print(font_benasneue_white_20, 220, 99, options.marry);
    model.print(font_comicsansmc_white_20, 13, 405, options.aboutme, 678);
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