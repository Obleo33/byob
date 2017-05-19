const csvFilePath='./raw_data/bgg_db_test.csv'
const csv=require('csvtojson')
const fs = require('fs');

let gamesArray = [];

csv()
.fromFile(csvFilePath)
.on('json',(jsonObj)=>{

  gamesArray.push(jsonObj)

})

.on('done',(error)=>{
  fs.writeFileSync('byob_games_json_test_file.json', JSON.stringify({ "games": gamesArray }))
    console.log('end')
})
