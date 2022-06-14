const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const ms = require('ms')
const { token } = require('./config.json');

client.on('ready', async () =>{
    console.log('Online')

})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
	
    let commandName = interaction.commandName;

    switch(commandName){
        case "ping":
            await interaction.reply({content:"Pong!", ephemeral: true});
            break;
        case "fluff":
            await interaction.reply("https://i.pinimg.com/originals/12/05/55/120555652bb1882e787375762b1bc012.gif")
            break;
        case "time-out":
            await interaction.deferReply({ ephemeral: true });

            let target = interaction.options.getMember('target');
            let durata = interaction.options.getInteger('time');
            durata = durata?durata:1;
            let unita = interaction.options.getString('unita');
            unita = unita?unita:'m';
            let reason = interaction.options.getString('reason');

            if(!target.moderatable)
                return await interaction.editReply("Permessi insufficienti");

            await target.disableCommunicationUntil(Date.now()+(ms(durata+unita)), reason)
            .then(await interaction.editReply("Timeout avvenuto con successo"))
            .catch(async(err) => {
                console.log(err)
                await interaction.editReply(err)
                return;
            })

            break;
    }
});

client.login(token)