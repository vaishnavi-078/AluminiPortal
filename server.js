const express = require('express')
const path = require('path')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const User = require('./model/user');
const jwt = require('jsonwebtoken')
const app =  express();
const JWT_SECRET ='ilomooooobybillieellish'
console.log(path.join(__dirname,'static/login.html'))  
mongoose.connect('mongodb://0.0.0.0:27017/alumini-db',{ 
    useNewUrlParser :true, 
    useUnifiedTopology : true, 
})
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("we're connected!")
});
app.use('/', express.static(path.join(__dirname, 'static')))
app.use('/login',express.static(path.join(__dirname,'static/login.html')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/api/register', async (req,res)=>{
    console.log(req.body)
    const username = req.body.userName;
    const plainTextPassword = req.body.password;
    const alumniId = req.body.alumniID;
    console.log(username," ",plainTextPassword," ",alumniId)
    
    try{
        if (!username || typeof username !== 'string') {
            return res.json({ status: 'error', error: 'Invalid username' })
        }
    
        if (!plainTextPassword || typeof plainTextPassword !== 'string') {
            return res.json({ status: 'error', error: 'Invalid password' })
        }
    
        if (plainTextPassword.length < 5) {
            return res.json({
                status: 'error',
                error: 'Password too small. Should be atleast 6 characters'
            })
        }
        const password = await bcrypt.hash((plainTextPassword),10)
        const response = await User.create({
            username,
            password,
            alumniId
        })
        console.log('User created successfully',response)
    }catch(error){
        console.log(JSON.stringify(error))
        if(error.code == 11000){
            return res.json({status:'error',error:'Username is already in use'})    
        }
    }
    res.json({ status: 'ok' })
})
app.post('/api/login',async (req,res)=>{
    const username = req.body.userName;
    const password = req.body.password;
    const alumniId = req.body.alumniID;
    const user = await User.findOne({username}).lean()
    if(!user){
        return res.json({status:'error',error:'invalid username'})
    }
    console.log(user)
    if(await bcrypt.compare(password,user.password)){
        const token = jwt.sign({
            id : user._id,
            username : user.username,

        },JWT_SECRET)
        return res.json({status:'ok',data:token})
    } 
})
app.get('/api/users', (req,res)=>{
    var user = User.find()
    res.JSON.stringify(user)
})
app.post('/api/change-password',async (req,res)=>{
    const { token, newpassword: plainTextPassword } = req.body

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	try {
		const user = jwt.verify(token, JWT_SECRET)

		const _id = user.id

		const password = await bcrypt.hash(plainTextPassword, 10)

		await User.updateOne(
			{ _id },
			{
				$set: { password }
			}
		)
		res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: ';))' })
	}
})
app.listen(9999,()=>{
    console.log("Server started")
})

