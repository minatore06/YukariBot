const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data:new SlashCommandBuilder()
	    .setName('list-pets')
	    .setDescription('Show all the pets owned')
        .addUserOption(option =>
            option.setName('target')
                .setDescription("The owner you want to list pets")
                .setRequired(false))
        .setDMPermission(false),
}