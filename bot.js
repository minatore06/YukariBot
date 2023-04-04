const process = require('node:process');
const { spawn } = require('child_process');
const { Client, GatewayIntentBits, MessageEmbed } = require('discord.js');
const ms = require('ms');
const fs = require('fs');
const { token, bOwner } = require('./config.json');
const gConfig = require('./gConfig.json');

const client = new Client({ intents: [GatewayIntentBits.GuildPresences, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildVoiceStates] });

let eco = JSON.parse(fs.readFileSync('./eco.json'))
let shop = JSON.parse(fs.readFileSync('./shop.json'))
let money = []
var videos = ["https://www.youtube.com/watch?v=sAn7baRbhx4", "https://www.youtube.com/watch?v=VqB1uoDTdKM", "https://www.youtube.com/watch?v=olOfpzW50P8", "https://www.youtube.com/watch?v=bZe5J8SVCYQ", "https://www.youtube.com/watch?v=GjrrLtjeUVw", "https://www.youtube.com/watch?v=sfHvgPJPMXk", "https://www.youtube.com/watch?v=SmUC_kSw6eY", "https://www.youtube.com/watch?v=Jl6lee2wyPQ", "https://www.youtube.com/watch?v=nlLhw1mtCFA", "https://www.youtube.com/watch?v=ttCHb-MNIFE", "https://www.youtube.com/watch?v=dbn-QDttWqU", "https://www.youtube.com/watch?v=cn4M-fH08XY", "https://www.youtube.com/watch?v=mYb4UvVpaS8", "https://youtu.be/UIp6_0kct_U", "https://youtu.be/p88uRZ5zYMA", "https://youtu.be/JNz0ng19kuw", "https://youtu.be/VqkKokT5RpY", "https://youtu.be/K8T6Y7K-esM"]
var music = ["https://www.youtube.com/watch?v=Q9WcG0OMElo", "https://www.youtube.com/watch?v=12vh55_1ul8", "https://www.youtube.com/watch?v=f7tMeBGxIw4", "https://www.youtube.com/watch?v=0XFudmaObLI", "https://www.youtube.com/watch?v=FtutLA63Cp8", "https://www.youtube.com/watch?v=TKfS5zVfGBc", "https://www.youtube.com/watch?v=bAn6C4p7mAE", "https://www.youtube.com/watch?v=2Od7QCsyqkE", "https://www.youtube.com/watch?v=WUjxaXg8QKE", "https://www.youtube.com/watch?v=VEe_yIbW64w", "https://www.youtube.com/watch?v=IHENIg8Se7M", "https://www.youtube.com/watch?v=UnIhRpIT7nc", "https://www.youtube.com/watch?v=tyneiz9FRMw", "https://www.youtube.com/watch?v=7UubKYqEy3s", "https://www.youtube.com/watch?v=_VH91mivTUw", "https://www.youtube.com/watch?v=sToRddIV7kU", "https://www.youtube.com/watch?v=dyKdLLQP5PI", "https://www.youtube.com/watch?v=bl7W-sU-MKI", "https://www.youtube.com/watch?v=ioQLlX2ELbg", "https://youtu.be/6d-28nn_gpA", "https://youtu.be/-kBQ6lHKTEc", "https://youtu.be/qNIhngowViI", "https://youtu.be/--41OGPMurU", "https://youtu.be/8UVNT4wvIGY", "https://youtu.be/piEyKyJ4pFg", "https://youtu.be/Jrg9KxGNeJY", "https://youtu.be/tnAoq3_6f5M", "https://youtu.be/TwIssYH2Gyw", "https://youtu.be/z6EQlZaB7v8"]

