const { DB } = require('textsyntaxdb');
const {
	Client,
	Events,
	GatewayIntentBits,
	ActivityType,
	EmbedBuilder
} = require('discord.js');
const { token } = require('../config.json');
const { fish, rods } = require('../items.json');
const db = new DB('data.tdb');
const prefix = 'f!';
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages
	]
});
client.once(Events.ClientReady, c => {
	console.log(c.user.tag);
	c.user.setActivity(`${prefix}help for cmds`, {
		type: ActivityType.Playing
	});
});
function setMoney(amount, id) {
	db.write('money', id, amount);
}
client.on(Events.MessageCreate, async msg => {
	try {
		if (msg.content === `${prefix}fish`) {
			let randomFish = fish[Math.floor(Math.random() * fish.length)];
			msg.reply('Fishing... (this will depend on your rod)');
			setTimeout(() => {}, 1000 /* placeholder value, needs inventory import*/);
		}
	} catch (err) {
		await msg.reply('An error occurred, error:', err);
	}
});
