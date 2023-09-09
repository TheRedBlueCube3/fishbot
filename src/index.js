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
const prefix = 'f!';
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages
	]
});
const db = new Database('../db/inventories.json');
client.once(Events.ClientReady, c => {
	console.log(c.user.tag);
	c.user.setActivity(
		`fishing in ${client.guilds.cache.size} servers, f!help to get started`,
		{
			type: ActivityType.Playing
		}
	);
});
let fishSessions = [];
let commands = ['', 'help', 'fish'];
client.on(Events.MessageCreate, async msg => {
	/*
	if (msg.content === `${prefix}createprofile`) {
		if (msg.author.id in db.data)
			return await msg.reply('**You already have a profile!**');
		let inventory = new Inventory(msg.author.id);
		await msg.reply('Profile successfully created!');
	} inventory.js already takes care of this!!!
	*/
	if (msg.content.startsWith(`${prefix}help`)) {
		let embed = new EmbedBuilder()
			.setColor('Green')
			.setDescription(`${commands.join(`\n${prefix}`)}`)
			.setFooter({ text: 'this is all of the commands bro' })
			.setTitle('Commands');
		await msg.reply({ embeds: [embed] });
	}
	if (msg.content.startsWith(`${prefix}fish`)) {
		console.log(fishSessions);
		if (fishSessions.includes(msg.author.id)) {
			return await msg.reply('**You already are fishing!**');
		}
		let inventory = new Inventory(msg.author.id, db);
		let randomFish = fish[Math.floor(Math.random() * fish.length)];
		let timeInBetween = _.random(
			rods[inventory.getUsingRod()].timeStart,
			rods[inventory.getUsingRod()].timeEnd
		);
		await msg.reply('Fishing... (this will depend on your rod)');
		fishSessions.push(msg.author.id);
		setTimeout(async () => {
			let rn = _.random(0, 1);
			if (rn == 1) {
				await msg.reply(
					`Congratulations, you found ${randomFish} in ${timeInBetween} seconds!`
				);
				inventory.pushFish(randomFish);
			} else {
				await msg.reply(
					`You **did not** catch a fish. <:picardia_sad:1097841784136138753>`
				);
			}
			fishSessions.splice(fishSessions.indexOf(msg.author.id), 1);
		}, timeInBetween * 1000);
	}
});

client.login(token);
