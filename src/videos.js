
const fs = require('fs');

let rawdata = fs.readFileSync('../videos.json');
let videos = JSON.parse(rawdata);

console.log(videos.categories);

for (const property in videos.categories) {
    console.log(JSON.stringify(property));
  }