const mongo = require('mongodb')
const MongoClient = mongo.MongoClient;
const mongoConfig = require('./config.json').mongoConfig;
async function getConnection() {
    return await MongoClient.connect(mongoConfig.databaseURL).catch(err => { throw err})
}
let connection = getConnection()
async function add(collection, ...object) {
    if(!connection) connection = getConnection()
    let db = connection.db(mongoConfig.databaseName)
    return await db.collection(collection).addAll(object).ops
}
async function get(collection, query) {
    if(!connection) connection = getConnection()
    let db = connection.db(mongoConfig.databaseName)
    return await db.collection(collection).find(query)
}
async function remove(collection, query) {
    if(!connection) connection = getConnection()
    let db = connection.db(mongoConfig.databaseName)
    await db.collection(collection).deleteMany(query)
}

module.exports = {add, get, remove}