function activityLoop(){
    setTimeout(() => {
        client.user.setActivity("There's no /help",{type:'LISTENING'})
        client.user.setStatus("online")

        setTimeout(() => {
          client.user.setActivity("prefix-> /", { type: "WATCHING" })

            setTimeout(() => {
                client.user.setActivity("with Mina#3690",{type:'PLAYING'})
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
    client.user.setActivity("Starting...",{type:'COMPETING'})
    activityLoop();
})

client.on('guildCreate', async guild => {
    if(!gConfig[guild.id])gConfig[guild.id] = {}
    if(!gConfig[guild.id]["memberBackup"])gConfig[guild.id]["memberBackup"] = {}
    if(!gConfig[guild.id]["modules"])gConfig[guild.id]["modules"] = {"stickyRoles":false}
    fs.writeFileSync('./gConfig.json', JSON.stringify(gConfig))
})

client.on('guildMemberAdd', async member => {
    let memberRoles = gConfig[member.guild.id]["memberBackup"][member.id]["roles"]
    let nickname = gConfig[member.guild.id]["memberBackup"][member.id]["nickname"]
    console.log(memberRoles)
    memberRoles.forEach(role => {
        member.roles.add(role, "Sticky roles")
            .catch(console.error)
    });
    member.setNickname(nickname)
        .catch(console.error)
})

client.on('guildMemberRemove', async member => {
    let memberRoles = member.roles.cache
        .filter((roles) => roles.id !== member.guild.id)
        .map((role) => role.id)
    gConfig[member.guild.id]["memberBackup"][member.id] = {}
    gConfig[member.guild.id]["memberBackup"][member.id]["roles"] = memberRoles
    gConfig[member.guild.id]["memberBackup"][member.id]["nickname"] = member.nickname
    fs.writeFileSync('./gConfig.json', JSON.stringify(gConfig))
})

client.on('interactionCreate', async interaction => {
    let commandName = interaction.commandName;
    let target;
    let channel;
    let embed = {
        footer: {
            text: (await client.users.fetch(bOwner)).tag,
            icon_url: (await client.users.fetch(bOwner)).displayAvatarURL({dynamic:true})
        },
        timestamp: new Date().toISOString()
    };

    if(interaction.isAutocomplete()){
        let focused = interaction.options.getFocused(true)

        switch (focused.name) {
            case "item":
                let choices = Object.keys(shop)
                await interaction.respond(choices.map(choice => ({name:choice, value:choice})))
                    .catch((err) => console.log(err))
                break;
        }
    }

    else if (interaction.isChatInputCommand()){
        switch (commandName) {
            case "submit-emoji":
                if(!interaction.options.getAttachment('emoji').contentType.startsWith('image')) return interaction.reply({content:"Wrong file type", ephemeral:true})
                channel = await interaction.guild.channels.fetch('1092877125511561216')
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
                break;
        }
    }

    else if(interaction.isUserContextMenu())
    {

        switch(commandName){
            case "timeout":
                await interaction.deferReply({ ephemeral: true });
                target = interaction.targetMember

                if(!target.moderatable)
                    return await interaction.editReply("I don't have enough permissions");

                await target.disableCommunicationUntil(Date.now()+(ms('1m')), "Quick moderation action")
                .then(await interaction.editReply("Timeout succeded"))
                .catch(async(err) => {
                    console.log(err)
                    await interaction.editReply(err)
                    return;
                })

                embed.title = 'Moderation notify'
                embed.author = {
                    name: interaction.guild.name,
                    icon_url: interaction.guild.iconURL({dynamic:true})
                }
                embed.color = 0xFF8F00
                embed.description = "You got timeouted for 1 minute, this is a rapid action"
                target.send({ embeds: [embed] });

                embed.author = {
                    name: interaction.user.tag,
                    icon_url: interaction.user.displayAvatarURL({dynamic:true})
                }
                embed.description = `User: ${target},\ngot timeouted for \`1 minute\`,\nmoderator: ${interaction.user},\nreason: \`rapid action\``
                if(gConfig[interaction.guildId]["log-channel"]){
                    await (await client.channels.fetch(gConfig[interaction.guildId]["log-channel"])).send({embeds:[embed]})
                }
                break;
            case "balance":
                target = interaction.targetMember

                if(!eco[target.id])await interaction.reply({content:"User doesn't have an account yet", ephemeral: true})
                else await interaction.reply({content:eco[target.id]+"$", ephemeral: true})
                break;
        }
    }

    else if (interaction.isCommand())
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
                if(!eco[target.id])await interaction.reply({content:"User doesn't have an account yet", ephemeral: true})
                else await interaction.reply({content:eco[target.id]+"$", ephemeral: true})
                break;
            case "shop":
                embed = new MessageEmbed()
                    .setColor('#29ff62')
                    .setTitle('Epic Shop')
                    .setDescription('Buy our incredibles gadgets')
                    .setFooter({text:'Mina#3690', iconURL:'https://i.pinimg.com/originals/12/05/55/120555652bb1882e787375762b1bc012.gif'})
                
                let item = interaction.options.getString('item')
                if(item&&shop[item]){
                    embed.setTitle(item)
                        .setDescription(`${shop[item].description}\n${shop[item].price}$${shop[item].quantita?"\n"+shop[item].quantita+" available":""}\n${shop[item].consumable?"Consunable":"Unic"}`)
                    
                    if(shop[item].image)embed.setThumbnail(shop[item].image)
                }else{
                    Object.keys(shop).forEach(item => {
                        embed.addField(item+" - "+shop[item].price+"$", `${shop[item].description} | ${shop[item].quantita?shop[item].quantita+" available":""}`)
                    });
                }

                await interaction.reply({embeds:[embed]})
                break;
            case "time-out":
                await interaction.deferReply({ ephemeral: true });

                target = interaction.options.getMember('target');
                let durata = interaction.options.getInteger('time');
                durata = durata?durata:1;
                let unita = interaction.options.getString('unit');
                unita = unita?unita:'m';
                let reason = interaction.options.getString('reason');
                reason = reason?reason:'';

                if(!target.moderatable)
                    return await interaction.editReply("I don't have enough permissions");

                await target.disableCommunicationUntil(Date.now()+(ms(durata+unita)), reason)
                .then(await interaction.editReply("Timeout succeded"))
                .catch(async(err) => {
                    console.log(err)
                    await interaction.editReply(err)
                    return;
                })

                embed.title = 'Moderation notify'
                embed.author = {
                    name: interaction.guild.name,
                    icon_url: interaction.guild.iconURL({dynamic:true})
                }
                embed.color = 0xFF8F00
                embed.description = `You got timeouted ${durata}${unita}, reason: \`${reason}\``
                target.send({ embeds: [embed] });

                embed.author = {
                    name: interaction.user.tag,
                    icon_url: interaction.user.displayAvatarURL({dynamic:true})
                }
                embed.description = `User: ${target},\ngot timeouted for \`${durata}${unita}\`,\nmoderator: ${interaction.user},\nreason: \`${reason}\``
                
                if(gConfig[interaction.guildId]["log-channel"]){
                    await (await client.channels.fetch(gConfig[interaction.guildId]["log-channel"])).send({embeds:[embed]})
                }
                break;
            case "set-log":
                let logchan = interaction.options.getChannel('log-channel')

                if(!logchan.isText())
                {
                    interaction.reply({content: "Invalid channel", ephemeral:true})
                    break;
                }
                await logchan.sendTyping()
                .then(() => {
                    gConfig[interaction.guildId]["log-channel"] = logchan.id
                    interaction.reply({content:`Log channel set as ${logchan}`, ephemeral:true})    
                })
                .catch(() => {
                    interaction.reply({content:`I can't write in that channel`, ephemeral:true})
                })
                break;
            case "save":
                target = interaction.user
                if(target.id!=bOwner)return await interaction.reply({content:"El psy kongroo!", ephemeral:true})
                await interaction.deferReply({ephemeral:true})
                fs.writeFileSync('./eco.json', JSON.stringify(eco))
                fs.writeFileSync('./gConfig.json', JSON.stringify(gConfig))
                await interaction.editReply("Save complete")
                break;
            case "restart":
                target = interaction.user
                if(target.id!=bOwner)return await interaction.reply({content:"El psy kongroo!", ephemeral:true})
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
                console.log("Restarting")
                process.exit(0)
                break
            case "shutdown":
                target = interaction.user
                if(target.id!=bOwner)return await interaction.reply({content:"El psy kongroo!", ephemeral:true})
                await interaction.reply({content:"GN", ephemeral:true})
                fs.writeFileSync('./eco.json', JSON.stringify(eco))
                console.log("Shutted down")
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