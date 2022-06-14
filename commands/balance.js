const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data:new SlashCommandBuilder()
	    .setName('balance')
	    .setDescription('Controlla il tuo portafoglio')
        .addUserOption(option =>
            option.setName("target")
                .setDescription("La persona il cui portafoglio vuoi controllare")),
}