const Discord = require("discord.js");
const firebase = require("firebase");
const database = firebase.database();
const emojis = require("../../json/emojis.json");

module.exports = {
    name: "blconfig",
    description: "Comando para configurar o Sistema de BotList para o seu Servidor, como Cargo para Verificador, Cargo de Desevolvedor Verificado e Cargo para Bot Verificado.",
    aliases: ["botlistconfig"],
    category: "botlist",
    MemberPerm: ["MANAGE_GUILD"],
    ClientPerm: ["MANAGE_MESSAGES", "MANAGE_ROLES", "EMBED_LINKS", "MANAGE_CHANNELS"],
    cooldown: 10,
    guildOnly: true,
    async execute(client, message, args, prefix) {
        database.ref(`admin/bot/botlist/${message.guild.id}/config`).once("value").then(async function (db) {
            if (db.val() == null) {
                const embedmenu = new Discord.MessageEmbed()
                    .setAuthor(`• Periquito BotList - Configurações`, client.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
                    .setColor("RANDOM")
                    .setDescription(`:star: **| STATUS ATUAIS:**` +
                        `\n> :microscope: • Cargo para Verificador: \`Não definido\`` +
                        `\n> :wrench: • Cargo para Desenvolvedor: \`Não Definido\`` +
                        `\n> :robot: • Cargo para Bot Verificado: \`Não Definido\`` +
                        `\n> :inbox_tray: • Canal para Logs: \`Não definido\`` +
                        `\n> :postbox: • Canal para Correios: \`Não definido\`` +
                        `\n\n:gear: **| CONFIGURAÇÕES:**` +
                        `\n> **(:microscope:) - Definir um Cargo para Verificadores**` +
                        `\n> Apenas pessoas com esse cargo, podem fazer a Verificação.` +
                        `\n> **(:wrench:) - Definir um Cargo para o Desenvolvedor Verificado**` +
                        `\n> Apenas pessoas que tiveram seus Bots verificados receberam esse cargo.` +
                        `\n> **(:robot:) - Definir um Cargo para os Bots Verificados**` +
                        `\n> Apenas os Bots que foram verificadores receberam esse cargo.` +
                        `\n> **(:inbox_tray:) - Definir um Canal para Logs**` +
                        `\n> Canal para o envio de Logs da Botlist do seu Servidor.` +
                        `\n> **(:postbox:) - Definir um Canal para Correios**` +
                        `\n> Canal para o correio de solicitações de Verificações de Bots.`)
                    .setFooter(`• Gerenciador: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
                    .setTimestamp();

                return message.channel.send(`${message.author}`, embedmenu).then(msg => {
                    msg.react("🔬").then(() => { });
                    msg.react("🔧").then(() => { });
                    msg.react("🤖").then(() => { });
                    msg.react("📥").then(() => { });
                    msg.react("📮").then(() => { });

                    let microscope = (reaction, user) => reaction.emoji.name === "🔬" && user.id === message.author.id;
                    let microscopeCollect = msg.createReactionCollector(microscope)
                        .on("collect", c => {
                            msg.delete();

                            message.channel.send(`:microscope: **|** ${message.author}, **Mencione** ou use o **ID** do cargo para **Verificadores** da **BotList**:`).then(msg1 => {
                                const question = message.channel.createMessageCollector(x => x.author.id === message.author.id, { max: 1 })
                                    .on("collect", m => {
                                        let mArray = m.content.split(" ");
                                        let roleMention = m.mentions.roles.first() || message.guild.roles.cache.get(mArray[0]);
                                        m.delete();
                                        msg1.delete();

                                        if (!roleMention) {
                                            return message.channel.send(`${emojis.deny} **|** ${message.author}, eu não encontrei o cargo que você mencionou! Inicie o processo novamente e mencione um cargo válido!`);
                                        } else {
                                            if (message.guild.me.roles.highest.position < roleMention.position) {
                                                return message.channel.send(`${emojis.deny} **|** ${message.author}, eu não posso adicionar o cargo que você enviou, pois esse cargo é maior que o meu!`);
                                            } else {
                                                database.ref(`admin/bot/botlist/${message.guild.id}/config`).once("value").then(async function (data) {
                                                    if (data.val() == null) {
                                                        database.ref(`admin/bot/botlist/${message.guild.id}/config`).set({
                                                            verificatorRole: roleMention.id,
                                                            devRole: null,
                                                            botRole: null,
                                                            channellog: null,
                                                            channelmail: null
                                                        });
                                                    } else {
                                                        database.ref(`admin/bot/botlist/${message.guild.id}/config`).update({
                                                            verificatorRole: roleMention.id
                                                        });
                                                    };
                                                });

                                                return message.channel.send(`${emojis.accept} **|** ${message.author}, você definiu o cargo ${roleMention} como o cargo para **Verificadores** da **BotList** com sucesso!`);
                                            };
                                        };
                                    });
                            });
                        });

                    let wrench = (reaction, user) => reaction.emoji.name === "🔧" && user.id === message.author.id;
                    let wrenchCollect = msg.createReactionCollector(wrench)
                        .on("collect", c => {
                            msg.delete();

                            message.channel.send(`:wrench: **|** ${message.author}, **Mencione** ou use o **ID** do cargo para os **Desenvolvedores** verificados da **BotList**:`).then(msg1 => {
                                const question = message.channel.createMessageCollector(x => x.author.id === message.author.id, { max: 1 })
                                    .on("collect", m => {
                                        let mArray = m.content.split(" ");
                                        let roleMention = m.mentions.roles.first() || message.guild.roles.cache.get(mArray[0]);
                                        m.delete();
                                        msg1.delete();

                                        if (!roleMention) {
                                            return message.channel.send(`${emojis.deny} **|** ${message.author}, eu não encontrei o cargo que você mencionou! Inicie o processo novamente e mencione um cargo válido!`);
                                        } else {
                                            if (message.guild.me.roles.highest.position < roleMention.position) {
                                                return message.channel.send(`${emojis.deny} **|** ${message.author}, eu não posso adicionar o cargo que você enviou, pois esse cargo é maior que o meu!`);
                                            } else {
                                                database.ref(`admin/bot/botlist/${message.guild.id}/config`).once("value").then(async function (data) {
                                                    if (data.val() == null) {
                                                        database.ref(`admin/bot/botlist/${message.guild.id}/config`).set({
                                                            verificatorRole: null,
                                                            devRole: roleMention.id,
                                                            botRole: null,
                                                            channellog: null,
                                                            channelmail: null
                                                        });
                                                    } else {
                                                        database.ref(`admin/bot/botlist/${message.guild.id}/config`).update({
                                                            devRole: roleMention.id
                                                        });
                                                    };
                                                });

                                                return message.channel.send(`${emojis.accept} **|** ${message.author}, você definiu o cargo ${roleMention} como o cargo para **Desevolvedores** verificados da **BotList** com sucesso!`);
                                            };
                                        };
                                    });
                            });
                        });

                    let robot = (reaction, user) => reaction.emoji.name === "🤖" && user.id === message.author.id;
                    let robotCollect = msg.createReactionCollector(robot)
                        .on("collect", c => {
                            msg.delete();

                            message.channel.send(`:robot: **|** ${message.author}, **Mencione** ou use o **ID** do cargo para os **Bots** verificados da **BotList**:`).then(msg1 => {
                                const question = message.channel.createMessageCollector(x => x.author.id === message.author.id, { max: 1 })
                                    .on("collect", m => {
                                        let mArray = m.content.split(" ");
                                        let roleMention = m.mentions.roles.first() || message.guild.roles.cache.get(mArray[0]);
                                        m.delete();
                                        msg1.delete();

                                        if (!roleMention) {
                                            return message.channel.send(`${emojis.deny} **|** ${message.author}, eu não encontrei o cargo que você mencionou! Inicie o processo novamente e mencione um cargo válido!`);
                                        } else {
                                            if (message.guild.me.roles.highest.position < roleMention.position) {
                                                return message.channel.send(`${emojis.deny} **|** ${message.author}, eu não posso adicionar o cargo que você enviou, pois esse cargo é maior que o meu!`);
                                            } else {
                                                database.ref(`admin/bot/botlist/${message.guild.id}/config`).once("value").then(async function (data) {
                                                    if (data.val() == null) {
                                                        database.ref(`admin/bot/botlist/${message.guild.id}/config`).set({
                                                            verificatorRole: null,
                                                            devRole: null,
                                                            botRole: roleMention.id,
                                                            channellog: null,
                                                            channelmail: null
                                                        });
                                                    } else {
                                                        database.ref(`admin/bot/botlist/${message.guild.id}/config`).update({
                                                            botRole: roleMention.id
                                                        });
                                                    };
                                                });

                                                return message.channel.send(`${emojis.accept} **|** ${message.author}, você definiu o cargo ${roleMention} como o cargo para **Bots** verificados da **BotList** com sucesso!`);
                                            };
                                        };
                                    });
                            });
                        });

                    let inbox_tray = (reaction, user) => reaction.emoji.name === "📥" && user.id === message.author.id;
                    let inbox_trayCollect = msg.createReactionCollector(inbox_tray)
                        .on("collect", c => {
                            msg.delete();

                            message.channel.send(`:inbox_tray: **|** ${message.author}, **Mencione** ou use o **ID** abaixo o **Canal** para os **Logs** da **BotList**:`).then(msg1 => {
                                const question = message.channel.createMessageCollector(x => x.author.id === message.author.id, { max: 1 })
                                    .on("collect", m => {
                                        let mArray = m.content.split(" ");
                                        let channelMention = m.mentions.channels.first() || message.guild.channels.cache.get(mArray[0]);
                                        m.delete();
                                        msg1.delete();

                                        if (!channelMention) {
                                            return message.channel.send(`${emojis.deny} **|** ${message.author}, eu não encontrei o canal que você mencionou! Inicie o processo novamente e mencione um canal válido!`);
                                        } else {
                                            database.ref(`admin/bot/botlist/${message.guild.id}/config`).once("value").then(async function (data) {
                                                if (data.val() == null) {
                                                    database.ref(`admin/bot/botlist/${message.guild.id}/config`).set({
                                                        verificatorRole: null,
                                                        devRole: null,
                                                        botRole: null,
                                                        channellog: channelMention.id,
                                                        channelmail: null
                                                    });
                                                } else {
                                                    database.ref(`admin/bot/botlist/${message.guild.id}/config`).update({
                                                        channellog: channelMention.id
                                                    });
                                                };
                                            });

                                            return message.channel.send(`${emojis.accept} **|** ${message.author}, você definiu o canal ${channelMention} como o canal de **Logs** da **BotList** com sucesso!`);
                                        };
                                    });
                            });
                        });

                    let postbox = (reaction, user) => reaction.emoji.name === "📮" && user.id === message.author.id;
                    let postboxCollect = msg.createReactionCollector(postbox)
                        .on("collect", c => {
                            msg.delete();

                            message.channel.send(`:postbox: **|** ${message.author}, **Mencione** ou use o **ID** abaixo o **Canal** para os **Correios** da **BotList**:`).then(msg1 => {
                                const question = message.channel.createMessageCollector(x => x.author.id === message.author.id, { max: 1 })
                                    .on("collect", m => {
                                        let mArray = m.content.split(" ");
                                        let channelMention = m.mentions.channels.first() || message.guild.channels.cache.get(mArray[0]);
                                        m.delete();
                                        msg1.delete();

                                        if (!channelMention) {
                                            return message.channel.send(`${emojis.deny} **|** ${message.author}, eu não encontrei o canal que você mencionou! Inicie o processo novamente e mencione um canal válido!`);
                                        } else {
                                            database.ref(`admin/bot/botlist/${message.guild.id}/config`).once("value").then(async function (data) {
                                                if (data.val() == null) {
                                                    database.ref(`admin/bot/botlist/${message.guild.id}/config`).set({
                                                        verificatorRole: null,
                                                        devRole: null,
                                                        botRole: null,
                                                        channellog: null,
                                                        channelmail: channelMention.id
                                                    });
                                                } else {
                                                    database.ref(`admin/bot/botlist/${message.guild.id}/config`).update({
                                                        channelmail: channelMention.id
                                                    });
                                                };
                                            });

                                            return message.channel.send(`${emojis.accept} **|** ${message.author}, você definiu o canal ${channelMention} como o canal de **Logs** da **BotList** com sucesso!`);
                                        };
                                    });
                            });
                        });
                });
            } else {
                const embedmenu = new Discord.MessageEmbed()
                    .setAuthor(`• Periquito BotList - Configurações`, client.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
                    .setColor("RANDOM")
                    .setDescription(`:star: **| STATUS ATUAIS:**` +
                        `\n> :microscope: • Cargo para Verificador: ${db.val().verificatorRole ? `<@&${db.val().verificatorRole}>` : '`Não definido`'}` +
                        `\n> :wrench: • Cargo para Desenvolvedor: ${db.val().devRole ? `<@&${db.val().devRole}>` : '`Não definido`'}` +
                        `\n> :robot: • Cargo para Bot Verificado: ${db.val().botRole ? `<@&${db.val().botRole}>` : '`Não definido`'}` +
                        `\n> :inbox_tray: • Canal para Logs: ${db.val().channellog ? `<#${db.val().channellog}>` : '`Não definido`'}` +
                        `\n> :postbox: • Canal para Correios: ${db.val().channelmail ? `<#${db.val().channelmail}>` : '`Não definido`'}` +
                        `\n\n:gear: **| CONFIGURAÇÕES:**` +
                        `\n> **(:microscope:) - Definir um Cargo para Verificadores**` +
                        `\n> Apenas pessoas com esse cargo, podem fazer a Verificação.` +
                        `\n> **(:wrench:) - Definir um Cargo para o Desenvolvedor Verificado**` +
                        `\n> Apenas pessoas que tiveram seus Bots verificados receberam esse cargo.` +
                        `\n> **(:robot:) - Definir um Cargo para os Bots Verificados**` +
                        `\n> Apenas os Bots que foram verificadores receberam esse cargo.` +
                        `\n> **(:inbox_tray:) - Definir um Canal para Logs**` +
                        `\n> Canal para o envio de Logs da Botlist do seu Servidor.` +
                        `\n> **(:postbox:) - Definir um Canal para Correios**` +
                        `\n> Canal para o correio de solicitações de Verificações de Bots.` +
                        `\n> **(:arrows_counterclockwise:) - Reset Total da BotList**` +
                        `\n> Faça uma limpeza nas configurações do seu servidor.`)
                    .setFooter(`• Gerenciador: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
                    .setTimestamp();

                return message.channel.send(`${message.author}`, embedmenu).then(msg => {
                    msg.react("🔬").then(() => { });
                    msg.react("🔧").then(() => { });
                    msg.react("🤖").then(() => { });
                    msg.react("📥").then(() => { });
                    msg.react("📮").then(() => { });
                    msg.react("🔄").then(() => { });

                    let microscope = (reaction, user) => reaction.emoji.name === "🔬" && user.id === message.author.id;
                    let microscopeCollect = msg.createReactionCollector(microscope)
                        .on("collect", c => {
                            msg.delete();

                            message.channel.send(`:microscope: **|** ${message.author}, **Mencione** ou use o **ID** do cargo para **Verificadores** da **BotList**:`).then(msg1 => {
                                const question = message.channel.createMessageCollector(x => x.author.id === message.author.id, { max: 1 })
                                    .on("collect", m => {
                                        let mArray = m.content.split(" ");
                                        let roleMention = m.mentions.roles.first() || message.guild.roles.cache.get(mArray[0]);
                                        m.delete();
                                        msg1.delete();

                                        if (!roleMention) {
                                            return message.channel.send(`${emojis.deny} **|** ${message.author}, eu não encontrei o cargo que você mencionou! Inicie o processo novamente e mencione um cargo válido!`);
                                        } else {
                                            if (message.guild.me.roles.highest.position < roleMention.position) {
                                                return message.channel.send(`${emojis.deny} **|** ${message.author}, eu não posso adicionar o cargo que você enviou, pois esse cargo é maior que o meu!`);
                                            } else {
                                                database.ref(`admin/bot/botlist/${message.guild.id}/config`).once("value").then(async function (data) {
                                                    if (data.val() == null) {
                                                        database.ref(`admin/bot/botlist/${message.guild.id}/config`).set({
                                                            verificatorRole: roleMention.id,
                                                            devRole: null,
                                                            botRole: null,
                                                            channellog: null,
                                                            channelmail: null
                                                        });
                                                    } else {
                                                        database.ref(`admin/bot/botlist/${message.guild.id}/config`).update({
                                                            verificatorRole: roleMention.id
                                                        });
                                                    };
                                                });

                                                return message.channel.send(`${emojis.accept} **|** ${message.author}, você definiu o cargo ${roleMention} como o cargo para **Verificadores** da **BotList** com sucesso!`);
                                            };
                                        };
                                    });
                            });
                        });

                    let wrench = (reaction, user) => reaction.emoji.name === "🔧" && user.id === message.author.id;
                    let wrenchCollect = msg.createReactionCollector(wrench)
                        .on("collect", c => {
                            msg.delete();

                            message.channel.send(`:wrench: **|** ${message.author}, **Mencione** ou use o **ID** do cargo para os **Desenvolvedores** verificados da **BotList**:`).then(msg1 => {
                                const question = message.channel.createMessageCollector(x => x.author.id === message.author.id, { max: 1 })
                                    .on("collect", m => {
                                        let mArray = m.content.split(" ");
                                        let roleMention = m.mentions.roles.first() || message.guild.roles.cache.get(mArray[0]);
                                        m.delete();
                                        msg1.delete();

                                        if (!roleMention) {
                                            return message.channel.send(`${emojis.deny} **|** ${message.author}, eu não encontrei o cargo que você mencionou! Inicie o processo novamente e mencione um cargo válido!`);
                                        } else {
                                            if (message.guild.me.roles.highest.position < roleMention.position) {
                                                return message.channel.send(`${emojis.deny} **|** ${message.author}, eu não posso adicionar o cargo que você enviou, pois esse cargo é maior que o meu!`);
                                            } else {
                                                database.ref(`admin/bot/botlist/${message.guild.id}/config`).once("value").then(async function (data) {
                                                    if (data.val() == null) {
                                                        database.ref(`admin/bot/botlist/${message.guild.id}/config`).set({
                                                            verificatorRole: null,
                                                            devRole: roleMention.id,
                                                            botRole: null,
                                                            channellog: null,
                                                            channelmail: null
                                                        });
                                                    } else {
                                                        database.ref(`admin/bot/botlist/${message.guild.id}/config`).update({
                                                            devRole: roleMention.id
                                                        });
                                                    };
                                                });

                                                return message.channel.send(`${emojis.accept} **|** ${message.author}, você definiu o cargo ${roleMention} como o cargo para **Desevolvedores** verificados da **BotList** com sucesso!`);
                                            };
                                        };
                                    });
                            });
                        });

                    let robot = (reaction, user) => reaction.emoji.name === "🤖" && user.id === message.author.id;
                    let robotCollect = msg.createReactionCollector(robot)
                        .on("collect", c => {
                            msg.delete();

                            message.channel.send(`:robot: **|** ${message.author}, **Mencione** ou use o **ID** do cargo para os **Bots** verificados da **BotList**:`).then(msg1 => {
                                const question = message.channel.createMessageCollector(x => x.author.id === message.author.id, { max: 1 })
                                    .on("collect", m => {
                                        let mArray = m.content.split(" ");
                                        let roleMention = m.mentions.roles.first() || message.guild.roles.cache.get(mArray[0]);
                                        m.delete();
                                        msg1.delete();

                                        if (!roleMention) {
                                            return message.channel.send(`${emojis.deny} **|** ${message.author}, eu não encontrei o cargo que você mencionou! Inicie o processo novamente e mencione um cargo válido!`);
                                        } else {
                                            if (message.guild.me.roles.highest.position < roleMention.position) {
                                                return message.channel.send(`${emojis.deny} **|** ${message.author}, eu não posso adicionar o cargo que você enviou, pois esse cargo é maior que o meu!`);
                                            } else {
                                                database.ref(`admin/bot/botlist/${message.guild.id}/config`).once("value").then(async function (data) {
                                                    if (data.val() == null) {
                                                        database.ref(`admin/bot/botlist/${message.guild.id}/config`).set({
                                                            verificatorRole: null,
                                                            devRole: null,
                                                            botRole: roleMention.id,
                                                            channellog: null,
                                                            channelmail: null
                                                        });
                                                    } else {
                                                        database.ref(`admin/bot/botlist/${message.guild.id}/config`).update({
                                                            botRole: roleMention.id
                                                        });
                                                    };
                                                });

                                                return message.channel.send(`${emojis.accept} **|** ${message.author}, você definiu o cargo ${roleMention} como o cargo para **Bots** verificados da **BotList** com sucesso!`);
                                            };
                                        };
                                    });
                            });
                        });

                    let inbox_tray = (reaction, user) => reaction.emoji.name === "📥" && user.id === message.author.id;
                    let inbox_trayCollect = msg.createReactionCollector(inbox_tray)
                        .on("collect", c => {
                            msg.delete();

                            message.channel.send(`:inbox_tray: **|** ${message.author}, **Mencione** ou use o **ID** abaixo o **Canal** para os **Logs** da **BotList**:`).then(msg1 => {
                                const question = message.channel.createMessageCollector(x => x.author.id === message.author.id, { max: 1 })
                                    .on("collect", m => {
                                        let mArray = m.content.split(" ");
                                        let channelMention = m.mentions.channels.first() || message.guild.channels.cache.get(mArray[0]);
                                        m.delete();
                                        msg1.delete();

                                        if (!channelMention) {
                                            return message.channel.send(`${emojis.deny} **|** ${message.author}, eu não encontrei o canal que você mencionou! Inicie o processo novamente e mencione um canal válido!`);
                                        } else {
                                            database.ref(`admin/bot/botlist/${message.guild.id}/config`).once("value").then(async function (data) {
                                                if (data.val() == null) {
                                                    database.ref(`admin/bot/botlist/${message.guild.id}/config`).set({
                                                        verificatorRole: null,
                                                        devRole: null,
                                                        botRole: null,
                                                        channellog: channelMention.id,
                                                        channelmail: null
                                                    });
                                                } else {
                                                    database.ref(`admin/bot/botlist/${message.guild.id}/config`).update({
                                                        channellog: channelMention.id
                                                    });
                                                };
                                            });

                                            return message.channel.send(`${emojis.accept} **|** ${message.author}, você definiu o canal ${channelMention} como o canal de **Logs** da **BotList** com sucesso!`);
                                        };
                                    });
                            });
                        });

                    let postbox = (reaction, user) => reaction.emoji.name === "📮" && user.id === message.author.id;
                    let postboxCollect = msg.createReactionCollector(postbox)
                        .on("collect", c => {
                            msg.delete();

                            message.channel.send(`:postbox: **|** ${message.author}, **Mencione** ou use o **ID** abaixo o **Canal** para os **Correios** da **BotList**:`).then(msg1 => {
                                const question = message.channel.createMessageCollector(x => x.author.id === message.author.id, { max: 1 })
                                    .on("collect", m => {
                                        let mArray = m.content.split(" ");
                                        let channelMention = m.mentions.channels.first() || message.guild.channels.cache.get(mArray[0]);
                                        m.delete();
                                        msg1.delete();

                                        if (!channelMention) {
                                            return message.channel.send(`${emojis.deny} **|** ${message.author}, eu não encontrei o canal que você mencionou! Inicie o processo novamente e mencione um canal válido!`);
                                        } else {
                                            database.ref(`admin/bot/botlist/${message.guild.id}/config`).once("value").then(async function (data) {
                                                if (data.val() == null) {
                                                    database.ref(`admin/bot/botlist/${message.guild.id}/config`).set({
                                                        verificatorRole: null,
                                                        devRole: null,
                                                        botRole: null,
                                                        channellog: null,
                                                        channelmail: channelMention.id
                                                    });
                                                } else {
                                                    database.ref(`admin/bot/botlist/${message.guild.id}/config`).update({
                                                        channelmail: channelMention.id
                                                    });
                                                };
                                            });

                                            return message.channel.send(`${emojis.accept} **|** ${message.author}, você definiu o canal ${channelMention} como o canal de **Logs** da **BotList** com sucesso!`);
                                        };
                                    });
                            });
                        });

                    let arrows_counterclockwise = (reaction, user) => reaction.emoji.name === "🔄" && user.id === message.author.id;
                    let arrows_counterclockwiseCollect = msg.createReactionCollector(arrows_counterclockwise)
                        .on("collect", c => {
                            msg.delete();

                            database.ref(`admin/bot/botlist/${message.guild.id}/config`).once("value").then(async function (data) {
                                if (data.val() == null) {
                                    return message.channel.send(`${emojis.deny} **|** ${message.author}, eu não posso fazer o **Reset** das configurações da **BotList**, pois não existe configurações pendentes!`);
                                } else {
                                    database.ref(`admin/bot/botlist/${message.guild.id}/config`).remove();

                                    return message.channel.send(`${emojis.accept} **|** ${message.author}, os dados de configurações da **BotList** do seu servidor foram resetados com Sucesso!`);
                                };
                            });
                        });
                });
            };
        });
    },
};