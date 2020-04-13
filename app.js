const express = require('express');

const App = express();

App.get('/',(req,res)=>{
	res.send("<h1>Hellooo</h1>");
});

App.listen(3000);
