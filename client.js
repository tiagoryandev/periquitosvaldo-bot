require("dotenv").config();
require("./database/firebase.js")();

const colors = require("colors");
const Discord = require("discord.js");
const fs = require("fs");
const firebase = require("firebase");
const { sep } = require("path");

const client = new Discord.Client({ ws: { intents: new Discord.Intents().ALL } });
const database = firebase.database();
 
client.commands = new Discord.Collection({ ws: { 
    intents: new Discord.Intents(Discord.Intents.ALL) 
}});

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
        console.log(colors.blue(`[EVENTS] - O Evento ${eventName} foi carregado com sucesso;`));
    });
});

let dir = "./commands/";

fs.readdirSync(dir).forEach(dirs => {
    const commandFiles = fs.readdirSync(`${dir}${sep}${dirs}${sep}`).filter(files => files.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(`${dir}/${dirs}/${file}`);
        client.commands.set(command.name, command);
        console.log(colors.green(`[COMMANDS] - O comando ${command.name} foi carregado com sucesso;`));
    };
});

require("./modules/commandDB.js")(client, database);

client.login(process.env.TOKEN);