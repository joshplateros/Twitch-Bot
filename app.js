const twitchJs = require('twitch-js')
const tmi = require('tmi.js');
const fs = require('fs');

var grubCount;
const grubCommandRecently = new Set();

//Load in grub information
fs.readFile('grubs.txt', (err, data) => {
	if (err) throw err;
	
	grubCount = data.toString();
})



var CONFIG = require('./config.json');

let options = {
	options: {
		debug: true
	},
	connection: {
		cluster: "aws",
		reconnect: true
	},
	identity: {
		username: CONFIG.BOT_USERNAME,
		password: CONFIG.BOT_PASSWORD
	},
	channels: [CONFIG.CHANNEL]
};

let client = new tmi.client(options);
// Getting TwitchJS stuff, might replace tmi

client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

client.connect();

const handleMessage = message => {
	console.log(message);
}

function onMessageHandler (target, context, msg, self) {
	if (self) { return; }

	const commandName = msg.trim();

	if (commandName === '!discord')
	{
		client.say(target, CONFIG.DISCORD_CHANNEL);
	}
	else if (commandName === '!youtube')
	{
		client.say(target, CONFIG.YOUTUBE_CHANNEL);
	}
	else if (commandName === '!socials')
	{
		client.say(target, CONFIG.TWITTER);
	}
	else if (commandName === '!grub')
	{
		const num = grubSave();
		//First cooldown
		if (grubCommandRecently.has(target)) 
		{
		} 
		else 
		{
			grubCommandRecently.add(target);
			setTimeout(() => 
			{
				grubCommandRecently.delete(target);
			}, 5000); //For timers (5000 seconds i'm pretty sure)
			
			if (num < 90) // Chance of succeeding
			{
				const change = 100 - num;
				grubCount++;
				client.say(target, `Grub saved pog! Total of ${grubCount} grubs have been saved!`);
				client.say(target, `Your chance was ${change}%`);
				// Rewrite grubCount in file
				rewriteGrubs(grubCount);
			}
			else 
			{
				const chance = 100 - num;
				client.say(target, `Grub has not been saved!, your chance was ${chance}%`);
				client.say(target, `Total number of ${grubCount} grubs have been saved!`);
			}
		}
	}
	else if (commandName === '!commands') {
		client.say(target, `!grub, !socials, !youtube, !discord`);
        }
	else if(commandName === '!vtuber') {
            client.say(target, `I WILL BE USING FACECAM FOR A BIT, WILL ONLY USE VTUBER IF IM FEELING LIKE IT OR VTUBER COLLAB`);
        }
	else
	{
	}
}

function onConnectedHandler (addr, port) {
	console.log(`* Connected to ${addr}:${port}`);
}

function grubSave () {
	const sides = 100;
	return Math.floor(Math.random() * sides) + 1;
}

function rewriteGrubs(grubCount) {
	fs.writeFile('grubs.txt', grubCount.toString(), function(err) {
		if (err) {
			return console.log(err);
		}
})};

