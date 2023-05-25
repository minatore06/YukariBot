const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data:new SlashCommandBuilder()
	    .setName('free')
	    .setDescription('Free a pet you don\'t want anymore')
        .addUserOption(option =>
            option.setName('target')
                .setDescription("The pet you want to free")
                .setRequired(true))
        .setDMPermission(false),
}