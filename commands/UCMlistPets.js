const { ContextMenuCommandBuilder, ApplicationCommandType } = require('@discordjs/builders');

module.exports = {
    data:new ContextMenuCommandBuilder()
        .setName('list-pets')
        .setType(2)
        .setDMPermission(false)
}