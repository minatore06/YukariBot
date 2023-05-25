const { ContextMenuCommandBuilder, ApplicationCommandType } = require('@discordjs/builders');

module.exports = {
    data:new ContextMenuCommandBuilder()
        .setName('own')
        .setType(2)
        .setDMPermission(false)
}