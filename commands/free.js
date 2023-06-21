const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name:'free',
    data:new SlashCommandBuilder()
	    .setName('free')
	    .setDescription('Free a pet you don\'t want anymore')
        .addUserOption(option =>
            option.setName('target')
                .setDescription("The pet you want to free")
                .setRequired(true))
        .setDMPermission(false),
    async execute(interaction, client, files)
    {
        let target = interaction.options.getUser('target');
        if (files.pets[target.id]){
            if (files.pets[target.id] == interaction.user.id || interaction.user.id == bOwner){
                files.pets[target.id] = null;
                interaction.reply({content:`${target} is now free`});
            } else {
                interaction.reply({content:`${target} is not your pet`, ephemeral:true});
            }
        } else {
            interaction.reply({content:`${target} is not owned`, ephemeral:true});
        }
    }
}