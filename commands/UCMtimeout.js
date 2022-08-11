const { ContextMenuCommandBuilder, ApplicationCommandType } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord-api-types/v10');

module.exports = {
    data:new ContextMenuCommandBuilder()
        .setName('timeout')
        .setType(2)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
}