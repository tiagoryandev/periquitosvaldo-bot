const Discord = require("discord.js");
const firebase = require("firebase");
const colors = require("colors");
const database = firebase.database();

const config = require("../json/config.json");
const emojis = require("../json/emojis.json");
const checkPermission = require("../modules/checkPermission.js");

const cooldowns = new Discord.Collection();

module.exports = async (client, message) => {
    if (message.author.bot) return;
    
    let prefix;
    if (message.channel.type === "dm") {
        prefix = config.client.prefix;
    } else {
        prefix = await database.ref(`admin/bot/config/prefix/${message.guild.id}`).once("value").then(async function (db) {
            if (db.val() == null) {
                return config.client.prefix;
            } else {
                return db.val().prefix;
            };
        });
    };

    if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) {
        return message.channel.send(`${emojis.PeriquitoOriginal} **|** ${message.author}, se você estiver com duvidas, o meu prefixo nesse servidor é \`${prefix}\`, e use o comando \`${prefix}help\` para ver todos os meus comandos e funções.`);
    };

	if (!message.content.startsWith(prefix)) return;
	
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type !== "text") {
        return message.channel.send(`${emojis.deny} **|** ${message.author}, esse comando não pode ser executado na **DM**.`).then(msg => { msg.delete({ timeout: 7000 }) });
    };

    if (command.MemberPerm && !message.member.permissions.has(command.MemberPerm)) {
        return checkPermission.Member(command, message);
    };

    if (command.ClientPerm && !message.guild.members.cache.get(client.user.id).permissions.has(command.ClientPerm)) {
        return checkPermission.Client(command, message);
    };

    if (command.developer && !config.client.developers.includes(message.author.id)) {
        return message.channel.send(`${emojis.deny} **|** ${message.author}, você não pode usar esse comando, pois esse comando só pode ser executado por meus **Desenvolvedores**!`).then(msg => { msg.delete({ timeout: 15000 }) });
    };

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    };

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.channel.send(`${emojis.deny} **|** ${message.author}, por favor, espere ${timeLeft.toFixed(1)} segundo(s) antes de realizar o comando \`${command.name}\`.`).then(msg => { msg.delete({ timeout: 5000 }) });
        };
    };

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        await command.execute(client, message, args, prefix);
    } catch (error) {
        console.log(colors.red(`[ERROR] - Ocorreu um erro ao executar o comando.\nErro: ${error}`));
        return message.channel.send(`${emojis.PeriquitoDead} **|** ${message.author}, ocorreu um erro ao executar esse comando, recomendo você reportar esse erro no servidor de suporte para meus desenvolvedores.`).then(msg => { msg.delete({ timeout: 5000 }) });
    };
};