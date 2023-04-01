const process = require('node:process');
const { spawn } = require('child_process');
const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });
const ms = require('ms');
const fs = require('fs');
const { token, bOwner } = require('./config.json');
const gConfig = require('./gConfig.json');

let eco = JSON.parse(fs.readFileSync('./eco.json'))
let shop = JSON.parse(fs.readFileSync('./shop.json'))
let money = []
var videos = ["https://www.youtube.com/watch?v=sAn7baRbhx4", "https://www.youtube.com/watch?v=VqB1uoDTdKM", "https://www.youtube.com/watch?v=olOfpzW50P8", "https://www.youtube.com/watch?v=bZe5J8SVCYQ", "https://www.youtube.com/watch?v=GjrrLtjeUVw", "https://www.youtube.com/watch?v=sfHvgPJPMXk", "https://www.youtube.com/watch?v=SmUC_kSw6eY", "https://www.youtube.com/watch?v=Jl6lee2wyPQ", "https://www.youtube.com/watch?v=nlLhw1mtCFA", "https://www.youtube.com/watch?v=ttCHb-MNIFE", "https://www.youtube.com/watch?v=dbn-QDttWqU", "https://www.youtube.com/watch?v=cn4M-fH08XY", "https://www.youtube.com/watch?v=mYb4UvVpaS8"]
var music = ["https://www.youtube.com/watch?v=Q9WcG0OMElo", "https://www.youtube.com/watch?v=12vh55_1ul8", "https://www.youtube.com/watch?v=f7tMeBGxIw4", "https://www.youtube.com/watch?v=0XFudmaObLI", "https://www.youtube.com/watch?v=5zo7BYoaqAA", "https://www.youtube.com/watch?v=60mLvBWOMb4", "https://www.youtube.com/watch?v=FtutLA63Cp8", "https://www.youtube.com/watch?v=TKfS5zVfGBc", "https://www.youtube.com/watch?v=bAn6C4p7mAE", "https://www.youtube.com/watch?v=2Od7QCsyqkE", "https://www.youtube.com/watch?v=WUjxaXg8QKE", "https://www.youtube.com/watch?v=VEe_yIbW64w", "https://www.youtube.com/watch?v=IHENIg8Se7M", "https://www.youtube.com/watch?v=UnIhRpIT7nc", "https://www.youtube.com/watch?v=tyneiz9FRMw", "https://www.youtube.com/watch?v=7UubKYqEy3s", "https://www.youtube.com/watch?v=_VH91mivTUw", "https://www.youtube.com/watch?v=sToRddIV7kU", "https://www.youtube.com/watch?v=dyKdLLQP5PI", "https://www.youtube.com/watch?v=bl7W-sU-MKI", "https://www.youtube.com/watch?v=ioQLlX2ELbg"]

function activityLoop(){
    setTimeout(() => {
        client.user.setActivity("/help non implementato",{type:'LISTENING'})
        client.user.setStatus("online")

        setTimeout(() => {
          client.user.setActivity("prefix-> /", { type: "WATCHING" })

            setTimeout(() => {
                client.user.setActivity("con Mina#3690",{type:'PLAYING'})
                client.user.setStatus("dnd")

                setTimeout(() => {
                    let ar = videos.concat(music)
                    let rId = Math.floor(Math.random()*ar.length)
                    client.user.setActivity("yooooooo",{type:'STREAMING', url:ar[rId]})

                    activityLoop();
                }, 60000);
            }, 60000);
        }, 30000);
    }, 30000);
}

client.on('ready', async () => {
    console.log('Online')
    client.user.setActivity("Avviando...",{type:'COMPETING'})
    activityLoop();
})

client.on('guildCreate', async guild => {
    if(!gConfig[guild.id])gConfig[guild.id] = {}
    if(!gConfig[guild.id]["memberRoles"])gConfig[guild.id]["memberRoles"] = {}
    fs.writeFileSync('./gConfig.json', JSON.stringify(gConfig))
})

