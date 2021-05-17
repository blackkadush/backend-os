const db = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

const users = {

	contactUs(req, res) {
		console.log(req.body);
		db.postContactForm(req.body)
		.then(result => {
			res.status = 200;
			res.json(result);
		})
		.catch(error => {
			res.status = 400;
			res.json(error)
		})
	},

	getAll(req, res) {
		console.log("getAll");
		db.getAllUsers()
		.then(users => {
			console.log(".then");
			console.log(users);
			res.status = 200;
			res.json(users);
		})
		.catch(error => {
			console.log("error => ", error);
			res.status = 400;
			res.json(error)
		})
	},

	get(req, res) {
		db.getUser(req.params.id)
		.then(user => {
			res.status = 200;
			res.json(user);
		})
	},

	update(req, res) {
		db.updateUser(req.body, req.params.id)
		.then(user => {
			res.status = 200;
			res.json(user);
		})
		.catch(err => {
			console.log(err);
		})
	},

	signup(req, res) {
		console.log(req.body);
		db.findUserByEmail(req.body.email)
		.then(oneUser => {
			console.log("oneUser => ", oneUser);
			if (oneUser.length === 0) {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					db.createUser(req.body, hash)
					.then(user => {
						console.log("user => ", user);
						const userEmail = { 'id': user.id, 'email': user.email }
						const token = jwt.sign(
							userEmail,
							jwtSecret,
							{ expiresIn: "7d" } );
						res.json({
							token,
							user,
							success: "You have successfully signed in!"
						});
					})
				});
			} else {
				res.json({ error: 'User already exists!' });
			}
		})
		.catch(err => {
			console.log(err);
		})
	},

	signin(req, res) {
		db.findUserByEmail(req.body.email)
		.then(user => {
			if (user.length == 0) {
				res.json({ error: 'Auth failed' });
			} else {
				bcrypt.compare(req.body.password, user[0].password)
				.then((result) => {
					if (result) {
						const userEmail = { 'id': user[0].id, 'email': user[0].email }
						const token = jwt.sign(
							userEmail,
							jwtSecret,
							{ expiresIn: "7d" } );
						res.json({
							token,
							user: userEmail,
							success: "You have successfully signed in!"
						});
					} else {
						res.json({ error: "Wrong email/password combination" });
					}
				});
			}
		})
		.catch(err => {
			console.log(err);
		})
	}

};

module.exports = users;
