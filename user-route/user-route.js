// User routes
const express = require('express');
const config = require('config');
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();
const  _ = require('lodash');
const Mongodb = require('../mongodb/mongodb');
const collectionName = 'users';
const jwt = require('jsonwebtoken')
const jwtKey = 'my_secret_key'
const { userLoginSchema, userRegisterSchema } = require('./user-model');
const bcrypt = require('bcrypt');
const Mailer = require('../mailer/mailer');

router.get('/all', async (_req, res) => {
    const mongo = await Mongodb.connect(collectionName);
    const data = await mongo.findAll();
    mongo.close();
    res.send(data);
})

router.get('/search/:id', async (req, res) => {
    const mongo = await Mongodb.connect(collectionName);
    const filter = { _id : new ObjectId(req.params['id']) };
    const data = await mongo.findOne(filter);
    mongo.close();
    res.send(data);
})

router.post('/login', async (req, res) => {
    const mongo = await Mongodb.connect(collectionName);
    const { error } = userLoginSchema.validate(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message)
    }
    const data = await mongo.findOne({ user_email : req.body.user_email});
    mongo.close();
    if(!data) {
        return res.status(404).send('User not found');        
    }
    const isValidUser = await bcrypt.compare(req.body.user_password, data.user_password);
    if(!isValidUser) {
        return res.status(400).send('Invalid Password');
    }
    if(!('isVerified' in data && data.isVerified)) {
        return res.status(403).send('Please verify your account');
    }
    const token = jwt.sign(data,jwtKey);
    res.send({ token : JSON.stringify(token)});
})

router.post('/register', async (req, res) => {
    const mongo = await Mongodb.connect(collectionName);
    const { error } = userRegisterSchema.validate(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message)
    }
    req.body['user_password'] = req.body['user_password_1'];
    let data = await mongo.findOne({ user_email : req.body.user_email});
    if(data) {
        return res.status(409).send('Already Registered !');
    }
    delete req.body['user_password_1'];
    delete req.body['user_password_2'];
    req.body.user_password = await bcrypt.hash(req.body.user_password, 10);
    const randomNumber = Math.floor(Math.random()*90000) + 10000;
    req.body['secret_key'] = randomNumber;
    try{
        await Mailer.main(_.pick(req.body,['user_email','secret_key']))
    }
    catch(error) {
        console.log(error)
        return res.status(400).send('Mail not sent')
    }
    data = await mongo.insertOne(req.body);
    mongo.close();
    res.status(201).send(data);
})

router.put('/update/:id', async (req, res) => {
    const mongo = await Mongodb.connect(collectionName);
    const data = await mongo.updateOne(req.params['id'],req.body);
    mongo.close();
    res.send(data);
})

router.delete('/delete/:id', async (req, res) => {
    const mongo = await Mongodb.connect(collectionName);
    const data = await mongo.deleteOne(req.params['id'],req.body);
    mongo.close();
    res.send(data);
})

router.get('/auth/', async (req,res) => {  
    if(req.query['email'] && req.query['key']) {
        const mongo = await Mongodb.connect(collectionName);
        const filter = { user_email : req.query.email };
        const data = await mongo.findOne(filter);
        if('secret_key' in data && data.secret_key == req.query['key']) {
            await mongo.updateOne(data['_id'],{ isVerified : true });
            return res.redirect('http://localhost:4200');  // TODO need to change after deploy
        }
    }
    res.status(400).send('Not verified')
})

module.exports = router;
