const Discord = require("discord.js");
const firebase = require("firebase");
const { millify } = require("millify");
const database = firebase.database();
const numbersType = ['', 'K', 'Mi', 'Bi', 'Tri', 'Qua', 'Qui'];

module.exports = {
    name: "profile",
    description: "Comando para mostrar o seu Perfil do Sistema de Social do Periquitosvaldo, onde mostrará as informações como Money, Casamento e o Sobremim do usuário.",
    aliases: ["perfil"],
    category: "social",
    ClientPerm: ["ATTACH_FILES", "MANAGE_MESSAGES"],
    usage: "[Usuário](Opcional)",
    cooldown: 15,
    guildOnly: true,
    async execute(client, message, args, prefix) {
        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch((error) => {
            return message.author;
        });

        database.ref(`admin/social/${user.id}`).once("value").then(async function (db) {
            if (db.val() == null) {
                database.ref(`admin/social/${user.id}`).set({
                    aboutme: "Amo o Periquitosvaldo! Para mudar essa descrição, use 'sobremim'.",
                    background: "https://cdn.shopify.com/s/files/1/1003/7610/products/Black_Hexagon_Pattern_Wallpaper_Mural_a_700x.jpg",
                    model: "default",
                    money: 0
                });

                const options = {
                    model: "default",
                    avatarURL: user.displayAvatarURL({ format: "png", size: 512 }),
                    background: "https://cdn.shopify.com/s/files/1/1003/7610/products/Black_Hexagon_Pattern_Wallpaper_Mural_a_700x.jpg", 
                    username: user.username,
                    discriminator: user.discriminator,
                    money: millify(0, {
                        units: numbersType,
                        space: true,
                    }),
                    marry: "Ninguem",
                    aboutme: "Amo o Periquitosvaldo! Para mudar essa descrição, use 'sobremim'."
                };

                const Manager = require("../../api/social/core.js");
                Manager(message, options);
            } else {
                let marry;
                if (db.val().marry) {
                    let marryUser = client.users.cache.get(db.val().marry).username || await client.users.fetch(db.val().marry).then((user) => {
                        return `${user.username}`;
                    }).catch((error) => {
                        return `Ninguem`;
                    });

                    marry = marryUser;
                } else {
                    marry = "Ninguem";
                };

                const options = {
                    model: db.val().model,
                    avatarURL: user.displayAvatarURL({ format: "png", size: 512 }),
                    background: db.val().background, 
                    username: user.username,
                    discriminator: user.discriminator,
                    money: millify(db.val().money, {
                        units: numbersType,
                        space: true,
                    }),
                    marry: marry,
                    aboutme: db.val().aboutme
                };

                const Manager = require("../../api/social/core.js");
                Manager(message, options);
            };
        });
    },
};