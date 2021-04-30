const Discord = require("discord.js");
const firebase = require("firebase");
const jimp = require("jimp");
const database = firebase.database();

module.exports = async (client, member) => {
    database.ref(`admin/bot/welcome/${member.guild.id}`).once("value").then(async function (db) {
        if (db.val() == null) {
            return;
        } else {
            if (!member.guild.members.cache.get(client.user.id).permissions.has(["ATTACH_FILES", "MANAGE_CHANNELS", "MANAGE_MESSAGES"])) {
                return;
            } else {
                if (db.val().image == null || db.val().image == false) {
                    if (db.val().channel) {
                        let channel = member.guild.channels.cache.get(db.val().channel);
                    
                        if (!channel) return;

                        if (db.val().content == null || db.val().content == "") return;

                        const placeholders = {
                            "{user}": `${member}`,
                            "{user.name}": `${member.user.username}`,
                            "{user.discriminator}": `${member.user.discriminator}`,
                            "{user.id}": `${member.user.discriminator}`,
                            "{user.tag}": `${member.user.tag}`,
                            "{guild.name}": `${member.guild.name}`,
                            "{guild.memberCount}": `${member.guild.memberCount}`
                        };
        
                        let contentMsg = db.val().content || "";
        
                        contentMsg = contentMsg.replace(/{\w.+}/g, function (holder) {
                            return placeholders[holder] || holder;
                        });
                    } else {
                        return;
                    };
                } else {
                    if (db.val().channel) {
                        let channel = member.guild.channels.cache.get(db.val().channel);
                    
                        if (!channel) return;

                        jimp.read(member.user.displayAvatarURL({ format: "png", size: 256 })).then(async avatar => {
                            let font100 = await jimp.loadFont("./assets/fonts/benas_neue_white_100/benasneue_white_100.fnt");
                            let font70 = await jimp.loadFont("./assets/fonts/benas_neue_yellow_70/benasneue_yellow_70.fnt");

                            let mascara = await jimp.read("./assets/images/mascara.png");
                            let model = await jimp.read("./assets/images/welcome.png");
                            let wallpaper = require("../json/wallpaper.json");
                            let selector = wallpaper.welcome[Math.floor(Math.random() * wallpaper.welcome.length)];
                            let background = await jimp.read(selector);

                            avatar.resize(250, 250);
                            mascara.resize(250, 250);

                            avatar.mask(mascara);
                            model.composite(avatar, 25, 25);
                        
                            model.print(font100, 286, 37, member.user.username);
                            model.print(font70, 295, 155, `#${member.user.discriminator}`);
    
                            background.composite(model, 0, 0);
                            background.getBuffer(jimp.MIME_PNG, (err, buffer) => {
                                const placeholders = {
                                    "{user}": `${member}`,
                                    "{user.name}": `${member.user.username}`,
                                    "{user.discriminator}": `${member.user.discriminator}`,
                                    "{user.id}": `${member.user.discriminator}`,
                                    "{user.tag}": `${member.user.tag}`,
                                    "{guild.name}": `${member.guild.name}`,
                                    "{guild.memberCount}": `${member.guild.memberCount}`
                                };
        
                                let contentMsg = db.val().content || "";
        
                                contentMsg = contentMsg.replace(/{\w.+}/g, function (holder) {
                                    return placeholders[holder] || holder;
                                });

                                channel.send(`${contentMsg}`, new Discord.MessageAttachment(buffer, "welcome.png"));
                            });
                        });
                    } else {
                        return;
                    };
                };
            };
        };
    });
};