const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data:new SlashCommandBuilder()
	    .setName('shop')
	    .setDescription('Show the shop')
        .addStringOption(option => 
            option.setName('item')
                .setDescription('The object in the shop you want to get more informations')
                .setAutocomplete(true)
            ), 
}