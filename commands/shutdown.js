const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data:new SlashCommandBuilder()
	    .setName('shutdown')
	    .setDescription('You don\'t know'),
}