const fs = require('fs');

class Database {
	constructor(path) {
		this.path = path;
		this.data = {};
		this._load();
	}

	_load() {
		const data = fs.readFileSync(this.path);
		this.data = JSON.parse(data);
	}

	sync() {
		const out = JSON.stringify(this.data);
		fs.writeFileSync(this.path, out);
	}
}

module.exports = { Database };
