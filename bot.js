const { token } = require('./config.json')
const responses = require('./responses.json')
const { addReactions, getEmojiFromName }= require("./reactions.js")

const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS] });

let prefix = "es:"
const helpEmojis = [
    {emoji: "1️⃣", isCustom: false, onReactionAdded: (message, reaction, user) => {if(user.id !== client.user.id) message.edit({embeds: [responses.help['config']]}).then(reply => reply.reactions.removeAll())}, onReactionRemoved: (message, reaction, user) => {}},
    {emoji: "2️⃣", isCustom: false, onReactionAdded: (message, reaction, user) => {if(user.id !== client.user.id) message.edit({embeds: [responses.help['support-threads']]}).then(reply => reply.reactions.removeAll())}, onReactionRemoved: (message, reaction, user) => {}},
    {emoji: "3️⃣", isCustom: false, onReactionAdded: (message, reaction, user) => {if(user.id !== client.user.id) message.edit({embeds: [responses.help['support-tickets']]}).then(reply => reply.reactions.removeAll())}, onReactionRemoved: (message, reaction, user) => {}},
    {emoji: "4️⃣", isCustom: false, onReactionAdded: (message, reaction, user) => {if(user.id !== client.user.id) message.edit({embeds: [responses.help['reaction-roles']]}).then(reply => reply.reactions.removeAll())}, onReactionRemoved: (message, reaction, user) => {}}
]
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
});

client.on('messageCreate', message => {
    if(!message.author.bot) {
        let command = getCommandBody(message.content)
        if(command !== null && isValid(command[0])) {
            switch(command[0]) {
                case "help":
                    if(isValid(command[1])) {
                        if(responses.help.hasOwnProperty(command[1])) {
                            message.reply({embeds: [responses.help[command[1]]]}).then(reply => {if(command[1] === "main") addReactions(client, reply, helpEmojis)})
                        }
                        else message.reply("Invalid help page name!")
                    }
                    else {
                        message.reply({embeds: [responses.help.main]}).then(reply => {addReactions(client, reply, helpEmojis)})
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
                default: message.reply("Invalid command!")
            }
        }
    }
})

client.login(token)

function getCommandBody(message) {
    return message.indexOf(prefix) === -1 ? null : message.substr(prefix.length).split(" ")
}

function isValid(text) {
    return text !== null && text !== undefined && text !== ""
}