const process = require('node:process');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });
const ms = require('ms');
const fs = require('fs');
const { token, bOwner } = require('./config.json');

let eco = JSON.parse(fs.readFileSync('./eco.json'))
let money = []

client.on('ready', async () =>{
    console.log('Online')

})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    let commandName = interaction.commandName;
    let target;

    switch(commandName){
        case "ping":
            await interaction.reply({content:"Pong!", ephemeral: true});
            break;
        case "fluff":
            await interaction.reply("https://i.pinimg.com/originals/12/05/55/120555652bb1882e787375762b1bc012.gif")
            break;
        case "balance":
            target = interaction.options.getUser('target')
            target = target?target:interaction.user

            await interaction.reply({content:eco[target.id]+"$", ephemeral: true})
            break;
        case "time-out":
            await interaction.deferReply({ ephemeral: true });

            target = interaction.options.getMember('target');
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
        case "save":
            target = interaction.user
            if(target.id!=bOwner)return await interaction.reply({content:"Non conosci questo comando", ephemeral:true})
            await interaction.deferReply({ephemeral:true})
            fs.writeFileSync('./eco.json', JSON.stringify(eco))
            await interaction.editReply("Salvataggio completato")
            break;
        case "shutdown":
            target = interaction.user
            if(target.id!=bOwner)return await interaction.reply({content:"Non conosci questo comando", ephemeral:true})
            await interaction.reply({content:"GN", ephemeral:true})
            fs.writeFileSync('./eco.json', JSON.stringify(eco))
            client.destroy()
            process.exit(0)
            break;
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    if(!newState.channel||newState.deaf){//on disconnect or mute
        if(money[oldState.member.id])clearInterval(money[oldState.member.id])
        fs.writeFileSync('./eco.json', JSON.stringify(eco))
        return
    }
    if(!newState.channel.speakable)return;//maybe afk channel

    if(!oldState.channel || (oldState.deaf && !newState.deaf)){//on voice or unmute
        if(!eco[newState.member.id])eco[newState.member.id]=0;
        money[newState.member.id] = setInterval(() => {
            eco[newState.member.id]+= Math.floor(Math.random() * (50-10))+10;
        }, 60000);
    }
})

client.login(token)

process.on('exit', (code) => {
    fs.writeFileSync('./eco.json', JSON.stringify(eco))
});