const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name:'list-pets',
    data:new SlashCommandBuilder()
	    .setName('list-pets')
	    .setDescription('Show all the pets owned')
        .addUserOption(option =>
            option.setName('target')
                .setDescription("The owner you want to list pets")
                .setRequired(false))
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
        let target = interaction.options.getUser('target');
        let i;
        let s = "";
        let ss = "";
        let owners = {};
        let fields = [];

        Object.keys(files.pets).forEach(pet => {
            if (target && files.pets[pet] != target.id)
                return;
            if (!files.pets[pet])
                return;
            if (!owners[files.pets[pet]])
                owners[files.pets[pet]] = [];
            owners[files.pets[pet]].push(pet);
        });
        for (const owner of Object.keys(owners)) {
            i = 0;
            while (owners[owner][i]) {
                try {
                    s += `|>${await interaction.guild.members.fetch(owners[owner][i])}\n`;
                } catch (error) {
                    s += ``
                }
                i++;
            }
            try {
                ss = await interaction.guild.members.fetch(owner);
                ss = ss.displayName;
            } catch (error) {
                ss = "Lost Owner";
                if (owner == "646749309773152260")
                    ss = "Jungyl :(";
            }
            fields.push({ name: `${ss}`, value: s });
            s = "";
        }
        embed.title = 'Pets list';
        embed.fields = fields;
        embed.color = 0x130be6;
        console.log(fields);
        if (!fields.length)
            return await interaction.reply({content:`${target?target:"Everyone"} has no pets`, ephemeral:true});
        await interaction.reply({embeds:[embed]});
    }
}