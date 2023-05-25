const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data:new SlashCommandBuilder()
	    .setName('own')
	    .setDescription('Make an official request to own a pet')
        .addUserOption(option =>
            option.setName('target')
                .setDescription("The member you want to own")
                .setRequired(true))
        .setDMPermission(false),
}