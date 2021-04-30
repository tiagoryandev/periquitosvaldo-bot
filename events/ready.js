const colors = require("colors");

module.exports = async (client) => {
    const ping = new Date();
    ping.setHours(ping.getHours() - 3);

    let status = [
        { name: `[v1.0] - Periquitosvaldo!`, type: 'WATCHING' },
        { name: `[Vote] - Use Upvote para me apoiar!`, type: 'WATCHING' }
    ];

    function setStatus() {
        let randomStatus = status[Math.floor(Math.random() * status.length)]
        client.user.setPresence({ activity: randomStatus })
    };

    setStatus();
    setInterval(() => setStatus(), 5000);

    console.log(colors.green(`[LOGIN] - O Bot ${client.user.tag} foi inicializada com Sucesso!`));
};