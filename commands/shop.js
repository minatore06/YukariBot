const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name:'shop',
    data:new SlashCommandBuilder()
	    .setName('shop')
	    .setDescription('Show the shop')
        .addStringOption(option => 
            option.setName('item')
                .setDescription('The object in the shop you want to get more informations')
                .setAutocomplete(true)
            ),
    async execute(interaction, client, files)
    {
        let embed = new EmbedBuilder()
        .setColor(0x29ff62)
        .setTitle('Epic Shop')
        .setDescription('Buy our incredibles gadgets')
        .setFooter({text:'Mina#3690', iconURL:'https://i.pinimg.com/originals/12/05/55/120555652bb1882e787375762b1bc012.gif'})

        let item = interaction.options.getString('item')
        if(item&&files.shop[item]){
            embed.setTitle(item)
            .setDescription(`${files.shop[item].description}\n${files.shop[item].price}$${files.shop[item].quantita?"\n"+files.shop[item].quantita+" available":""}\n${files.shop[item].consumable?"Consumable":"Unic"}`)
            
            if(files.shop[item].image)embed.setThumbnail(files.shop[item].image)
        }else{
            Object.keys(files.shop).forEach(item => {
                embed.addFields({name: item+" - "+files.shop[item].price+"$", value: `${files.shop[item].description} | ${files.shop[item].quantita?files.shop[item].quantita+" available":""}`})
            });
        }
        
        await interaction.reply({embeds:[embed]})
    }
}