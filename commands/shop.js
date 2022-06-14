const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data:new SlashCommandBuilder()
	    .setName('shop')
	    .setDescription('Mostra lo shop')
        .addStringOption(option => 
            option.setName('item')
                .setDescription('Oggetto dello shop di cui si vuole ottenere maggiori informazioni')
                .setAutocomplete(true)
            ), 
}