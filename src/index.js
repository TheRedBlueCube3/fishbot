const {
	Client,
	Events,
	GatewayIntentBits,
	ActivityType,
	EmbedBuilder
} = require('discord.js');
const _ = require('lodash');
const { token } = require('../config.json');
const { fish, rods } = require('../items.json');
const { Inventory } = require('./inventory');
const { Database } = require('./db');
let db = new Database('../db/inventories.json');
const prefix = 'f!';
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages
	]
});
let inventories = {};
client.once(Events.ClientReady, c => {
	console.log(c.user.tag);
	c.user.setActivity(`${prefix}help for cmds`, {
		type: ActivityType.Playing
	});
});
client.on(Events.MessageCreate, async msg => {
	if (msg.content === `${prefix}createprofile`) {
		if (msg.author.id in db.data)
			return await msg.reply('**You already have a profile!**');
		let inventory = new Inventory(msg.author.id);
		db.data[msg.author.id] = inventory;
		await msg.reply('Profile successfully created!');
	}
	if (msg.content === `${prefix}fish`) {
		if (!(msg.author.id in db.data))
			return await msg.reply(
				'**You do not have a profile!**\nTo create one, run f!createprofile.'
			);
		let randomFish = fish[Math.floor(Math.random() * fish.length)];
		db._load();
		let timeInBetween = _.random(
			rods[db.data[msg.author.id].usingRod].timeStart,
			rods[db.data[msg.author.id].usingRod].timeEnd
		);
		await msg.reply('Fishing... (this will depend on your rod)');
		setTimeout(async () => {
			let rn = random(0, 1);
			if (rn == 1) {
				await msg.reply(`Congratulations, you found: ${randomFish}!`);
				db.data[msg.author.id].fish.push(randomFish);
			} else {
				await msg.reply(`You **did not** catch a fish. :picardia_sad:`);
			}
		}, timeInBetween);
	}
});

client.login(token);
