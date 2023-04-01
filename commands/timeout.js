const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord-api-types/v10');

module.exports = {
    data:new SlashCommandBuilder()
	    .setName('time-out')
	    .setDescription('Put in timeout your friends')
        .addUserOption(option =>
            option.setName('target')
                .setDescription("The user to timeout")
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName("time")
                .setDescription("The length of the timeout (default 1m)"))
        .addStringOption(option =>
            option.setName("unit")
                .setDescription("The duration's unit (default minutes)")
                .addChoices(
                    { name:'seconds', value:'s'},
                    { name:'minutes', value:'m'},
                    { name:'hours', value:'h'},
                    { name:'days', value:'d'}
                ))
        .addStringOption(option =>
            option.setName("reason")
            .setDescription("Punishment reason"))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
}