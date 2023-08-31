const { Database } = require("./db.js");
const fs = require("fs");

const db = new Database("../db/inventories.json"); // i am on linux, comment this out and use the other line of code!
//const db = Database("..\\db\\inventories.json");

const items = JSON.parse(fs.readFileSync("../items.json"));
//const items = JSON.parse(fs.readFileSync("..\\items.json"));

class Inventory {
	constructor(id) {
		this.id = id;
		if(db.data[id] == undefined) {
			db.data[id] = { "money": 0, "items": [] };
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

	buy(itemID) { // buys a rod
		if (db.data[this.id].money < items.rods[itemID].price) {
			return "insufficient_funds";
		}

		db.data[this.id].items.push(itemID);
		db.data[this.id].money -= items.rods[itemID].price;
		db.sync()

		return "bought";
	}
}

module.exports = { Inventory };
