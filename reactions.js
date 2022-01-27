function addReactions(client, message, reactions) {
    reactions.forEach(reaction => {
        message.react(reaction.isCustom ? getEmojiFromName(message.guild, reaction.emoji) : reaction.emoji).catch(() => message.channel.send(`Invalid emoji: ${reaction.emoji}`))
    })
    client.on('messageReactionAdd', (addedReaction, user) => {
        reactions.forEach(reaction => {
            if(addedReaction.emoji.name === reaction.emoji) reaction.onReactionAdded(message, addedReaction, user)
        })
    })
    client.on('messageReactionRemove', (removedReaction, user) => {
        reactions.forEach(reaction => {
            if(removedReaction.emoji.name === reaction.emoji) reaction.onReactionRemoved(message, removedReaction, user)
        })
    })
}

function getEmojiFromName(client, name) {
    let emoji = client.emojis.cache.find(emoji => emoji.name === name)
    if(emoji === null || emoji === undefined) emoji = client.emojis.cache.find(emoji => emoji.id === name)
    if(emoji === null || emoji === undefined) emoji = client.emojis.cache.find(emoji => emoji.identifier === name)
    if(emoji === null || emoji === undefined) emoji = client.emojis.cache.find(emoji => emoji.toString() === name)
    return emoji
}
module.exports = { addReactions, getEmojiFromName }