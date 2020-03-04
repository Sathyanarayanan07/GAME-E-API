// MongoDB connections
const MongoClient = require('mongodb').MongoClient;
const { url, dbName } = require('../config/config');
const ObjectId = require('mongodb').ObjectId;

class MongoDb {
    client;
    collection;
    constructor(client, collection) {
        this.client = client;
        this.collection = collection;
    }

    static connect = async (collectionName) => {
        const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        return new MongoDb(client, collection);
    }

    findOne = async (filter) => {
        return await this.collection.findOne(filter);
    }

    findAll = async () => {
        return await this.collection.find().toArray();
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
