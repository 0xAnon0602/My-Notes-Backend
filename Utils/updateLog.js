const Log = require("../Schemas/Log.js")

const updateLog = async(_googleId,_operation,_collection,_query) => {

    try{

        const timestampNow = Math.floor(Date.now() / 1000)
        console.log(_googleId,_operation,_collection)

        await Log.insertMany({
            googleId:_googleId,
            operation:_operation,
            collection: _collection,
            query:_query,
            timestamp: timestampNow
        })

    }catch(e){
        console.log(`Error updating log`)
    }

}

module.exports = updateLog