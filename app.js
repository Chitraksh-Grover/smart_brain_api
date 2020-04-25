const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex')

const db = knex({
	client: 'pg',
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: true,
	}
});


const app = express();


app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
	res.send("All working well");
})

app.post('/signin',(req,res)=>{
	db.select('email','hash').from('login')
	.where('email','=',req.body.email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password,data[0].hash);
		if(isValid)
		{
			return db.select('*').from('users')
			.where('email','=',req.body.email)
			.then(user => {
				res.json(user[0]);
			})
			.catch(err => res.status(400).json("unable to get user"));
		}
		else{
			res.status(400).json("wrong credentials");
		}
	})
	.catch(err => res.status(400).json("wrong credentials"));
})

app.post('/register',(req,res)=>{
	const {email,password,name} = req.body;	
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			console.log(loginEmail);
			return trx('users')
			.returning('*')	
			.insert({
				email: loginEmail[0],
				name: name,
				joined: new Date()
			})
			.then(user => {
				res.json(user[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json(err)); 
})

app.get('/profile/:id',(req,res) => {
	const { id } = req.params;
	return db.select('*').from('users')
	.where({id:id})
	.then(user => {
		if(user.length){
			res.json(user[0]);
		}
		else{
			res.status(400).json("error finding the user");
		}
	})
	.catch(error => res.status(400).json("error"));	
})

app.put('/image',(req,res) => {
	const { id } = req.body;
	return db('users').where('id','=',id)
	.increment('entries',1)
	.returning('entries')
	.then(entries => {
		console.log(entries);
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json("user not found"));
})


app.listen(process.env.PORT || 3000,()=>{
	console.log(`App is running on port ${process.env.PORT || 3000}`);
});
