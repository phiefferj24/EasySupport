const { token, responses } = require('./config.json')
let prefix = "es:"
const { Client, Intents, MessageEmbed } = require('discord.js');
//const Reaction = require('./reactions.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
    let command = getCommandBody(message.content)
    if(command !== null && isValid(command[0])) {
        switch(command[0]) {
            case "help":
                if(isValid(command[1])) {
                    if(responses.help.hasOwnProperty(command[1])) message.reply({embeds: [responses.help[command[1]]]})
                    else message.reply("Invalid help page name!")
                }
                else {
                    message.reply({embeds: [responses.help.main]})
                }
                break
            case "config":
                if(isValid(command[1])) {
                    switch (command[1]) {
                        case "setprefix":
                            if (command[2] !== null && command[2] !== "") {
                                prefix = command[2]
                                message.reply(`Success! Prefix is now "${prefix}"`)
                            } else message.reply("Invalid prefix. Please try again.")
                    }
                }
                else {
                    message.reply("Invalid command!")
                }
                break
            case "rxn":
                message.react(/\p{Emoji}/u.test(command[1]) ? command[1] : message.guild.emojis.cache.get(command[1]))
                break
            default: message.reply("Invalid command!")
        }
    }
});

client.on('messageReactionAdd', (reaction, user) => {
    console.log(reaction.emoji.toString())
})

client.login(token);

function getCommandBody(message) {
    return message.indexOf(prefix) === -1 ? null : message.substr(prefix.length).split(" ")
}

function isValid(text) {
    return text !== null && text !== undefined && text !== ""
}