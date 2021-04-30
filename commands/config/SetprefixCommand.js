const Discord = require("discord.js");
const firebase = require("firebase");
const database = firebase.database();
const emojis = require("../../json/emojis.json");

module.exports = {
    name: "setprefix",
    description: "Comando para realizar a mudança de prefixo do Periquitosvaldo.",
    category: "config",
    MemberPerm: ["MANAGE_GUILD"],
    usage: "[Prefixo]",
    cooldown: 10,
    guildOnly: true,
    async execute(client, message, args, prefix) {
        if (!args[0]) {
            return message.channel.send(`${emojis.deny} **|** ${message.author}, você precisa escrever o **Prefixo** para realizar a mudança!`);
        } else {
            database.ref(`admin/bot/config/prefix/${message.guild.id}`).once("value").then(async function (db) {
                if (db.val() == null) {
                    database.ref(`admin/bot/config/prefix/${message.guild.id}`).set({
                        prefix: args[0]
                    });
                } else {
                    database.ref(`admin/bot/config/prefix/${message.guild.id}`).update({
                        prefix: args[0]
                    });
                };
            });

            message.channel.send(`${emojis.accept} **|** ${message.author}, você definiu o prefixo \`${args[0]}\` com o prefixo padrão no Servidor!`);
        };
    },
};