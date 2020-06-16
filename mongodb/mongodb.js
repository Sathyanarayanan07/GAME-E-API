// MongoDB connections
const config = require('config');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

class MongoDb {
    client;
    collection;
    constructor(client, collection) {
        this.client = client;
        this.collection = collection;
    }

    static connect = async (collectionName) => {
        const client = new MongoClient(config.get('dbConfig.url'), { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db(config.get('dbConfig.dbName'));
        const collection = db.collection(collectionName);
        return new MongoDb(client, collection);
    }

    findOne = async (filter) => {
        return await this.collection.findOne(filter);
    }

    findAll = async (filter = {},limit=5,skip=0) => {
        return await this.collection.find(filter).limit(limit).skip(skip).toArray();
    }

    getCount = async(filter = {}) => {
        return await this.collection.countDocuments(filter);
    }

    insertOne = async (document) => {
        return await this.collection.insertOne(document);
    }

    updateOne = async (id, document) => {
        return await this.collection.updateOne({ _id: new ObjectId(id) }, { $set: document })
    }

    deleteOne = async (id, document) => {
        return await this.collection.deleteOne({ _id: new ObjectId(id) }, { $set: document })
    }

    close = () => {
        this.client.close();
    }
}

module.exports = MongoDb;
