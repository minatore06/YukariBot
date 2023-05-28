const process = require('node:process');
const { spawn } = require('child_process');
const { Client, GatewayIntentBits, ActivityType, ButtonStyle } = require('discord.js');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders');
const ms = require('ms');
const fs = require('fs');
const { token, bOwner } = require('./config.json');
const gConfig = require('./gConfig.json');

const client = new Client({ intents: [GatewayIntentBits.GuildPresences, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

let eco = JSON.parse(fs.readFileSync('./eco.json'))
let shop = JSON.parse(fs.readFileSync('./shop.json'))
let pets = JSON.parse(fs.readFileSync('./pets.json'))
let money = []
var videos = ["https://www.youtube.com/watch?v=sAn7baRbhx4", "https://www.youtube.com/watch?v=VqB1uoDTdKM", "https://www.youtube.com/watch?v=olOfpzW50P8", "https://www.youtube.com/watch?v=bZe5J8SVCYQ", "https://www.youtube.com/watch?v=GjrrLtjeUVw", "https://www.youtube.com/watch?v=sfHvgPJPMXk", "https://www.youtube.com/watch?v=SmUC_kSw6eY", "https://www.youtube.com/watch?v=Jl6lee2wyPQ", "https://www.youtube.com/watch?v=nlLhw1mtCFA", "https://www.youtube.com/watch?v=ttCHb-MNIFE", "https://www.youtube.com/watch?v=dbn-QDttWqU", "https://www.youtube.com/watch?v=cn4M-fH08XY", "https://www.youtube.com/watch?v=mYb4UvVpaS8", "https://youtu.be/UIp6_0kct_U", "https://youtu.be/p88uRZ5zYMA", "https://youtu.be/JNz0ng19kuw", "https://youtu.be/VqkKokT5RpY", "https://youtu.be/K8T6Y7K-esM"]
var music = ["https://www.youtube.com/watch?v=Q9WcG0OMElo", "https://www.youtube.com/watch?v=12vh55_1ul8", "https://www.youtube.com/watch?v=f7tMeBGxIw4", "https://www.youtube.com/watch?v=0XFudmaObLI", "https://www.youtube.com/watch?v=FtutLA63Cp8", "https://www.youtube.com/watch?v=TKfS5zVfGBc", "https://www.youtube.com/watch?v=bAn6C4p7mAE", "https://www.youtube.com/watch?v=2Od7QCsyqkE", "https://www.youtube.com/watch?v=WUjxaXg8QKE", "https://www.youtube.com/watch?v=VEe_yIbW64w", "https://www.youtube.com/watch?v=IHENIg8Se7M", "https://www.youtube.com/watch?v=UnIhRpIT7nc", "https://www.youtube.com/watch?v=tyneiz9FRMw", "https://www.youtube.com/watch?v=7UubKYqEy3s", "https://www.youtube.com/watch?v=_VH91mivTUw", "https://www.youtube.com/watch?v=sToRddIV7kU", "https://www.youtube.com/watch?v=dyKdLLQP5PI", "https://www.youtube.com/watch?v=bl7W-sU-MKI", "https://www.youtube.com/watch?v=ioQLlX2ELbg", "https://youtu.be/6d-28nn_gpA", "https://youtu.be/-kBQ6lHKTEc", "https://youtu.be/qNIhngowViI", "https://youtu.be/--41OGPMurU", "https://youtu.be/8UVNT4wvIGY", "https://youtu.be/piEyKyJ4pFg", "https://youtu.be/Jrg9KxGNeJY", "https://youtu.be/tnAoq3_6f5M", "https://youtu.be/TwIssYH2Gyw", "https://youtu.be/z6EQlZaB7v8"]
var badSent = [`Bad kitty!`, `Shut up, stupid kitty!`, `"Meow meow meow", that's all I hear`, `When will you learn....`, `If you disobey me, I will be forced to punish you...`, `Shut up, that mouth is only good for licking`, `Why are you being so naughty?`, `I can take care of that attitude`, `You'll regret saying that`, `Remember who is in charge`, `Assume the position`]

function activityLoop(){
    setTimeout(() => {
        client.user.setActivity("There's no /help",{type: ActivityType.Listening})
        client.user.setStatus("online")

        setTimeout(() => {
          client.user.setActivity("prefix-> /", { type: ActivityType.Watching})

            setTimeout(() => {
                client.user.setActivity("with Mina#3690",{type: ActivityType.Playing})
                client.user.setStatus("dnd")

                setTimeout(() => {
                    let ar = videos.concat(music)
                    let rId = Math.floor(Math.random()*ar.length)
                    client.user.setActivity("yooooooo",{type: ActivityType.Streaming, url:ar[rId]})

                    activityLoop();
                }, 60000);
            }, 60000);
        }, 30000);
    }, 30000);
}

client.on('ready', async () => {
    console.log('Online')
    client.user.setActivity("Starting...",{type: ActivityType.Competing})
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

client.on('messageCreate', async message => {
    let user = message.author
    let member = message.member
    let guild = message.guild
/* 
    if (guild.id == "1041311173003448340"){
        if (message.content.toLowerCase().includes("cute")){
            message.reply("Yeah, you won an hug!");
            message.reply("https://tenor.com/view/hug-gif-25588769");
        }
    } */
/*     let sId = Math.floor(Math.random()*badSent.length)

    if (guild.id == "1041311173003448340" && user.id == "984496581954920518"){    
        if (!message.content.toLowerCase().includes("nya") || message.content.includes("L") || message.content.includes("R") || message.content.includes("l") || message.content.includes("r")){
            message.reply(badSent[sId]);
            if (member.moderatable)
                member.timeout(1 * 60 * 1000)
        }
    } */
})
/* 
client.on('messageUpdate', async (oldMSG, newMSG) => {
    let user = newMSG.author
    let member = newMSG.member
    let guild = newMSG.guild
    let sId = Math.floor(Math.random()*badSent.length)

    if (guild.id == "1041311173003448340" && user.id == "984496581954920518"){
        if (!newMSG.content.toLowerCase().includes("nya") || newMSG.content.includes('l') || newMSG.content.includes('L') || newMSG.content.includes('r') || newMSG.content.includes('R')){
            newMSG.reply(badSent[sId]);
            if (member.moderatable)
                member.timeout(3 * 60 * 1000)
        }
    }
}) */

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

    else if (interaction.isButton()){
        let intIDs = interaction.customId.split(':');
        let owner = await interaction.guild.members.fetch(intIDs[2]);

        if (intIDs[0] == "pet+y"){
            if (interaction.user.id == intIDs[1]){
                if (!pets[interaction.user.id]){
                    pets[interaction.user.id] = intIDs[2];
                    interaction.reply(`Hurra, ${interaction.user} is ${owner}'s new pet`);
                } else {
                    interaction.reply(`${interaction.user} You already have an owner, you shouldn't even consider this!!!`);
                }
                interaction.message.delete()
                    .catch(console.error);
            } else
                interaction.reply({content:`You are not part of this deal`, ephemeral:true});

        }
        else if (intIDs[0] == "pet+n"){
            if (interaction.user.id == intIDs[1]){
                if (!pets[interaction.user.id]){
                    interaction.reply(`${owner} I'm sorry, ${interaction.user} refused your offer`);
                } else {
                    interaction.reply(`${interaction.user} I'm glad you refused ${owner}'s offer as you're already owned`);
                }
                interaction.message.delete()
                    .catch(console.error);
            } else
                interaction.reply({content:`You are not part of this deal`, ephemeral:true});
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
            case "ping":
                let sent = await interaction.reply({content:`Pong!`, ephemeral: true});
                interaction.editReply(`Heartbeat: ${client.ws.ping}ms, Lantency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`)
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
                embed = new EmbedBuilder()
                .setColor(0x29ff62)
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
                        embed.addFields({name: item+" - "+shop[item].price+"$", value: `${shop[item].description} | ${shop[item].quantita?shop[item].quantita+" available":""}`})
                    });
                }
                
                await interaction.reply({embeds:[embed]})
                break;
            case "own":
                target = interaction.options.getUser('target');

                if (target.id == interaction.user.id)
                    return await interaction.reply({content:"You can't own yourself", ephemeral:true});
                if (pets[interaction.user.id] == target.id)
                    return await interaction.reply({content:"You can't own your owner", ephemeral:true});
                if (pets[target.id] == interaction.user.id)
                    return await interaction.reply({content:`You already own ${target}`, ephemeral:true});
                if (pets[target.id])
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
                    url: "https://cdn4.vectorstock.com/i/1000x1000/16/53/handshake-businessmen-making-a-deal-vector-5721653.jpg"
                };
                await interaction.reply({embeds:[embed], components: [row]});
                break;
            case "free":
                target = interaction.options.getUser('target');
                if (pets[target.id]){
                    if (pets[target.id] == interaction.user.id || interaction.user.id == bOwner){
                        pets[target.id] = null;
                        interaction.reply({content:`${target} is now free`});
                    } else {
                        interaction.reply({content:`${target} is not your pet`, ephemeral:true});
                    }
                } else {
                    interaction.reply({content:`${target} is not owned`, ephemeral:true});
                }
                break;
            case "list-pets":
                target = interaction.options.getUser('target');
                let i;
                let s = "";
                let owners = {};
                let fields = [];

                Object.keys(pets).forEach(pet => {
                    if (target && pets[pet] != target.id)
                        return;
                    if (!pets[pet])
                        return;
                    if (!owners[pets[pet]])
                        owners[pets[pet]] = [];
                    owners[pets[pet]].push(pet);
                });
                for (const owner of Object.keys(owners)) {
                    i = 0;
                    while (owners[owner][i]) {
                        try {
                            s += `|>${await interaction.guild.members.fetch(owners[owner][i])}\n`;
                        } catch (error) {
                            s += `|>(LOST PET)`
                        }
                        i++;
                    }
                    fields.push({ name: `${(await interaction.guild.members.fetch(owner)).displayName}`, value: s });
                    s = "";
                }
                embed.title = 'Pets list';
                embed.fields = fields;
                embed.color = 0x130be6;
                console.log(fields);
                if (!fields.length)
                    return await interaction.reply({content:`${target?target:"Everyone"} has no pets`, ephemeral:true});
                await interaction.reply({embeds:[embed]});
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
                if(!logchan.isTextBased())
                {
                    interaction.reply({content: "Invalid channel", ephemeral:true})
                    break;
                }
                console.log("sos")
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
                fs.writeFileSync('./pets.json', JSON.stringify(pets))
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

    else if(interaction.isUserContextMenuCommand())
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
            case "own":
                target = interaction.targetUser;

                if (target.id == interaction.user.id)
                    return await interaction.reply({content:"You can't own yourself", ephemeral:true});
                if (pets[target.id] == interaction.user.id)
                    return await interaction.reply({content:`You already own ${target}`, ephemeral:true});
                if (pets[target.id])
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
                    url: "https://cdn4.vectorstock.com/i/1000x1000/16/53/handshake-businessmen-making-a-deal-vector-5721653.jpg"
                };
                await interaction.reply({embeds:[embed], components: [row]});
                break;
            case "free":
                target = interaction.targetUser;
                if (pets[target.id]){
                    if (pets[target.id] == interaction.user.id || interaction.user.id == bOwner){
                        pets[target.id] = null;
                        interaction.reply({content:`${target} is now free`});
                    } else {
                        interaction.reply({content:`${target} is not your pet`, ephemeral:true});
                    }
                } else {
                    interaction.reply({content:`${target} is not owned`, ephemeral:true});
                }
                break;
            case "list-pets":
                target = interaction.targetUser;
                let i;
                let s = "";
                let owners = {};
                let fields = [];

                Object.keys(pets).forEach(pet => {
                    if (pets[pet] != target.id)
                        return;
                    if (!pets[pet])
                        return;
                    if (!owners[pets[pet]])
                        owners[pets[pet]] = [];
                    owners[pets[pet]].push(pet);
                });
                for (const owner of Object.keys(owners)) {
                    i = 0;
                    while (owners[owner][i]) {
                        try {
                            s += `|>${await interaction.guild.members.fetch(owners[owner][i])}\n`;
                        } catch (error) {
                            s += `|>(LOST PET)`
                        }
                        i++;
                    }
                    fields.push({ name: `${(await interaction.guild.members.fetch(owner)).displayName}`, value: s });
                    s = "";
                }
                embed.title = 'Pets list';
                embed.fields = fields;
                embed.color = 0x130be6;
                if (!fields.length)
                    return await interaction.reply({content:`${target} has no pets`, ephemeral:true});
                await interaction.reply({embeds:[embed]});
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
    fs.writeFileSync('./pets.json', JSON.stringify(pets))
});