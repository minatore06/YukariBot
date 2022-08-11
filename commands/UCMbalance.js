const { ContextMenuCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data:new ContextMenuCommandBuilder()
	    .setName('balance')
        .setType(2)
}