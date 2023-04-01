const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord-api-types/v10');

module.exports = {
    data:new SlashCommandBuilder()
	    .setName('set-log')
	    .setDescription('Set the channel for logs')
        .addChannelOption(option =>
            option.setName('log-channel')
            .setDescription('The channel where the bot will send logs')
            .setRequired(true))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
}