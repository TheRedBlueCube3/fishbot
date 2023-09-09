// const { Database } = require('./this.db.js');
const fs = require('fs');

const items = require('../items.json'); // <--- wait this works??? genius

class Inventory {
	constructor(id, db) {
		this.id = id;
		this.db = db;
		if (db.data[id] == undefined) {
			db.data[id] = {
				money: 150,
				items: {
					rods: [0],
					fish: [0, 0, 0, 1, 6],
					other: []
				},
				usingRod: 0
			};
			db.sync();
		}
	}

	getItems() {
		return this.db.data[this.id].items;
	}

	getMoney() {
		return this.db.data[this.id].money;
	}

	getUsingRod() {
		return this.db.data[this.id].usingRod;
	}

	addMoney(amount) {
		this.db.data[this.id].money += amount;
		this.db.sync();
	}

	removeMoney(amount) {
		this.db.data[this.id].money -= amount;
		this.db.sync();
	}

	buy(itemID, amount) {
		// buys a rod
		if (this.db.data[this.id].money < items.rods[itemID].price) {
			return 'insufficient_funds';
		}

		this.db.data[this.id].items.rods.push(items.rods[itemID]);
		this.removeMoney(items.rods[itemID].price);

		return 'bought';
	}

	sell(itemID, price, amount) {
		// sells a fish
		if (!(itemID in this.db.data[this.id].items)) {
			return 'item_not_present';
		}
		for (let i = 0; i < amount; i++) {
			this.db.data[this.id].items.splice(
				this.db.data[this.id].items.indexOf(itemID)
			);
			this.db.data.market[this.id].push({ item: items.fish[itemID] });
		}

		return 'sold';
	}

	setRod(itemID) {
		if (!(itemID in this.db.data[this.id].items)) return 'item_not_present';
		if (!(itemID in this.db.data[this.id].items.rods)) return 'item_not_rod';
		this.db.data[this.id].usingRod = items.rods[itemID];
		this.db.sync();

		return 'set';
	}
	pushFish(fishType) {
		this.db.data[this.id].items.fish.push(items.fish.indexOf(fishType))
		this.db.sync();
	}
}

module.exports = { Inventory };
