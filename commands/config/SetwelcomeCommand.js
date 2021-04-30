const Discord = require("discord.js");
const firebase = require("firebase");
const database = firebase.database();
const config = require("../../json/config.json");
const emojis = require("../../json/emojis.json");

module.exports = {
    name: "setwelcome",
    description: "Comando para realizar a configuração do Sistema de Boas-Vindas para o seu Servidor, com varios PlaceHolders para customizar sua mensagem.",
    category: "config",
    MemberPerm: ["MANAGE_GUILD"],
    ClientPerm: ["MANAGE_CHANNELS", "MANAGE_MESSAGES", "ATTACH_FILES"],
    cooldown: 10,
    guildOnly: true,
    async execute(client, message, args, prefix) {
        database.ref(`admin/bot/welcome/${message.guild.id}`).once("value").then(async function (db) {
            if (db.val() == null) {
                const embed = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setAuthor(`• Sistema de Boas-Vindas - Periquitosvaldo`, client.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
                    .setDescription(`:star: **| STATUS ATUAIS:**` +
                        `\n> :label: • Canal de Boas-Vindas: \`Não definido\`` +
                        `\n> :frame_photo: • Imagem Ilustrativa: \`Desativado\`` +
                        `\n> :scroll: • Conteúdo da Mensagem: \`Não definido\`` +
                        `\n\n:gear: **| CONFIGURAÇÕES:**` +
                        `\n> **(:label:) - Definir o Canal de Boas-Vindas**` +
                        `\n> Será enviado a notificação de Boas-Vindas com a imagem.` +
                        `\n> **(:frame_photo:) - Ativar Imagem Ilustrativa**` +
                        `\n> Ativa ou Desativa a imagem ilustrativa que virá junto com a mensagem.` +
                        `\n> **(:scroll:) - Definir o Conteúdo da Mensagem**` +
                        `\n> Esse conteúdo virá encima da imagem que possui 4 Placeholders||(Max: 1024)||.` +
                        `\n\n:zap: **| PLACEHOLDERS:**` +
                        `\n> \`{user}\` • Menciona o usuário que entrou no Servidor;` +
                        `\n> \`{user.name}\` • Mostra o Username do usuário;` +
                        `\n> \`{user.discriminator}\` • Mostra o Discriminador do usuário;` +
                        `\n> \`{user.tag}\` • Mostra a Tag do usuário;` +
                        `\n> \`{user.id}\` • Mostra o ID do usuário;` +
                        `\n> \`{guild.name}\` • Mostra o nome do Servidor que o usuário entrou;` +
                        `\n> \`{guild.memberCount}\` • Mostra a quantidade de membros do Servidor;`)
                    .setImage(config.welcome.default)
                    .setFooter(`• Gerente: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
                    .setTimestamp();

                message.channel.send(`${message.author}`, embed).then(msg => {
                    msg.react("🏷️").then(() => { });
                    msg.react("🖼️").then(() => { });
                    msg.react("📜").then(() => { });

                    const channel = (reaction, user) => reaction.emoji.name === "🏷️" && user.id === message.author.id;
                    const channelCollect = msg.createReactionCollector(channel)
                        .on("collect", c => {
                            msg.delete();

                            message.channel.send(`:gear: **|** ${message.author}, **Mencione** ou use o **ID** abaixo o **Canal** para as mensagens de **Boas-Vindas**:`).then(msg1 => {
                                const question = message.channel.createMessageCollector(x => x.author.id === message.author.id, { max: 1 })
                                    .on("collect", m => {
                                        let mArray = m.content.split(" ");
                                        let channelMention = m.mentions.channels.first() || message.guild.channels.cache.get(mArray[0]);
                                        m.delete();
                                        msg1.delete();

                                        if (!channelMention) {
                                            return message.channel.send(`${emojis.deny} **|** ${message.author}, eu não encontrei o canal que você mencionou! Inicie o processo novamente e mencione um canal válido!`);
                                        } else {
                                            database.ref(`admin/bot/welcome/${message.guild.id}`).once("value").then(async function (data) {
                                                if (data.val() == null) {
                                                    database.ref(`admin/bot/welcome/${message.guild.id}`).set({
                                                        channel: channelMention.id,
                                                        image: false,
                                                        content: null
                                                    });
                                                } else {
                                                    database.ref(`admin/bot/welcome/${message.guild.id}`).update({
                                                        channel: channelMention.id
                                                    });
                                                };
                                            });

                                            return message.channel.send(`${emojis.accept} **|** ${message.author}, você definiu o canal ${channelMention} como o canal de **Boas-Vindas** com Sucesso!`);
                                        };
                                    });
                            });
                        });

                    const image = (reaction, user) => reaction.emoji.name === "🖼️" && user.id === message.author.id;
                    const imageCollect = msg.createReactionCollector(image)
                        .on("collect", c => {
                            msg.delete();

                            database.ref(`admin/bot/welcome/${message.guild.id}`).once("value").then(async function (data) {
                                if (data.val() == null) {
                                    database.ref(`admin/bot/welcome/${message.guild.id}`).set({
                                        channel: null,
                                        image: true,
                                        content: null
                                    });

                                    return message.channel.send(`${emojis.accept} **|** ${message.author}, você **Ativou** as **Imagens** de **Boas-Vindas** com Sucesso!`);
                                } else {
                                    if (data.val().image == true) {
                                        database.ref(`admin/bot/welcome/${message.guild.id}`).update({
                                            image: false
                                        });

                                        return message.channel.send(`${emojis.accept} **|** ${message.author}, você **Desativou** as **Imagens** de **Boas-Vindas** com Sucesso!`);
                                    } else {
                                        database.ref(`admin/bot/welcome/${message.guild.id}`).update({
                                            image: true
                                        });

                                        return message.channel.send(`${emojis.accept} **|** ${message.author}, você **Ativou** as **Imagens** de **Boas-Vindas** com Sucesso!`);
                                    };
                                };
                            });
                        });

                    const content = (reaction, user) => reaction.emoji.name === "📜" && user.id === message.author.id;
                    const contentCollect = msg.createReactionCollector(content)
                        .on("collect", c => {
                            msg.delete();

                            message.channel.send(`:gear: **|** ${message.author}, **Descreva** abaixo o **Conteúdo** da mensagem de **Boas-Vindas**:`).then(msg1 => {
                                const question = message.channel.createMessageCollector(x => x.author.id === message.author.id, { max: 1 })
                                    .on("collect", m => {
                                        let cSting = m.content;
                                        m.delete();
                                        msg1.delete();

                                        if (cSting.length > 1024) {
                                            return message.channel.send(`${emojis.deny} **|** ${message.author}, sua descrição passou de **1024 Caracteres**! Realize sua configuração novamente!`);
                                        };

                                        database.ref(`admin/bot/welcome/${message.guild.id}`).once("value").then(async function (data) {
                                            if (data.val() == null) {
                                                database.ref(`admin/bot/welcome/${message.guild.id}`).set({
                                                    channel: null,
                                                    image: false,
                                                    content: cSting
                                                });
                                            } else {
                                                database.ref(`admin/bot/welcome/${message.guild.id}`).update({
                                                    content: cSting
                                                });
                                            };
                                        });

                                        return message.channel.send(`${emojis.accept} **|** ${message.author}, você definiu o **Conteúdo** da mensagem de **Boas-Vindas** com Sucesso!`);
                                    });
                            });
                        });
                });
            } else {
                const types = {
                    true: `\`Ativado\``,
                    false: `\`Desativado\``
                };

                const embed = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setAuthor(`• Sistema de Boas-Vindas - Periquitosvaldo`, client.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
                    .setDescription(`:star: **| STATUS ATUAIS:**` +
                        `\n> :label: • Canal de Boas-Vindas: ${db.val().channel ? `<#${db.val().channel}>` : '`Não definido`'}` +
                        `\n> :frame_photo: • Imagem Ilustrativa: ${db.val().image ? types[db.val().image] : '`Desativado`'}` +
                        `\n> :scroll: • Conteúdo da Mensagem: ${db.val().content ? `\n \`\`\`md\n${db.val().content}\`\`\`` : '`Não definido`\n'}` +
                        `\n:gear: **| CONFIGURAÇÕES:**` +
                        `\n> **(:label:) - Definir o Canal de Boas-Vindas**` +
                        `\n> Será enviado a notificação de Boas-Vindas com a imagem.` +
                        `\n> **(:frame_photo:) - Ativar Imagem Ilustrativa**` +
                        `\n> Ativa ou Desativa a imagem ilustrativa que virá junto com a mensagem.` +
                        `\n> **(:scroll:) - Definir o Conteúdo da Mensagem**` +
                        `\n> Esse conteúdo virá encima da imagem que possui 4 Placeholders||(Max: 1024)||.` +
                        `\n\n:zap: **| PLACEHOLDERS:**` +
                        `\n> \`{user}\` • Menciona o usuário que entrou no Servidor;` +
                        `\n> \`{user.name}\` • Mostra o Username do usuário;` +
                        `\n> \`{user.discriminator}\` • Mostra o Discriminador do usuário;` +
                        `\n> \`{user.tag}\` • Mostra a Tag do usuário;` +
                        `\n> \`{user.id}\` • Mostra o ID do usuário;` +
                        `\n> \`{guild.name}\` • Mostra o nome do Servidor que o usuário entrou;` +
                        `\n> \`{guild.memberCount}\` • Mostra a quantidade de membros do Servidor;`)
                    .setFooter(`• Gerente: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
                    .setTimestamp();

                message.channel.send(`${message.author}`, embed).then(msg => {
                    msg.react("🏷️").then(() => { });
                    msg.react("🖼️").then(() => { });
                    msg.react("📜").then(() => { });

                    const channel = (reaction, user) => reaction.emoji.name === "🏷️" && user.id === message.author.id;
                    const channelCollect = msg.createReactionCollector(channel)
                        .on("collect", c => {
                            msg.delete();

                            message.channel.send(`:gear: **|** ${message.author}, **Mencione** ou use o **ID** abaixo o **Canal** para as mensagens de **Boas-Vindas**:`).then(msg1 => {
                                const question = message.channel.createMessageCollector(x => x.author.id === message.author.id, { max: 1 })
                                    .on("collect", m => {
                                        let mArray = m.content.split(" ");
                                        let channelMention = m.mentions.channels.first() || message.guild.channels.cache.get(mArray[0]);
                                        m.delete();
                                        msg1.delete();

                                        if (!channelMention) {
                                            return message.channel.send(`${emojis.deny} **|** ${message.author}, eu não encontrei o canal que você mencionou! Inicie o processo novamente e mencione um canal válido!`);
                                        } else {
                                            database.ref(`admin/bot/welcome/${message.guild.id}`).once("value").then(async function (data) {
                                                if (data.val() == null) {
                                                    database.ref(`admin/bot/welcome/${message.guild.id}`).set({
                                                        channel: channelMention.id,
                                                        image: false,
                                                        content: null
                                                    });
                                                } else {
                                                    database.ref(`admin/bot/welcome/${message.guild.id}`).update({
                                                        channel: channelMention.id
                                                    });
                                                };
                                            });

                                            return message.channel.send(`${emojis.accept} **|** ${message.author}, você definiu o canal ${channelMention} como o canal de **Boas-Vindas** com Sucesso!`);
                                        };
                                    });
                            });
                        });

                    const image = (reaction, user) => reaction.emoji.name === "🖼️" && user.id === message.author.id;
                    const imageCollect = msg.createReactionCollector(image)
                        .on("collect", c => {
                            msg.delete();

                            database.ref(`admin/bot/welcome/${message.guild.id}`).once("value").then(async function (data) {
                                if (data.val() == null) {
                                    database.ref(`admin/bot/welcome/${message.guild.id}`).set({
                                        channel: null,
                                        image: true,
                                        content: null
                                    });

                                    return message.channel.send(`${emojis.accept} **|** ${message.author}, você **Ativou** as **Imagens** de **Boas-Vindas** com Sucesso!`);
                                } else {
                                    if (data.val().image == true) {
                                        database.ref(`admin/bot/welcome/${message.guild.id}`).update({
                                            image: false
                                        });

                                        return message.channel.send(`${emojis.accept} **|** ${message.author}, você **Desativou** as **Imagens** de **Boas-Vindas** com Sucesso!`);
                                    } else {
                                        database.ref(`admin/bot/welcome/${message.guild.id}`).update({
                                            image: true
                                        });

                                        return message.channel.send(`${emojis.accept} **|** ${message.author}, você **Ativou** as **Imagens** de **Boas-Vindas** com Sucesso!`);
                                    };
                                };
                            });
                        });

                    const content = (reaction, user) => reaction.emoji.name === "📜" && user.id === message.author.id;
                    const contentCollect = msg.createReactionCollector(content)
                        .on("collect", c => {
                            msg.delete();

                            message.channel.send(`:gear: **|** ${message.author}, **Descreva** abaixo o **Conteúdo** da mensagem de **Boas-Vindas**:`).then(msg1 => {
                                const question = message.channel.createMessageCollector(x => x.author.id === message.author.id, { max: 1 })
                                    .on("collect", m => {
                                        let cSting = m.content;
                                        m.delete();
                                        msg1.delete();

                                        if (cSting.length > 1024) {
                                            return message.channel.send(`${emojis.deny} **|** ${message.author}, sua descrição passou de **1024 Caracteres**! Realize sua configuração novamente!`);
                                        };

                                        database.ref(`admin/bot/welcome/${message.guild.id}`).once("value").then(async function (data) {
                                            if (data.val() == null) {
                                                database.ref(`admin/bot/welcome/${message.guild.id}`).set({
                                                    channel: null,
                                                    image: false,
                                                    content: cSting
                                                });
                                            } else {
                                                database.ref(`admin/bot/welcome/${message.guild.id}`).update({
                                                    content: cSting
                                                });
                                            };
                                        });

                                        return message.channel.send(`${emojis.accept} **|** ${message.author}, você definiu o **Conteúdo** da mensagem de **Boas-Vindas** com Sucesso!`);
                                    });
                            });
                        });
                });
            };
        });
    },
};