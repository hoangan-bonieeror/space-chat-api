const SYNC_DB_MODE = require("../const/const")

module.exports = async function sync_db(mode = SYNC_DB_MODE.ALTER, entities) {
    entities.forEach(async entity => {
        if(mode == SYNC_DB_MODE.ALTER) {
            await entity.sync({ alter : true })
        } else if(mode == SYNC_DB_MODE.FORCE) {
            await entity.sync({ force : true })
        }
    })
} 