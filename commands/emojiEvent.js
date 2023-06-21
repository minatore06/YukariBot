const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name:'submit-emoji',
    data:new SlashCommandBuilder()
	    .setName('submit-emoji')
	    .setDescription('Submit your own emoji!')
        .addAttachmentOption(option =>
            option.setName("emoji")
                .setDescription("The emoji to submit")
                .setRequired(true)
        )
        .setDMPermission(false),
    async execute(interaction, client, files)
    {
        let embed = {
            footer: {
                text: (await client.users.fetch(bOwner)).tag,
                icon_url: (await client.users.fetch(bOwner)).displayAvatarURL({dynamic:true})
            },
            timestamp: new Date().toISOString()
        };
        if(!interaction.options.getAttachment('emoji').contentType.startsWith('image')) return interaction.reply({content:"Wrong file type", ephemeral:true})
            let channel = await interaction.guild.channels.fetch('1092877125511561216')
            embed.author = {
                name:interaction.member.displayName,
                icon_url:interaction.member.displayAvatarURL({dynamic:true})
            }
            embed.footer.text = interaction.member.id
            embed.color = 0x00b0f4
            embed.image = {
                url: interaction.options.getAttachment('emoji').url
            }
            channel.send({embeds:[embed]})
                .then((msg) => {
                    msg.react('👍')
                    msg.react('👎')
                    interaction.reply({content:"Image sent", ephemeral:true})
                })
                .catch(err => {
                    console.log(err)
                })
    }
}