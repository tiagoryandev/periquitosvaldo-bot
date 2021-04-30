const Discord = require("discord.js");
const firebase = require("firebase");
const database = firebase.database();
const emojis = require("../../json/emojis.json");
const moment = require('moment');
moment.locale('pt-BR');

module.exports = {
    name: "addbot",
    description: "Comando para enviar a sua aplicação para os Verificadores da BotList do seu Servidor. Responda com atenção as perguntas.",
    category: "botlist",
    ClientPerm: ["EMBED_LINKS", "MANAGE_MESSAGES", "MANAGE_CHANNELS"],
    cooldown: 10,
    guildOnly: true,
    async execute(client, message, args, prefix) {
        database.ref(`admin/bot/botlist/${message.guild.id}/config`).once("value").then(async function (db) {
            if (db.val() == null || db.val().channellog == null || db.val().channelmail == null) {
                return message.channel.send(`${emojis.deny} **|** ${message.author}, você não pode enviar sua aplicação no Servidor, pois ele ainda não está configurado para a **BotList**!`);
            } else {
                let channellog = message.guild.channels.cache.get(db.val().channellog);
                let channelmail = message.guild.channels.cache.get(db.val().channelmail);

                if (!channellog) {
                    return message.channel.send(`${emojis.deny} **|** ${message.author}, o canal configurado para **Logs** no sistema da **BotList** não existe nesse servidor!`);
                };

                if (!channelmail) {
                    return message.channel.send(`${emojis.deny} **|** ${message.author}, o canal configurado para **Correios** no sistema da **BotList** não existe nesse servidor!`);
                };
                
                const embed_q1 = new Discord.MessageEmbed()
                    .setColor("BLUE")
                    .setDescription(`:one: **|** Qual o **ID** da sua Aplicação?`)
                    .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }));

                message.channel.send(`${message.author}`, embed_q1).then(msg => {
                    const question_id = message.channel.createMessageCollector(x => x.author.id === message.author.id, { max: 1 })
                        .on("collect", async m => {
                            let m_content = m.content.split(" ");
                            m.delete();
                            msg.delete();

                            let mention = await client.users.fetch(m_content[0]).catch((error) => {
                                return message.channel.send(`${emojis.deny} **|** ${message.author}, o **ID** que você forneceu não é **Válido**!`);
                            });

                            if (mention.bot == false) {
                                return message.channel.send(`${emojis.deny} **|** ${message.author}, o **ID** que você forneceu não é de um **Bot**!`);
                            };

                            const embed_q2 = new Discord.MessageEmbed()
                                .setColor("BLUE")
                                .setDescription(`:two: **|** Qual o **Prefixo** de sua Aplicação?`)
                                .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }));

                            message.channel.send(`${message.author}`, embed_q2).then(msg1 => {
                                const question_prefix = message.channel.createMessageCollector(x => x.author.id === message.author.id, { max: 1 })
                                    .on("collect", m1 => {
                                        let m1_content = m1.content.split(" ");
                                        m1.delete();
                                        msg1.delete();

                                        const embed_q3 = new Discord.MessageEmbed()
                                            .setColor("BLUE")
                                            .setDescription(`:three: **|** Qual o comando de **Ajuda** da sua Aplicação?`)
                                            .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }));

                                        message.channel.send(`${message.author}`, embed_q3).then(msg2 => {
                                            const question_helpcmd = message.channel.createMessageCollector(x => x.author.id === message.author.id, { max: 1 })
                                                .on("collect", m2 => {
                                                    let m2_content = m2.content;
                                                    m2.delete();
                                                    msg2.delete();

                                                    const embed_q4 = new Discord.MessageEmbed()
                                                        .setColor("BLUE")
                                                        .setDescription(`:four: **|** Mande uma **Descrição** detalhada de sua Aplicação: ||**(max: 500)**||`)
                                                        .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }));

                                                    message.channel.send(`${message.author}`, embed_q4).then(msg3 => {
                                                        const question_description = message.channel.createMessageCollector(x => x.author.id === message.author.id, { max: 1 })
                                                            .on("collect", m3 => {
                                                                let m3_content = m3.content;
                                                                m3.delete();
                                                                msg3.delete();

                                                                if (m3.content.length > 500) {
                                                                    return message.channel.send(`${emojis.deny} **|** ${message.author}, a sua descrição passou do limite de **500 caracteres**!`);
                                                                };
                                                                
                                                                const status = {
                                                                    online: `${emojis.StatusOnline} Online`,
                                                                    idle: `${emojis.StatusIdle} Ausente`,
                                                                    dnd: `${emojis.StatusDnd} Não Pertube`,
                                                                    offline: `${emojis.StatusOffline} Offline`
                                                                };

                                                                const embed_log = new Discord.MessageEmbed()
                                                                    .setColor("YELLOW")
                                                                    .setDescription(`:inbox_tray: **|** O **${message.author.tag}** a aplicação \`${mention.tag}\` para a verificação com Sucesso!`)
                                                                    .setThumbnail(mention.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
                                                                    .setAuthor(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }));

                                                                let verifiq_b;

                                                                if (mention.flags.serialize().VERIFIED_BOT == true) {
                                                                    verifiq_b = "`Verificado`";
                                                                } else {
                                                                    verifiq_b = "`Não Verificado`"
                                                                };

                                                                const embed_main = new Discord.MessageEmbed()
                                                                    .setColor("RED")
                                                                    .setAuthor(`• Correios - BotList`, client.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
                                                                    .setDescription(`:robot: **| APLICAÇÃO:**` +
                                                                        `\n> :computer: • Aplicação: \`${mention.tag}\`` +
                                                                        `\n> :label: • ID: \`${mention.id}\`` +
                                                                        `\n> :placard: • Prefixo: \`${m1_content[0]}\`` +
                                                                        `\n> :scroll: • Comando de Ajuda: **${m2_content}**` +
                                                                        `\n> :bookmark: • Descrição: \n> **${m3_content}**` +
                                                                        `\n\n:gear: **| INFORMAÇÕES ADICIONAIS:**` +
                                                                        `\n> :date: • Data de Criação: \`${moment(mention.createdAt).format("LL")}\`` +
                                                                        `\n> :watch: • Status: ${status[mention.presence.status]}` +
                                                                        `\n> :microscope: • Bot: ${verifiq_b}` +
                                                                        `\n\n:link: [Adicionar Agora!](https://discord.com/api/oauth2/authorize?client_id=${mention.id}&permissions=70642753&scope=bot)`)
                                                                    .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
                                                                    .setTimestamp();

                                                                channellog.send(`${message.author}`, embed_log);
                                                                channelmail.send(embed_main);

                                                                message.channel.send(`${emojis.accept} **|** ${message.author}, sua aplicação foi enviada com sucesso!`).then(del => del.delete({ timeout: 5000 }));
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