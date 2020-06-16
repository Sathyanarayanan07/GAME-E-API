// Game Routes
const express = require('express');
const router = express.Router();
const Mongodb = require('../mongodb/mongodb');
const ObjectId = require('mongodb').ObjectId;
const collectionName = 'games';
const { gameSchema } = require('./game-model');

router.get('/all', async (req, res) => {
    const mongo = await Mongodb.connect(collectionName);
    const limit = +req.query.limit || 12;
    const pageNumber = +req.query.pageNumber || 1;
    const skip = (pageNumber - 1)*limit;
    let data,totalCount,currentCount,lastPage;
    let filter = Object.assign({},req.query);
    Object.keys(filter).map((key)=>{
        if(!filter[key] || (key == 'pageNumber'|| 'limit' )) {
            delete filter[key];
        }
    })
    if(filter.game_name) {
        filter['game_name'] = {'$regex': filter.game_name, '$options': 'i'};
    }
    if(filter.game_genre) {
        filter['game_genre._id'] = new ObjectId(filter.game_genre);
        delete filter['game_genre'];
    }
    if(filter.game_released_year) {
        filter.game_released_year = +filter.game_released_year;
    }
    if(filter.game_sharp_rating) {
        filter.game_sharp_rating = +filter.game_sharp_rating
    }
    data = await mongo.findAll(filter,limit,skip);
    totalCount = await mongo.getCount(filter)
    mongo.close();
    // Calculating current count
    currentCount = (data.length) ? data.length : 0; 
    // Calculating last Page
    if(totalCount < limit) {
        lastPage = 1;
    }
    else if((totalCount % limit) == 0) {
        lastPage = totalCount / limit;
    }
    else {
        lastPage = Math.trunc(totalCount / limit)+1;
    }
    res.send({ 
        totalCount : totalCount,
        currentCount: currentCount,
        currentPage: pageNumber,
        lastPage: lastPage,
        limit: limit,
        skipped: skip,
        data : data  
    });
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
    let { error } = gameSchema.validate(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }
    let data = await mongo.findOne({ game_name : req.body.game_name });
    if(data) {
        return res.status(409).send('Already Registered !');
    }
    data = await mongo.insertOne(req.body);
    mongo.close();
    res.send(data);
})

router.get('/search_term/', async (req, res) => {
    if(req.query.game_name) {
        const searchTerm = req.query.game_name;
        const mongo = await Mongodb.connect(collectionName);
        const data = await mongo.findAll({'game_name': {'$regex': searchTerm, '$options': 'i'}})
        return res.send(data);
    }
    res.status(400).send('Query string Missing!');
})

router.get('/genres', async (req, res) => {
        const mongo = await Mongodb.connect('genres');
        const data = await mongo.findAll({},100,0)
        return res.send(data);
})

module.exports = router
