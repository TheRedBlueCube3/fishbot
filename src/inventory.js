//const { Database } = require('./db.js');
const fs = require('fs');

//const db = new Database('../db/inventories.json'); // i am on linux, comment this out and use the other line of code!

const items = require('../items.json');

class Inventory {
	constructor(id, db) {
		this.id = id;
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
		return db.data[this.id].items;
	}

	getMoney() {
		return db.data[this.id].money;
	}

	getUsingRod() {
		return db.data[this.id].usingRod;
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
		// buys a rod
		if (db.data[this.id].money < items.rods[itemID].price) {
			return 'insufficient_funds';
		}

		db.data[this.id].items.rods.push(items.rods[itemID]);
		this.removeMoney(items.rods[itemID].price);

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

		return 'sold';
	}

	setRod(itemID) {
		if (!(itemID in db.data[this.id].items)) return 'item_not_present';
		if (!(itemID in db.data[this.id].items.rods)) return 'item_not_rod';
		db.data[this.id].usedRod = items.rods[itemID];
		db.sync();

		return 'set';
	}

	pushFish(fish) {
		db.data[this.id].items.fish.push(fish);
		db.sync();
	}
}

module.exports = { Inventory };
