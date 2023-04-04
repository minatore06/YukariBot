const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data:new SlashCommandBuilder()
	    .setName('submit-emoji')
	    .setDescription('Submit your own emoji!')
        .addAttachmentOption(option =>
            option.setName("emoji")
                .setDescription("The emoji to submit")
                .setRequired(true)
        )
        .setDMPermission(false),
}