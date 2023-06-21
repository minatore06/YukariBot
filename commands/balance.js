const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name:'balance',
    data:new SlashCommandBuilder()
	    .setName('balance')
	    .setDescription('Check your wallet')
        .addUserOption(option =>
            option.setName("target")
                .setDescription("The user whos wallet you want to check")),
    async execute(interaction, client, files)
    {
        let target = interaction.options.getUser('target');
        target = target?target:interaction.user;
        if(!files.eco[target.id])await interaction.reply({content:"User doesn't have an account yet", ephemeral: true});
        else await interaction.reply({content:files.eco[target.id]+"$", ephemeral: true});
    }
}