const http = require( 'http' ); 
const Discord = require( 'discord.js' ); 
const { RTMClient, WebClient } = require('@slack/client');
const repl = require('repl');

const loadJSONFile = function(file) {
    const fs = require("fs");
    var content = fs.readFileSync(file);
    return JSON.parse( content );
}

const config = loadJSONFile( "config.json" ); 
const slackBot = new RTMClient(config.slackToken);
const slackWebBot = new WebClient(config.slackToken);
const discordClient = new Discord.Client(); 

const userCache = {}
const channelCache = {}
var slack_bridgeChannelId;

var report = function( who, msg ) {
  console.log( who + " | " + msg );
}

const slack_getChannels = function(){
  return new Promise( (promRes, promRej) => {
    const param = {
      exclude_archived: true,
      types: 'public_channel',
      limit: 100
    };
    slackWebBot.conversations.list(param).then(results => { 
      results.channels.forEach((v) => {
        report("Slack",`Channel fetched: ${v.id} -> ${v.name_normalized}`);
        channelCache[v.id] = v.name_normalized;
        if (v.name_normalized === config.slackBridgeChannel){
          report("Slack", "found bridge channel!");
          slack_bridgeChannelId = v.id;
        }
      });
      promRes();
    }).catch((e) => {promRej(e);});
  });
}

const slack_resolveUser = function(user){
  return new Promise( (promRes, promRej) => {
    return slackWebBot.users.info({"user": user}).then( res => {
      userCache[user] = res.user.name;
      promRes();
    }).catch((e)=>{promRej(e);});
  });
}

const slack_parseMessage = function(message){
  if (userCache[message.user] !== undefined) {
    if (channelCache[message.channel] !== undefined){
      var rep_msg =  `(#${channelCache[message.channel]}) ${userCache[message.user]}: ${message.text}`;
      report('Slack',rep_msg);  
      if ( bridgeChannel_discord !== undefined ) {
        bridgeChannel_discord.send( rep_msg );
      }
    } else {
      slack_getChannels().then(()=>{
        slack_parseMessage(message);
      });
    }
  } else {
    slack_resolveUser(message.user).then(()=>{
      slack_parseMessage(message);
    })
  }  
}

slackBot.on('message',(message)=>{
  slack_parseMessage(message);
})

discordClient.on( 'ready', () => {
  report( "Discord", `Logged in as ${ discordClient.user.tag }! Trying to find the bridge channel ${ config.discordBridgeChannel }...` );
  discordClient.guilds.forEach(( g ) => {
    report( "Discord", `checking guild: ${ g.name }` );
    g.channels.forEach(( c ) => {
      report( "Discord", `checking channel: ${ c.name }` );
      if( c.name == config.discordBridgeChannel ) {
        bridgeChannel_discord = c;
        report( "Discord", `Found the bridge channel ${ bridgeChannel_discord.name } on guild ${ g.name }` );
      }
    });
  });

  if( bridgeChannel_discord ) {
    report( "Discord", `Found the bridge channel to export slack messages to. We are operational!` );
    bridgeChannel_discord.send( 'Discord<->Slack Bridge Bot is back (again)!' );
  }
});

discordClient.on( 'message', msg => {
  const util = require("util");
  var rep_msg = `(#${ msg.channel.name }) ${ msg.author.username }: ${ msg.content }`;
  if (!msg.author.bot){
    report( "Discord", rep_msg );//+ " " + util.inspect(msg) );
    slackBot.sendMessage(rep_msg ,slack_bridgeChannelId);
  } else {
    report( "Discord", "bot; ignored: " + rep_msg);
  }
});

discordClient.on( 'error', reason => {
  report( "Discord", "!! ERROR: " + reason );
});

discordClient.login( config.discordToken );
report("Slack","starting RTM Client");
slackBot.start();
slack_getChannels().then(()=>{
  report("Slack", "looking for bridge channel...");
  if ( slack_bridgeChannelId !== undefined){
    report("Slack", "found bridge channel on Slack side! Operating and ready!");
    slackBot.sendMessage('Slack<->Discord Bridge is operational!',slack_bridgeChannelId);
  }
});
