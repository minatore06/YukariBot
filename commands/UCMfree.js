const { ContextMenuCommandBuilder, ApplicationCommandType } = require('@discordjs/builders');

module.exports = {
    data:new ContextMenuCommandBuilder()
        .setName('free')
        .setType(2)
        .setDMPermission(false)
}