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
	zipcode: Sequelize.STRING,
})

const Event = sequelize.define('event', {
	subject: Sequelize.STRING(30),
	brief: Sequelize.STRING(100),
	description:Sequelize.STRING(1024),
	lat: Sequelize.DECIMAL,
	lng: Sequelize.DECIMAL,
})

const Join = sequelize.define('join', {
	participants: Sequelize.INTEGER,
})

const Comment = sequelize.define('comment',{
	body:Sequelize.STRING(1024)
})

const Contact = sequelize.define('contact', {
	fullname: Sequelize.STRING,
	email: Sequelize.STRING,
	phone: Sequelize.STRING,
	message: Sequelize.STRING(1024),
})

// relations between tables
User.hasMany(Event)
Event.belongsTo(User)

Join.belongsTo(Event)
Event.hasMany(Join)

User.hasMany(Comment)
Comment.belongsTo(User)
Event.hasMany(Comment)
Comment.belongsTo(Event)


//Routes
app.get('/home', (req, res) => {
	let user = req.session.user;
	let result = [];
	Event.findAll()
	.then(function(data) {
			// console.log('all events from all users:')
			// console.log(data)
			for(var i = 0; i < data.length; i++) {
				result.push({'id':data[i].id,'subject': data[i].subject,'brief':data[i].brief,'description': data[i].description,'lat': data[i].lat, 'lng': data[i].lng})
			}

			res.render('index', {
				user: user,
				magicKey: result,
			})
		})
})

app.post('/home', (req, res) =>{
	console.log('post a contact request');
 	sequelize.sync({force:true}).then(function(){
 	Contact.create({
    	fullname:req.body.full_name,
    	email:req.body.email,
    	phone:req.body.phone,
    	message:req.body.comment,
    })
    .then(function(){
    	res.redirect('/home')
    })
 	})
})


app.get('/setup', (req, res) => {
	let user = req.session.user;
	res.render('setup', {user: req.session.user})
})

app.post('/setup',(req,res) =>{
 	console.log('post a setup request');
 	sequelize.sync({force:true}).then(function(){
 	Event.create({
    	subject:req.body.subjectInput,
    	brief:req.body.briefInput,
    	lat:req.body.latInput,
    	lng:req.body.lngInput,
    	description:req.body.descriptionInput,
    })
    .then(function(){
    	res.render('addedevent')
    })
 	})

 })

app.get('/spec', (req, res) => {
	Event.findOne(
		{where: {id: req.query.id},
		include: [
		{
			model: Comment
		}
		,
		{
			model: Join
		}
			]}
	)
	.then(function(data){
		// console.log('data is:')
		// console.log(data)
		console.log('data.dataValues is:')
		console.log(data.dataValues)
		// console.log('data.dataValues.comments[0].body is:')
		// console.log(data.dataValues.comments[0].body)
		res.render('spec', {/*user: user, */eventInfo:data})
	});

})

// app.get('/specroute:countryName',(req,res)=>{
// 	if (req.params.countryName =='all'){
// 		Roads.findAll()
// 		.then((result)=>{
// 			res.send(result)
// 		})
// 	}
// 	else{
// 			Roads.findAll({
// 		where: {
// 			country: req.params.countryName
// 		}
// 	})
// 	.then((result) => {

// 		res.send(result)
// 	})
// 	}
// })

app.post('/spec/', function(req,res){
	let user = req.session.user;
	let userInputComment = req.body.magic
	//console.log(userInputComment)

	Event.findOne({
		where: {id: req.body.eventId}
	})
	.then(function(event){
			// console.log('event info is:')
			// console.log(event)
			const value = {
				body: userInputComment,
				userId: user.id
			}
			const opts = {
				include:[User]
			}
			return event.createComment(value, opts) 
			
		})
	.then(function(data){
		// console.log('data is:')
		// console.log(data)
		// console.log(data.dataValues.body)
		let newComment = data.dataValues.body
		res.send({magic:newComment})	
	})
	.catch( e => console.log(e))
});

//server
sequelize.sync({force:true})
	  .then(function () {
		return User.create({
			username: "Dummy",
			email: "dummy@dummy.com",
			password: "dummy",
			zipcode:'3541AS'
		})

	  .then(function (user) {
	    return user.createEvent({
	      subject: "BBQ",
	      brief:"Free BBQ in Terwijde Winkel Centrum on March 31st.",
	      description: "On March 31st, we will hold free BBQ in Utrecht Terwijde Centrum. Unlimited meat and salade! Drinks and Music! Welcome.",
	      lat:52.101211,
	      lng:5.044792,
	    })
	  })

	.then(function(event){
		// console.log('console logging event:')
		// console.log(event)
		event.createComment({
		body:"This is test comment for Event BBQ.",
		userId: 1
		}),		
		event.createJoin({
		participants: 45,
		})
	})

	.then(function () {
		const server = app.listen(3000, function () {
			console.log('Server has started')
		})
	})
}, function (error) {
	console.log('sync failed: ')
	console.log(error)
});