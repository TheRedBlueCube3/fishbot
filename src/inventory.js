const { Database } = require('./db.js');
const fs = require('fs');

const db = new Database('../db/inventories.json'); // i am on linux, comment this out and use the other line of code!

const items = require('../items.json');

class Inventory {
	constructor(id) {
		this.id = id;
		if (db.data[id] == undefined) {
			db.data[id] = {
				money: 150,
				items: {
					rods: ['Plastic Bucket'],
					fish: ['Bass', 'Bass', 'Bass', 'Silver Carp', 'Flounder'],
					other: []
				},
				usingRod: 'Plastic Bucket'
			};
			db.sync();
		}
	}

	getItems() {
		return db.data[this.id].items;
	}

	getMoney() {
		return db.data[this.id].money;
	}

	addMoney(amount) {
		db.data[this.id].money += amount;
		db.sync();
	}

	removeMoney(amount) {
		db.data[this.id].money -= amount;
		db.sync();
	}

	buy(itemID, amount) {
		// buys a fish
		if (db.data[this.id].money < items.rods[itemID].price) {
			return 'insufficient_funds';
		}

		db.data[this.id].items.rods.push(items.rods[itemID]);
		this.removeMoney(items.rods[itemID].price);
		db.sync();

		return 'bought';
	}

	sell(itemID, price, amount) {
		// sells a fish
		if (!(itemID in db.data[this.id].items)) {
			return 'item_not_present';
		}

		db.data[this.id].items.splice(db.data[this.id].items.indexOf(itemID));
		db.data.market[this.id].push({ item: items.fish[itemID] });
		this.addMoney(price);
		db.sync();

		return 'sold';
	}

	setRod(itemID) {
		if (!(itemID in db.data[this.id].items)) return 'item_not_present';
		if (!(itemID in db.data[this.id].items.rods)) return 'item_not_rod';
		db.data[this.id].usedRod = items.rods[itemID];
		db.sync();

		return 'set';
	}
}

module.exports = { Inventory };
