const path = require('path');
const fs = require('fs');

async function queryAll(database) {
    try {
        const rawData = fs.readFileSync(path.resolve(`../server/db/${database}.json`), {encoding: 'utf8'});
        return JSON.parse(rawData);
    } catch (error) {
        console.log(`error retrieving db ${database}`);
    }
}

function updateDatabase(database, payload) {
    const updatedData = JSON.stringify(payload, null, 2);
    fs.writeFile(path.resolve(`../server/db/${database}.json`), 
        updatedData, 
        (err) => console.log(err));
}


module.exports = { queryAll, updateDatabase }