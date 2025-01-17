const Discord = require('discord.js');
const client = new Discord.Client();
const keys = require('./keys.json');
const token = keys.DiscordToken;
const PREFIX = "p.";
const axios = require('axios');
const fs = require('fs');

const stats = require("./stats.js");
const dataUpdate = require('./dataUpdate.js');

const { data } = require('cheerio/lib/api/attributes');
var urlTwosDiscord = null;
var urlThreesDiscord = null;
var nbp = null;

/* Sheets 
 * Data: 
 * Roster: https://docs.google.com/spreadsheets/d/1Hi_hJNBkzKdWDeKTIRH6CsczePQSNOa-i92IXTfdWhY/edit#gid=823598572
*/

client.login(token);

client.on('ready', () => {
    console.log('Pluto is online');
    var today = new Date();
    client.user.setStatus('online');
    client.user.setActivity("Try p.help");

    urlTwosDiscord = client.guilds.cache.get('771817727819776061');
    urlThreesDiscord = client.guilds.cache.get('835194686859509811');
    nbp = client.guilds.cache.get('748953851343798413');

    setInterval(async function(){ // This is set for every hour to check
        today = new Date()
        if (today.getHours() == 0 || today.getHours() == 12) {
            console.log(`${today}: Adding Players & Updating MMR `);
            try {
                dataUpdate.massAdd(2);
                await sleep(60000);
                dataUpdate.sortData(2);
                await sleep(30000);
            } catch { 
                console.log("massAdd 2's FAILED");
            }
            try {
                dataUpdate.massAdd(3);
                await sleep(60000);
                dataUpdate.sortData(3);
                await sleep(30000);
            } catch { 
                console.log("massAdd 3's FAILED");
            }
            try {
                stats.setTeams(2);
                await sleep(300000);
            } catch {
                console.log("SetTeams 2's FAILED");
            }
            try {
                stats.setTeams(3);
                await sleep(300000);
            } catch {
                console.log("SetTeams 3's FAILED");
            }
            // try {
            //     dataUpdate.updatePlayerData(2);
            //     await sleep(60000);
            // } catch { 
            //     console.log("updatePlayerData 2's FAILED");
            // }
            try {
                dataUpdate.updatePlayerData(3);
                await sleep(60000);
            } catch { 
                console.log("updatePlayerData 3's FAILED");
            }
        }
    }, 3.6e+6);
});

client.on('message', (msg) =>{
    if (msg.content.startsWith(PREFIX) || msg.content.startsWith(PREFIX.toUpperCase())) {
        if (msg.author.bot) return;
        const [command, ...args] = msg.content.trim().substring(PREFIX.length).split(/\s+/);

        var option; // Setting which guild the message came from
        if (msg.guild.id == '771817727819776061') {
            option = 2;
        } else if (msg.guild.id == '835194686859509811') {
            option = 3;
        } else {
            option = 2;
        }

        if (msg.author.id != '238853321522282496') return; // REMOVE THIS IN IMPLEMTATION INTO DISCORDS
        console.log(`\n${msg.author.username} ran command: ${command}\nArg(s): ${args}`);

        if (command.toLowerCase() == "stats") {
            stats.playerStats(msg, args, [urlTwosDiscord, urlThreesDiscord, nbp]);
        }

        if (command.toLowerCase() == "top") {
            // Top teams/players
        }

        if (command.toLowerCase() == "teams") {
            // list all franchises discord links
        }

        if (command.toLowerCase() == "teaminfo") {
            stats.teamInfo(option, args, msg)
        }

        if (msg.author.id == '238853321522282496') { // Make another section for staff
            if (command.toLowerCase() == "test") {
                dataUpdate.test();
            }

            if (command.toLowerCase() == "mass") {
                dataUpdate.massAdd(args[0]);
            }

            if (command.toLowerCase() == "mmr") {
                if (args[0] == 2 || args[0] == 3) {
                    dataUpdate.updateMMRs(args[0]);
                }
            }

            if (command.toLowerCase() == "setteams") {
                stats.setTeams(args[0]);
            }

            if (command.toLowerCase() == "add") { // make sure that only admissions can do this
                dataUpdate.addPlayer(msg, args[0].substring(3, args[0].length - 1), option);
            }
        }

        if (command.toLowerCase() == "help") { // Repurpose -- UPDATE!!!
            const commandList = new Discord.MessageEmbed()
                .setTitle("Command List")
                .setThumbnail("https://cdn.discordapp.com/attachments/748954025570992205/939192382723870830/plutoPFP.png")
                .addFields(
                    { name: 'p.stats', value: "`Shows all the players stats!`\n`\"EX: p.stats\" OR \"p.stats @NotHenry#4271\"`", inline: false},
                    { name: 'p.top + [DIVISION]', value: "`Shows who's on the top of all stats!`\n`EX: p.top Contender`", inline: false},
                    { name: 'p.top + [TEAM]', value: "`Shows teams who are on the top of all stats!`\n`EX: p.top Owl`", inline: false},
                    { name: 'p.team + [TEAM]', value: "`Provides teams listed roster & salary.`", inline: false}
                )
                .setFooter(randomFooter())
                .setTimestamp();
            msg.channel.send(commandList);
        }
        
    }
});

function randomFooter() {
    var num = Math.floor(Math.random() * 8);
    switch (num) {
        case 0:
            return "Am I a planet?"
        case 1:
            return "Jotchua Reigns Supreme!🐕";
        case 2:
            return "-_- Tough";
        case 3:
            return "My Creator is NotHenry";
        case 4:
            return "Hehe monkee 🐒";
        case 5:
            return "URL is like pretty cool";
        case 6:
            return `Day #${Math.floor(Math.random() * 1000)}: Code still broke...`;
        case 7:
            return `NASA called me a dwarf...`;
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}