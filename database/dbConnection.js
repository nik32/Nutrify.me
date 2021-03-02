const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

const mongoURL = require("../config/keys").mongoURL;//store your mongo url in the file
let _db;

async function connect(runApp){
    try{
        connectionObj = await mongoClient.connect(mongoURL);
        console.log("Sucessfully Connected!!!: ");
        _db = connectionObj.db();
        runApp();
    }catch(err){
        console.log(err);
    }
}

const getDbRef = () => {
    if(_db)
        return _db;
    throw "No Refrence for the DB";    
}

module.exports.connect = connect;
module.exports.getDbRef = getDbRef;