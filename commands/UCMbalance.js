const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data:new ContextMenuCommandBuilder()
	    .setName('balance')
        .setType(ApplicationCommandType.User)
}