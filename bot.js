const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
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
    }
});

client.login(token)