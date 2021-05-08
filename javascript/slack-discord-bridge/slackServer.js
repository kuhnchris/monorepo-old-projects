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
var report = function( who, msg ) {
  console.log( who + " | " + msg );
}

const userCache = {}
const channelCache = {}
report("Slack","starting RTM Client");
slackBot.start();

const slack_getChannels = function(){
  return new Promise( (promRes, promRej) => {
    const param = {
      exclude_archived: true,
      types: 'public_channel',
      limit: 100
    };
    slackWebBot.conversations.list(param).then(results => { 
      results.channels.forEach((v) => {
        channelCache[v.id] = v.name_normalized
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
      report('Slack',`(#${channelCache[message.channel]}) ${userCache[message.user]}: ${message.text}`);  
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
repl.start('> ').context.slackBot = slackBot;
