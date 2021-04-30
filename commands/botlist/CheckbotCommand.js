const Discord = require("discord.js");
const firebase = require("firebase");
const database = firebase.database();
const emojis = require("../../json/emojis.json");

module.exports = {
    name: "checkbot",
    description: "Comando para realizar a Verificação de uma Aplicação no sistema de BotList do seu Servidor.",
    category: "botlist",
    ClientPerm: ["EMBED_LINKS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_MESSAGES"],
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args, prefix) {
        database.ref(`admin/bot/botlist/${message.guild.id}/config`).once("value").then(async function (db) {
            if (db.val() == null || db.val().channellog == null || db.val().verificatorRole == null) {
                return message.channel.send(`${emojis.deny} **|** ${message.author}, não é possivel realizar a verificação pois o sistema de **BotList** não foi configurado nesse servidor!`);
            } else {
                let verificatorRole = message.guild.roles.cache.get(db.val().verificatorRole);
                let channellog = message.guild.channels.cache.get(db.val().channellog);

                if (!channellog) {
                    return message.channel.send(`${emojis.deny} **|** ${message.author}, o canal configurado para **Logs** no sistema da **BotList** não existe nesse servidor!`);
                };

                if (!verificatorRole) {
                    return message.channel.send(`${emojis.deny} **|** ${message.author}, o cargo de **Verificador** que está configurado no sistema de **BotList** não existe no servidor!`);
                };

                if (!message.member.roles.cache.has(verificatorRole.id)) {
                    return message.channel.send(`${emojis.deny} **|** ${message.author}, você não pode realizar a verificação pois você não possui o cargo de **Verificador** no servidor!`);
                };

                const embed_q1 = new Discord.MessageEmbed()
                    .setColor("BLUE")
                    .setDescription(`:robot: **|** **Mencione** ou use o **ID** da Aplicação que você deseja verificar:`)
                    .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }));

                message.channel.send(`${message.author}`, embed_q1).then(msg => {
                    const question_id = message.channel.createMessageCollector(x => x.author.id === message.author.id, { max: 1 })
                        .on("collect", async m => {
                            const m_content = m.content.split(" ");
                            m.delete();
                            msg.delete();

                            let mention = m.mentions.members.first() || await message.guild.members.fetch(m_content[0]).catch((error) => {
                                return message.channel.send(`${emojis.deny} **|** ${message.author}, a **Aplicação** que você forneceu não é um membro desse Servidor!`);
                            });

                            if (mention.user.bot === false) {
                                return message.channel.send(`${emojis.deny} **|** ${message.author}, o membro que mencionou não é um **Bot**! Mencione um Bot para realizar a verifcação!`);
                            };

                            const embed_q2 = new Discord.MessageEmbed()
                                .setColor("BLUE")
                                .setDescription(`:bust_in_silhouette: **|** **Mencione** ou use o **ID** do Dono da Aplicação que você deseja verifcar:`)
                                .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }));

                            message.channel.send(`${message.author}`, embed_q2).then(msg1 => {
                                const question_owner = message.channel.createMessageCollector(x => x.author.id === message.author.id, { max: 1 })
                                    .on("collect", async m1 => {
                                        const m1_content = m1.content.split(" ");
                                        m1.delete();
                                        msg1.delete();

                                        let mention_author = m1.mentions.members.first() || await message.guild.members.fetch(m1_content[0]).catch((error) => {
                                            return message.channel.send(`${emojis.deny} **|** ${message.author}, o **Dono** que você forneceu não é um membro desse Servidor!`);
                                        });

                                        const embed_q3 = new Discord.MessageEmbed()
                                            .setColor("BLUE")
                                            .setDescription(`:pencil: **|** Descreva o **Motivo** de sua verificação: ||**(max: 500)**||`)
                                            .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }));

                                        message.channel.send(`${message.author}`, embed_q3).then(msg2 => {
                                            const question_reason = message.channel.createMessageCollector(x => x.author.id === message.author.id, { max: 1 })
                                                .on("collect", m2 => {
                                                    const m2_content = m2.content;
                                                    m2.delete();
                                                    msg2.delete();

                                                    if (m2_content.length > 500) {
                                                        return message.channel.send(`${emojis.deny} **|** ${message.author}, a descrição do motivo passou do limite de **500 caracteres**!`)
                                                    };

                                                    const embed_q4 = new Discord.MessageEmbed()
                                                        .setColor("BLUE")
                                                        .setDescription(`:police_officer: **|** Chegou a hora final da sua Verificação, você deseja **Aprovar** ou **Reprovar** a Aplicação?` +
                                                            `\n\nAperte ${emojis.accept} para **Aprovar** e ${emojis.deny} para **Reprovar**.`)
                                                        .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }));

                                                    message.channel.send(`${message.author}`, embed_q4).then(c => {
                                                        c.react("812476509960011777").then(() => { });
                                                        c.react("812476509368877097").then(() => { });

                                                        const accept = (reaction, user) => reaction.emoji.id === "812476509960011777" && user.id === message.author.id;
                                                        const acceptCollect = c.createReactionCollector(accept)
                                                            .on("collect", r => {
                                                                c.delete();

                                                                if (db.val().botRole) {
                                                                    let rolebot = message.guild.roles.cache.get(db.val().botRole);

                                                                    if (message.guild.me.roles.highest.position > rolebot.position) {
                                                                        if (!mention.roles.cache.has(rolebot.id)) {
                                                                            mention.roles.add(rolebot.id);
                                                                        };
                                                                    };
                                                                };

                                                                if (db.val().devRole) {
                                                                    let roledev = message.guild.roles.cache.get(db.val().devRole);
                                                                    
                                                                    if (message.guild.me.roles.highest.position > roledev.position) {
                                                                        if (!mention.roles.cache.has(roledev.id)) {
                                                                            mention_author.roles.add(roledev.id);
                                                                        };
                                                                    };
                                                                };

                                                                const embed_log = new Discord.MessageEmbed()
                                                                    .setColor("GREEN")
                                                                    .setDescription(`${emojis.accept} **|** A Aplicação \`${mention.user.tag}\` foi **Aprovada** pelos Verificadores do Servidor!\n**Motivo**: ${m2_content}`)
                                                                    .setThumbnail(mention.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
                                                                    .setFooter(`• Verificador: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }));

                                                                channellog.send(`${mention_author}`, embed_log);

                                                                message.channel.send(`${emojis.accept} **|** ${message.author}, você finalizou sua Verificação com Sucesso!`);
                                                            });

                                                        const deny = (reaction, user) => reaction.emoji.id === "812476509368877097" && user.id === message.author.id;
                                                        const denyCollect = c.createReactionCollector(deny)
                                                            .on("collect", r => {
                                                                c.delete();

                                                                const embed_confirm = new Discord.MessageEmbed()
                                                                    .setColor("BLUE")
                                                                    .setDescription(`:shield: **|** Você quer que eu remova a Aplicação do Servidor?` +
                                                                        `\n\nAperte ${emojis.accept} para **Aceitar** e ${emojis.deny} para **Recusar**.`)
                                                                    .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }));

                                                                message.channel.send(`${message.author}`, embed_confirm).then(c1 => {
                                                                    c1.react("812476509960011777").then(() => { });
                                                                    c1.react("812476509368877097").then(() => { });

                                                                    const accept1 = (reaction, user) => reaction.emoji.id === "812476509960011777" && user.id === message.author.id;
                                                                    const accept1Collect = c1.createReactionCollector(accept1)
                                                                        .on("collect", r1 => {
                                                                            c1.delete();

                                                                            if (mention.kickable) {
                                                                                mention.kick({ reason: "Essa Aplicação foi reprovada e no meu sistema de BotList, e o verificador confirmou a expulsão." })
                                                                            };

                                                                            const embed_log = new Discord.MessageEmbed()
                                                                                .setColor("RED")
                                                                                .setDescription(`${emojis.deny} **|** A Aplicação \`${mention.user.tag}\` foi **Reprovada** pelos Verificadores do Servidor!\n**Motivo**: ${m2_content}`)
                                                                                .setThumbnail(mention.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
                                                                                .setFooter(`• Verificador: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }));

                                                                            channellog.send(`${mention_author}`, embed_log);

                                                                            message.channel.send(`${emojis.accept} **|** ${message.author}, você finalizou sua Verificação com Sucesso!`);
                                                                        });

                                                                    const deny1 = (reaction, user) => reaction.emoji.id === "812476509368877097" && user.id === message.author.id;
                                                                    const deny1Collect = c1.createReactionCollector(deny1)
                                                                        .on("collect", r1 => {
                                                                            c1.delete();

                                                                            const embed_log = new Discord.MessageEmbed()
                                                                                .setColor("RED")
                                                                                .setDescription(`${emojis.deny} **|** A Aplicação \`${mention.user.tag}\` foi **Reprovada** pelos Verificadores do Servidor!\n**Motivo**: ${m2_content}`)
                                                                                .setThumbnail(mention.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
                                                                                .setFooter(`• Verificador: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }));

                                                                            channellog.send(`${mention_author}`, embed_log);

                                                                            message.channel.send(`${emojis.accept} **|** ${message.author}, você finalizou sua Verificação com Sucesso!`);
                                                                        });
                                                                });
                                                            });
                                                    });
                                                });
                                        });
                                    });
                            });
                        });
                });
            };
        });
    },
};