const express = require('express');

const app = express();

const database = {
	users: [
		{
			id: '123',
			name: 'Chitraksh',
			email: 'chitraksh@gmail.com',
			password: 'cheetah',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'anshika',
			email: 'anshika@gmail.com',
			password: 'speedy',
			entries: 0,
			joined: new Date()
		},
	]
}

app.use(express.json());

app.get('/',(req,res)=>{
	res.send(database.users);
})

app.post('/signin',(req,res)=>{
	if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
		res.json('success');
	}
	else{
		res.status(400).json("error loging in");
	}
})

app.post('/register',(req,res)=>{
	const {email,password,name} = req.body;	
	database.users.push({
		id: '125',
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
	})
	res.json(database.users[database.users.length-1]);
	
})

app.get('/profile/:id',(req,res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id){
			found = true;
			return res.json(user);
		}
	})
	if (!found){
		return res.status(404).json("user not found");
	}
	
})

app.put('/image',(req,res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id){
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	})
	if (!found){
		return res.status(404).json("user not found");
	}

})


app.listen(3000,()=>{
	console.log("This is working");
});
