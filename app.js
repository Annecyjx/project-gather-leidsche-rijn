const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://' + 
	process.env.POSTGRES_USER + ':' + 
	process.env.POSTGRES_PASSWORD + '@localhost/personalproject'); 
const express = require('express');
const app = express();
const fs = require('fs');
const pg = require('pg');
const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
// const math = require('mathjs')

app.use(bodyParser.urlencoded({extended: true}));  
app.use(bodyParser.json());
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('static'));
app.use(express.static('static/js'));
//app.use(cookieParser())

// setting up the session
app.use(session({
	secret: 'cool website to gether neighbours together',
	resave: true,
	saveUninitialized: false
}));

// defining tables with sequelize
const User = sequelize.define('user', {
	username: Sequelize.STRING,
	email: Sequelize.STRING,
	password: Sequelize.STRING,
	zipcode: Sequelize.STRING
})

var Event = sequelize.define('event', {
	subject: Sequelize.STRING(30),
	brief: Sequelize.STRING(100),
	description:Sequelize.STRING(1024),
	lat: Sequelize.DECIMAL,
	lng: Sequelize.DECIMAL,
})

var Join = sequelize.define('join', {
	participants: Sequelize.INTEGER
})

// relations between tables
Join.belongsTo(Event);
Event.hasMany(Join);


//Routes
app.get('/home', (req, res) => {
	let result = [];
	Event.findAll()
	.then(function(data) {
			// console.log('all events from all users:')
			// console.log(data)
			for(var i = 0; i < data.length; i++) {
				result.push({'id':data[i].id,'subject': data[i].subject,'brief':data[i].brief,'description': data[i].description,'lat': data[i].lat, 'lng': data[i].lng})
			}

			res.render('index', {
				user: req.session.user,
				magicKey: result,
			})
		})
})


app.get('/setup', (req, res) => {
	res.render('setup'/*, {user: req.session.user}*/)
})



//server
sequelize.sync({force:true})
	  .then(() => {
	    Event.create({
	      subject: "BBQ",
	      brief:"Free BBQ in Utrecht Terwijde Centrum.",
	      description: "On March 31st, we will hold free BBQ in Utrecht Terwijde Centrum. Unlimited meat and salade! Drinks and Music! Welcome.",
	      lat:52.101211,
	      lng:5.044792,
	    })

	.then(() => {
		User.create({
			username: "Dummy",
			email: "dummy@dummy.com",
			password: "dummy",
			zipcode:'3541AS'
		})
	})
	.then(function(){
		Join.create({
		participants: 45,
		})
	})

	app.listen(3000, () => {
		console.log('server has started');
	});
})