import fs from 'fs';
import express from 'express';

const app = express();

app.use(express.static('public'));
app.use(express.static('styles'));
//app.use(express.static('src'));

// Get data
const data = fs.readFileSync('./videos.json');
const videos = JSON.parse(data).videos;
const categories = JSON.parse(data).categories;


app.set('view engine', 'ejs');


app.locals.secondsToHms = (d) => {
  d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + ":" : "";
    var mDisplay = m > 10 ? m + ":" : "0" + m +":";
    var sDisplay = s > 10 ? s : "0"+s;
    return hDisplay + mDisplay + sDisplay;
}

app.locals.dateDiff = (time) => {
  var today = new Date();
  var date = new Date(time);
  var dateDiff = today - date;
  return Math.round(dateDiff/86400000) + " daga gamalt";
}


app.get('/', (req, res) => {
  res.render('index', 
  {
    videos: videos,
    categories: categories
  });

});


app.get('/:id', (req, res) => {
  let videoId = req.params.id
  for(let i = 0; i < videos.length; i++) {
    if ( videos[i].id == videoId ){
      res.render('video', {video: videos[i]});
    }
  }

  res.status(404).send('Síða ekki til');
});




app.listen(4000, () => console.log('Example app listening on port 4000!'));


