// User routes

const express = require('express');
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();
const Mongodb = require('../mongodb/mongodb');
const collectionName = 'users';

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

router.post('/register', async (req, res) => {
    const mongo = await Mongodb.connect(collectionName);
    const data = await mongo.insertOne(req.body);
    mongo.close();
    res.send(data);
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

module.exports = router;
