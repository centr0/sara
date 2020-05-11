const Discord = require('discord.js');
const client = new Discord.Client();
const {prefix, devToken, prodToken} = require('../config.json');
const CommandHandler = require('./CommandHandler/CommandHandler.js');
const TimeHandler = require('./TimeHandler/TimeHandler.js');
const EmbedHandler = require('./EmbedHandler/EmbedHandler.js');
const StockModel = require('./StockModel/StockModel.js');
const env = process.env.NODE_ENV || "development";
let token = "";

if (env === "production") {
    token = prodToken;
} else {
    token = devToken;
}

client.once('ready', () => {
    console.log('SARA is operational on ' + env + '...');
    const updateChannel = client.channels.cache.filter(x => x.type === 'text' && x.name === 'updates').first();
    client.setInterval(() => {
        // 10 min alert
        if (TimeHandler.isMarketTenTillOpen()) {
            client.channels.cache.get(updateChannel.id).send(EmbedHandler.getTenToMarketOpenMessage());
        }

        // market open alert
        if (TimeHandler.isMarketOpen()) {
            client.channels.cache.get(updateChannel.id).send(EmbedHandler.getMarketOpenMessage());
        }
    }, 1000);
});

client.on('message', message => {
    // guard
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    // handle commands
    CommandHandler.handleCommand(command, message, args);
});

client.login(token);