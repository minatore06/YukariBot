const { SlashCommandBuilder } = require('@discordjs/builders');

var petsCooldown = {};

module.exports = {
    name:'own',
    data:new SlashCommandBuilder()
	    .setName('own')
	    .setDescription('Make an official request to own a pet')
        .addUserOption(option =>
            option.setName('target')
                .setDescription("The member you want to own")
                .setRequired(true))
        .setDMPermission(false),
    async execute(interaction, client, files)
    {
        let embed = {
            footer: {
                text: (await client.users.fetch(files.config.bOwner)).tag,
                icon_url: (await client.users.fetch(files.config.bOwner)).displayAvatarURL({dynamic:true})
            },
            timestamp: new Date().toISOString()
        };
        let target = interaction.options.getUser('target');

        if (petsCooldown[interaction.user.id])
            return await interaction.reply({content:`You are on cooldown, you can use it again <t:${petsCooldown[interaction.user.id] + (2 * 60 * 60)}:R>`, ephemeral:true});
        if (target.id == interaction.user.id)
            return await interaction.reply({content:"You can't own yourself", ephemeral:true});
        if (files.pets[interaction.user.id] == target.id)
            return await interaction.reply({content:"You can't own your owner", ephemeral:true});
        if (files.pets[target.id] == interaction.user.id)
            return await interaction.reply({content:`You already own ${target}`, ephemeral:true});
        if (files.pets[target.id])
            return await interaction.reply({content:`${target} is already owned`, ephemeral:true});
        let accept = new ButtonBuilder()
            .setCustomId("pet+y:"+target.id+":"+interaction.user.id)
            .setLabel("Accept")
            .setStyle(ButtonStyle.Success);
        let refuse = new ButtonBuilder()
            .setCustomId("pet+n:"+target.id+":"+interaction.user.id)
            .setLabel("Refuse")
            .setStyle(ButtonStyle.Danger);
        let row = new ActionRowBuilder()
            .addComponents(accept, refuse);

        embed.title = 'Owning request';
        embed.description = `${interaction.user} would like to own you ${target}, do you accept?`;
        embed.author = {
            name:interaction.member.displayName,
            icon_url:interaction.member.displayAvatarURL({dynamic:true})
        };
        embed.color = 0x3fdb23;
        embed.image = {
            url: "https://cdn.donmai.us/sample/1f/20/__hiroi_kikuri_and_pa_san_bocchi_the_rock_drawn_by_aoki_shizumi__sample-1f206cf81871e8acafff0fbcfaf89c4f.jpg"
        };
        await interaction.reply({embeds:[embed], components: [row]});
        petsCooldown[interaction.user.id] = Math.floor(Date.now() / 1000);
        setTimeout(() => {
            delete petsCooldown[interaction.user.id];
        }, ms('2h'));
    }
}