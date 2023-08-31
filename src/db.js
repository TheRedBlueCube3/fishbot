const fs = require('fs');

class Database {
	constructor(path) {
		this.path = path;
		this.data = {};
		this._load();
	}

	_load() {
		const data = fs.readFileSync(this.path, { encoding: 'utf-8', mode: 'r' });
		console.log(data);
	}
}

// again please

const test = new Database('..\\db\\inventories.json');
