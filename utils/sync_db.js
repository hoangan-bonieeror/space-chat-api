module.exports = async function sync_db(...entities) {
    entities.forEach(async entity => {
        await entity.sync({ alter : true })
    })
} 