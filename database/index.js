const pgp = require('pg-promise')();
const { dbConfig } = require('../config');
console.log("dbConfig => ", dbConfig);
const db = pgp(dbConfig);

module.exports = {

	postContactForm({name, email, message}) {
		const sql = `
			INSERT INTO
				message(name, email, message)
			VALUES
				($1, $2, $3)
			RETURNING
				*
		`
		return db.any(sql, [name, email, message])
	},

	getAllUsers() {
		console.log("getAllUsers");
		const sql = `
			SELECT
				*
			FROM
				users
		`
		return db.any(sql);
	},

	updateUser({ name, email, password, img_url }, id) {
		const sql = `
			UPDATE
				users
			SET
				name = $1, email = $2,
				password = $3, img_url = $4
			WHERE
				id = $5
			RETURNING
				id
		`
		return db.one(sql, [name, email, password, img_url, id]);
	},

	createUser({ name, email, phone }, hash) {
		const sql = `
			INSERT INTO
				users (name, email, phone, password)
			VALUES
				($1, $2, $3, $4)
			RETURNING
				id, email
		`
		return db.one(sql, [name, email, phone, hash]);
	},

	findUserByEmail(email) {
		const sql = `
			SELECT
				*
			FROM
				users
			WHERE
				email = $1
		`
		return db.any(sql, [email]);
	}

};
