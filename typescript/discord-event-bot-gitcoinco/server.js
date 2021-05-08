"use strict";
exports.__esModule = true;
var http = require('http');
var Discord = require('discord.js');
var repl = require('repl');
var loadJSONFile = function (file) {
    var fs = require("fs");
    var content = fs.readFileSync(file);
    return JSON.parse(content);
};
var config = loadJSONFile("config.json");
var discordClient = new Discord.Client();
var userCache = {};
var channelCache = {};
var discordCategoryChannel;
var discordLogChannel;
var discordManageGuild;
var report = function (who, msg) {
    console.log(who + " | " + msg);
};
discordClient.on('ready', function () {
    report("Discord", "Logged in as " + discordClient.user.tag + "! Trying to find the bridge channel " + config.discordBridgeChannel + "...");
    discordClient.guilds.forEach(function (g) {
        report("Discord", "checking guild: " + g.name);
        g.channels.forEach(function (c) {
            report("Discord", "checking channel: " + c.name);
            if (c.name == config.logChannel && c.type == "text") {
                discordLogChannel = c;
                discordManageGuild = g;
                report("Discord", "Found the bridge channel " + discordLogChannel.name + " on guild " + g.name);
            }
            if (c.name === config.categoryChannel && c.type == "category") {
                discordCategoryChannel = c;
            }
        });
    });
    if (discordLogChannel) {
        //report("Discord", `Found the log channel to report. We are operational!`);
        //discordLogChannel.send('We are back online.');
    }
    replObj.context.guild = discordManageGuild;
});
function reactOnMessage(sender, channel, message, msgobj) {
    report("System", "Parsing incomming message: " + message);
    var msgParts = message.split(" ");
    if (msgParts.length < 1) {
        return; // invalid command
    }
    if (msgParts.length === 1 && msgParts[0] == config.botCommandPrefix + "help") {
        msgobj.reply("You can use the following commands:\n    " + config.botCommandPrefix + "addproject/addprojectpublic [project_name] - makes a public channel\n    " + config.botCommandPrefix + "addprojectprivate [project_name] - makes a private channel\n    " + config.botCommandPrefix + "help - this message\n    " + config.botCommandPrefix + "adduser [project_name] [@user] - adds a user to a (private) channel\n    ");
        return;
    }
    if (msgParts[0].toLowerCase() == config.botCommandPrefix + "addproject" ||
        msgParts[0].toLowerCase() == config.botCommandPrefix + "addprojectpublic" ||
        msgParts[0].toLowerCase() == config.botCommandPrefix + "addprojectprivate") {
        var isPrivate = false;
        var channelType = "public";
        if (msgParts[0].toLowerCase() == config.botCommandPrefix + "addprojectprivate") {
            isPrivate = true;
            channelType = "private";
        }
        if (msgParts.length == 2) {
            if (discordManageGuild.roles.exists("name", msgParts[1])) {
                msgobj.reply("Sorry - there is already a role called '" + msgParts[1] + "', please choose a different name.");
                return;
            }
            else {
                discordManageGuild.createRole({
                    name: msgParts[1],
                    color: '#FFFFFF',
                    mentionable: true
                }, "Requested by " + sender.username).then(function (newRole) {
                    var permOverwrite = [
                        {
                            id: newRole,
                            allow: ['VIEW_CHANNEL']
                        }
                    ];
                    if (config.allowRoles !== undefined) {
                        config.allowRoles.forEach(function (roleElement) {
                            permOverwrite.push({
                                id: discordManageGuild.roles.find('name', roleElement),
                                allow: ['VIEW_CHANNEL']
                            });
                        });
                    }
                    if (isPrivate === true) {
                        permOverwrite.push({
                            id: discordManageGuild.roles.find('name', '@everyone'),
                            deny: ['VIEW_CHANNEL']
                        });
                    }
                    discordManageGuild.createChannel(msgParts[1].toLowerCase(), {
                        type: 'text',
                        permissionOverwrites: permOverwrite,
                        parent: discordCategoryChannel
                    }).then(function (newChannel) {
                    });
                    discordManageGuild.members.get(msgobj.author.id).addRole(newRole, "Owner");
                    //msgobj.member.addRole(newRole,"Owner");
                    msgobj.reply("I added a new role for \"" + msgParts[1] + "\" as well as a new " + channelType + " channel. In case of a private channel you can invite people by using '" + config.botCommandPrefix + "adduser " + msgParts[1] + " username'");
                });
            }
        }
        else {
            msgobj.reply("Invalid command usage. Usage: " + config.botCommandPrefix + "addproject <project_name>");
            return;
        }
    }
    else if (msgParts[0].toLowerCase() == config.botCommandPrefix + "adduser") {
        if (msgParts.length == 3) {
            var addUserName = msgParts[2];
            var addUserObj;
            var addRole;
            addUserName = addUserName.replace("<", "").replace(">", "").replace("!", "").replace("@", "");
            if (!discordManageGuild.roles.exists("name", msgParts[1])) {
                msgobj.reply("Sorry - no project found called '" + msgParts[1] + "', please double check.");
                return;
            }
            addRole = discordManageGuild.roles.find("name", msgParts[1]).id;
            if (!discordManageGuild.members.get(msgobj.author.id).roles.has(addRole)) {
                msgobj.reply("Sorry - you are not part of '" + msgParts[1] + "' - I cannot let you do that.");
                return;
            }
            console.log("checking against " + addUserName + " / '" + msgParts[2] + "'");
            var foundUserName = true;
            if (!discordManageGuild.members.has(addUserName)) {
                foundUserName = false;
                var tmpMbmr = discordManageGuild.members.find("displayName", msgParts[2]);
                if (tmpMbmr !== undefined && tmpMbmr !== null) {
                    addUserName = tmpMbmr.id;
                    foundUserName = true;
                }
            }
            if (foundUserName === false) {
                msgobj.reply("Sorry - cannot find user '" + msgParts[2] + "', please double check.");
                return;
            }
            addUserObj = discordManageGuild.members.get(addUserName);
            if (addUserObj.roles.has(addRole)) {
                msgobj.reply("Sorry - user '" + msgParts[2] + "' is already part of '" + msgParts[1] + "'");
                return;
            }
            addUserObj.addRole(addRole, "Added by " + sender.username);
            msgobj.reply("I added \"" + msgParts[2] + "\" to the project '" + msgParts[1] + "' - welcome!");
        }
        else {
            msgobj.reply("Invalid command usage. Usage: " + config.botCommandPrefix + "adduser <project_name> <username>");
        }
    }
}
discordClient.on('message', function (msg) {
    var util = require("util");
    if (!msg.author.bot && msg.content.startsWith(config.botCommandPrefix)) {
        reactOnMessage(msg.author.username, msg.channel.name, msg.content, msg);
    }
    else {
    }
});
discordClient.on('error', function (reason) {
    report("Discord", "!! ERROR: " + reason);
});
discordClient.login(config.discordToken);
var replObj = repl.start({ useGlobal: true, prompt: '(bot)> ' });
