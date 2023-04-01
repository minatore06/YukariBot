const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data:new SlashCommandBuilder()
	    .setName('balance')
	    .setDescription('Check your wallet')
        .addUserOption(option =>
            option.setName("target")
                .setDescription("The user whos wallet you want to check")),
}