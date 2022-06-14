const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord-api-types/v10');

module.exports = {
    data:new SlashCommandBuilder()
	    .setName('time-out')
	    .setDescription('Metti in attesa un tuo amico')
        .addUserOption(option =>
            option.setName('target')
                .setDescription("L'utente da mutare")
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName("time")
                .setDescription("La durata del time-out (default 1m)"))
        .addStringOption(option =>
            option.setName("unita")
                .setDescription("L'unità di misura della durata (default minuti)")
                .addChoices(
                    { name:'secondi', value:'s'},
                    { name:'minuti', value:'m'},
                    { name:'ore', value:'h'},
                    { name:'giorni', value:'d'}
                ))
        .addStringOption(option =>
            option.setName("motivo")
            .setDescription("Il motivo della punizione"))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
}