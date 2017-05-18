const csvFilePath='./bgg_db_test_2.csv'
const csv=require('csvtojson')
const fs = require('fs');

let gamesArray = [];

csv()
.fromFile(csvFilePath)
.on('json',(jsonObj)=>{

  gamesArray.push(jsonObj)

})

.on('done',(error)=>{
  fs.writeFileSync('byob_games_jsonfile.json', JSON.stringify({ "games": gamesArray }))
    console.log('end')
})