client.on('guildMemberRemove', async member => {
    gConfig[guild.id]["memberRoles"][member.id] = member.roles.cache
    console.log(gConfig[guild.id]["memberRoles"][member.id])
})

client.on('interactionCreate', async interaction => {
    let commandName = interaction.commandName;
    let target;
    let embed = {
        footer: {
            text: (await client.users.fetch(bOwner)).tag,
            icon_url: (await client.users.fetch(bOwner)).displayAvatarURL({dynamic:true})
        },
        timestamp: new Date().toISOString()
    };

    if(interaction.isAutocomplete()){
        let choices = Object.keys(shop)
        await interaction.respond(choices.map(choice => ({name:choice, value:choice})))
    }

    if(interaction.isUserContextMenu())
    {

        switch(commandName){
            case "timeout":
                await interaction.deferReply({ ephemeral: true });
                target = interaction.targetMember

                if(!target.moderatable)
                    return await interaction.editReply("Permessi insufficienti");

                await target.disableCommunicationUntil(Date.now()+(ms('1m')), "Quick moderation action")
                .then(await interaction.editReply("Timeout avvenuto con successo"))
                .catch(async(err) => {
                    console.log(err)
                    await interaction.editReply(err)
                    return;
                })

                embed.title = 'Notifica di moderazione'
                embed.author = {
                    name: interaction.guild.name,
                    icon_url: interaction.guild.iconURL({dynamic:true})
                }
                embed.color = 0xFF8F00
                embed.description = "Sei stato messo in timeout per 1 minuto, questa è un'azione rapida"
                target.send({ embeds: [embed] });

                embed.author = {
                    name: interaction.user.tag,
                    icon_url: interaction.user.displayAvatarURL({dynamic:true})
                }
                embed.description = `L'utente: ${target},\nè stato messo in timeout per \`1 minuto\`,\nmoderatore: ${interaction.user},\nmotivo: \`azione rapida\``
                if(gConfig[interaction.guildId]["log-channel"]){
                    await (await client.channels.fetch(gConfig[interaction.guildId]["log-channel"])).send({embeds:[embed]})
                }
                break;
            case "balance":
                target = interaction.targetMember

                if(!eco[target.id])await interaction.reply({content:"L'utente non ha ancora un conto", ephemeral: true})
                else await interaction.reply({content:eco[target.id]+"$", ephemeral: true})
                break;
        }
    }

    if (interaction.isCommand())
    {

        switch(commandName){
            case "ping":
                let sent = await interaction.reply({content:`Pong!`, ephemeral: true});
                interaction.editReply(`Heartbeat: ${client.ws.ping}ms`/* , Lantency: ${sent.createdTimestamp - interaction.createdTimestamp}ms */)
                break;
            case "fluff":
                await interaction.reply("https://i.pinimg.com/originals/12/05/55/120555652bb1882e787375762b1bc012.gif")
                break;
            case "balance":
                target = interaction.options.getUser('target')
                target = target?target:interaction.user
                if(!eco[target.id])await interaction.reply({content:"L'utente non ha ancora un conto", ephemeral: true})
                else await interaction.reply({content:eco[target.id]+"$", ephemeral: true})
                break;
            case "shop":
                embed = new MessageEmbed()
                    .setColor('#29ff62')
                    .setTitle('Shop epico')
                    .setDescription('Acquista i nostri incredibili gadget')
                    .setFooter({text:'Mina#3690', iconURL:'https://i.pinimg.com/originals/12/05/55/120555652bb1882e787375762b1bc012.gif'})
                
                let item = interaction.options.getString('item')
                if(item&&shop[item]){
                    embed.setTitle(item)
                        .setDescription(`${shop[item].description}\n${shop[item].price}$${shop[item].quantita?"\n"+shop[item].quantita+" disponibili":""}\n${shop[item].consumable?"Consumabile":"Unico"}`)
                    
                    if(shop[item].image)embed.setThumbnail(shop[item].image)
                }else{
                    Object.keys(shop).forEach(item => {
                        embed.addField(item+" - "+shop[item].price+"$", `${shop[item].description} | ${shop[item].quantita?shop[item].quantita+" disponibili":""}`)
                    });
                }

                await interaction.reply({embeds:[embed]})
                break;
            case "time-out":
                await interaction.deferReply({ ephemeral: true });

                target = interaction.options.getMember('target');
                let durata = interaction.options.getInteger('time');
                durata = durata?durata:1;
                let unita = interaction.options.getString('unita');
                unita = unita?unita:'m';
                let reason = interaction.options.getString('motivo');
                reason = reason?reason:'';

                if(!target.moderatable)
                    return await interaction.editReply("Permessi insufficienti");

                await target.disableCommunicationUntil(Date.now()+(ms(durata+unita)), reason)
                .then(await interaction.editReply("Timeout avvenuto con successo"))
                .catch(async(err) => {
                    console.log(err)
                    await interaction.editReply(err)
                    return;
                })

                embed.title = 'Notifica di moderazione'
                embed.author = {
                    name: interaction.guild.name,
                    icon_url: interaction.guild.iconURL({dynamic:true})
                }
                embed.color = 0xFF8F00
                embed.description = `Sei stato messo in timeout per ${durata}${unita}, motivo: \`${reason}\``
                target.send({ embeds: [embed] });

                embed.author = {
                    name: interaction.user.tag,
                    icon_url: interaction.user.displayAvatarURL({dynamic:true})
                }
                embed.description = `L'utente: ${target},\nè stato messo in timeout per \`${durata}${unita}\`,\nmoderatore: ${interaction.user},\nmotivo: \`${reason}\``
                
                if(gConfig[interaction.guildId]["log-channel"]){
                    await (await client.channels.fetch(gConfig[interaction.guildId]["log-channel"])).send({embeds:[embed]})
                }
                break;
            case "set-log":
                let logchan = interaction.options.getChannel('log-channel')

                if(!logchan.isText())
                {
                    interaction.reply({content: "Stanza non valida", ephemeral:true})
                    break;
                }
                await logchan.sendTyping()
                .then(() => {
                    gConfig[interaction.guildId]["log-channel"] = logchan.id
                    interaction.reply({content:`Log channel impostato a ${logchan}`, ephemeral:true})    
                })
                .catch(() => {
                    interaction.reply({content:`Non ho il permesso di scrivere nella stanza`, ephemeral:true})
                })
                break;
            case "save":
                target = interaction.user
                if(target.id!=bOwner)return await interaction.reply({content:"Non conosci questo comando", ephemeral:true})
                await interaction.deferReply({ephemeral:true})
                fs.writeFileSync('./eco.json', JSON.stringify(eco))
                fs.writeFileSync('./gConfig.json', JSON.stringify(gConfig))
                await interaction.editReply("Salvataggio completato")
                break;
            case "restart":
                target = interaction.user
                if(target.id!=bOwner)return await interaction.reply({content:"Non conosci questo comando", ephemeral:true})
                await interaction.reply({content:"Restarting...", ephemeral:true})
                fs.writeFileSync('./eco.json', JSON.stringify(eco))
                client.destroy()
                process.on("exit", function () {
                    spawn('./update.sh',
                    {
                        cwd: process.cwd(),
                        detached: true,
                        stdio: "inherit"
                    })
                });
                process.exit(0)
                break
            case "shutdown":
                target = interaction.user
                if(target.id!=bOwner)return await interaction.reply({content:"Non conosci questo comando", ephemeral:true})
                await interaction.reply({content:"GN", ephemeral:true})
                fs.writeFileSync('./eco.json', JSON.stringify(eco))
                client.destroy()
                process.exit(0)
                break;
        }
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

client.on('error', err => {
    fs.writeFileSync('./err.log', err)
})

process.on('uncaughtException', (err, origin) => {
    fs.writeFileSync('./err.log', err.message)
});

process.on('exit', (code) => {
    fs.writeFileSync('./eco.json', JSON.stringify(eco))
    fs.writeFileSync('./gConfig.json', JSON.stringify(gConfig))
});