require('dotenv').config();

const firebase = require("firebase");
const colors = require("colors");

module.exports = async () => {
    let configF = {
        apiKey: process.env.FB_API_KEY,
        authDomain: process.env.FB_AUTH_DOMAIN,
        databaseURL: process.env.FB_DATABASE_URL,
        projectId: process.env.FB_PROJECT_ID,
        storageBucket: process.env.FB_STORE_BUCKET,
        messagingSenderId: process.env.FB_MESSAGE_SEND_ID,
        appId: process.env.FB_APP_ID
    };

    try {
        firebase.initializeApp(configF);
        console.log(colors.yellow(`[DATABASE] - Firebase Realtime conectado com sucesso!`));
    } catch (error) {
        return console.log(colors.red(`[DATABASE] - Firebase Realtime não foi conectado devido ao erro: ${error}`));
    };
};