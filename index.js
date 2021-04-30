require("dotenv").config();

const Discord = require("discord.js");
const colors = require("colors");
const express = require("express");
const app = express();
const port = process.env.PORT || 8081;

app.get("/", (request, response) => {
    response.status(200).json({
        status: 200
    });
});

const manager = new Discord.ShardingManager("./client.js", { 
    token: process.env.TOKEN, 
    totalShards: "auto"
});

manager.on("shardCreate", shard => {
    console.log(colors.grey(`[SHARD-MANAGER] - Shard ${shard.id} foi criado e carregado com Sucesso!`));
});

manager.spawn();

app.listen(port, () => {
    console.log(colors.yellow(`[SERVER] - Servidor Iniciado na Porta ${port} com Sucesso!`))
});